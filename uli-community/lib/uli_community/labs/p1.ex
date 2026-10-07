defmodule UliCommunity.Labs.P1 do
  @moduledoc """
  Context for the Labs P1 Comments Classifier: channels, posts, their fetch settings,
  runs (one Apify run per post, then LLM classification) and the results.
  """
  import Ecto.Query, warn: false

  alias Ecto.Multi
  alias UliCommunity.Repo

  alias UliCommunity.Labs.P1.{
    Channels,
    CommentClassifications,
    Comments,
    Platforms,
    PostConfigs,
    Posts,
    Runs
  }

  alias UliCommunity.Workers.P1.FetchCommentsWorker

  @topic "labs_p1"
  @in_progress [:queued, :fetching, :categorizing]
  @instagram_url ~r{^https?://(?:www\.)?instagram\.com/(?:[A-Za-z0-9_.]+/)?(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)}

  # ---- Live updates ----

  def subscribe, do: Phoenix.PubSub.subscribe(UliCommunity.PubSub, @topic)

  @doc "Tells every open P1 page that something changed."
  def broadcast, do: Phoenix.PubSub.broadcast(UliCommunity.PubSub, @topic, :labs_p1_updated)

  # ---- Platforms & channels ----

  def list_platforms, do: Repo.all(from p in Platforms, order_by: p.name)

  def get_platform_by_slug!(slug), do: Repo.get_by!(Platforms, slug: slug)

  @doc "Channels with their platform, post count and the start of their latest run."
  def list_channels do
    last_runs =
      from r in Runs,
        join: p in assoc(r, :post),
        group_by: p.channel_id,
        select: %{channel_id: p.channel_id, last_run_at: max(r.inserted_at)}

    post_counts =
      from p in Posts,
        group_by: p.channel_id,
        select: %{channel_id: p.channel_id, count: count(p.id)}

    Repo.all(
      from c in Channels,
        left_join: lr in subquery(last_runs),
        on: lr.channel_id == c.id,
        left_join: pc in subquery(post_counts),
        on: pc.channel_id == c.id,
        order_by: [desc: c.inserted_at],
        preload: [:platform],
        select: %{channel: c, post_count: coalesce(pc.count, 0), last_run_at: lr.last_run_at}
    )
  end

  def get_channel!(id), do: Channels |> Repo.get!(id) |> Repo.preload(:platform)

  def create_channel(attrs) do
    with {:ok, channel} <- %Channels{} |> Channels.changeset(attrs) |> Repo.insert() do
      broadcast()
      {:ok, channel}
    end
  end

  # ---- Posts ----

  @doc "A channel's posts, newest first, with config and runs (newest first) preloaded."
  def list_posts(channel_id) do
    Repo.all(
      from p in Posts,
        where: p.channel_id == ^channel_id,
        order_by: [desc: p.inserted_at],
        preload: [:config, runs: ^from(r in Runs, order_by: [desc: r.id])]
    )
  end

  def get_post!(id) do
    Posts
    |> Repo.get!(id)
    |> Repo.preload([:config, :channel, runs: from(r in Runs, order_by: [desc: r.id])])
  end

  @doc """
  Adds one post per valid Instagram URL to the channel, with the given fetch settings,
  and queues a run for each. Returns `{:ok, added_posts, errors}` where errors are
  `{url, message}` for invalid or already-added URLs.
  """
  def add_posts(%Channels{} = channel, urls, config_attrs) do
    {added, errors} =
      urls
      |> Enum.map(&String.trim/1)
      |> Enum.reject(&(&1 == ""))
      |> Enum.uniq()
      |> Enum.reduce({[], []}, fn url, {added, errors} ->
        case add_post(channel, url, config_attrs) do
          {:ok, post} -> {[post | added], errors}
          {:error, message} -> {added, [{url, message} | errors]}
        end
      end)

    if added != [], do: broadcast()
    {:ok, Enum.reverse(added), Enum.reverse(errors)}
  end

  defp add_post(channel, url, config_attrs) do
    with {:ok, shortcode} <- parse_instagram_url(url) do
      post_attrs = %{
        channel_id: channel.id,
        external_id: shortcode,
        # /p/ works for reels too, so every post is stored in this one form.
        url: "https://www.instagram.com/p/#{shortcode}/"
      }

      Multi.new()
      |> Multi.insert(:post, Posts.changeset(%Posts{}, post_attrs))
      |> Multi.insert(:config, fn %{post: post} ->
        PostConfigs.changeset(
          %PostConfigs{},
          Map.put(stringify(config_attrs), "post_id", post.id)
        )
      end)
      |> Multi.merge(fn %{post: post, config: config} -> run_multi(post, config) end)
      |> Repo.transaction()
      |> case do
        {:ok, %{post: post}} -> {:ok, post}
        {:error, _step, changeset, _} -> {:error, error_message(changeset)}
      end
    end
  end

  @doc "Extracts the shortcode from an Instagram post or reel URL."
  def parse_instagram_url(url) do
    case Regex.run(@instagram_url, url) do
      [_, shortcode] -> {:ok, shortcode}
      _ -> {:error, "not an Instagram post or reel URL"}
    end
  end

  # ---- Runs ----

  def in_progress?(%Runs{status: status}), do: status in @in_progress
  def in_progress?(_), do: false

  def latest_run(%Posts{runs: [latest | _]}), do: latest
  def latest_run(_), do: nil

  @doc """
  Saves new fetch settings for the post (they become its default) and queues a new run.
  Refused while the post's latest run is still in progress.
  """
  def refetch(%Posts{} = post, config_attrs) do
    post =
      Repo.preload(post, [:config, runs: from(r in Runs, order_by: [desc: r.id])], force: true)

    if in_progress?(latest_run(post)) do
      {:error, "This post is already being processed."}
    else
      Multi.new()
      |> Multi.update(:config, PostConfigs.changeset(post.config, stringify(config_attrs)))
      |> Multi.merge(fn %{config: config} -> run_multi(post, config) end)
      |> Repo.transaction()
      |> case do
        {:ok, %{run: run}} ->
          broadcast()
          {:ok, run}

        {:error, _step, changeset, _} ->
          {:error, error_message(changeset)}
      end
    end
  end

  # Creates a queued run with a copy of the config and queues the fetch job for it.
  defp run_multi(post, config) do
    Multi.new()
    |> Multi.insert(
      :run,
      Runs.changeset(%Runs{}, %{
        post_id: post.id,
        status: :queued,
        comment_limit: config.comment_limit,
        scraper: config.scraper,
        sort: config.sort
      })
    )
    |> Oban.insert(:job, fn %{run: run} -> FetchCommentsWorker.new(%{run_id: run.id}) end)
  end

  def get_run!(id), do: Runs |> Repo.get!(id) |> Repo.preload(post: :channel)

  @doc "Updates a run (used by the workers) and notifies open pages."
  def update_run(%Runs{} = run, attrs) do
    with {:ok, run} <- run |> Runs.changeset(attrs) |> Repo.update() do
      broadcast()
      {:ok, run}
    end
  end

  # ---- Results ----

  @doc """
  A run's comments, oldest first, each with its current classification (the newest one,
  highest id), as `{comment, classification_or_nil}`.
  """
  def comments_with_classification(run_id) do
    Repo.all(
      from c in Comments,
        where: c.run_id == ^run_id,
        left_join: cl in subquery(latest_classifications()),
        on: cl.comment_id == c.id,
        order_by: [asc: c.commented_at, asc: c.id],
        select: {c, cl}
    )
  end

  @doc "Counts of current categories for a run, e.g. %{abusive: 2, neutral_spam: 80, nil => 3}."
  def category_counts(run_id) do
    Repo.all(
      from c in Comments,
        where: c.run_id == ^run_id,
        left_join: cl in subquery(latest_classifications()),
        on: cl.comment_id == c.id,
        group_by: cl.category,
        select: {cl.category, count(c.id)}
    )
    |> Map.new()
  end

  @doc "A run's comments that have no classification yet for the given prompt version."
  def comments_to_classify(run_id, prompt_version) do
    Repo.all(
      from c in Comments,
        as: :comment,
        where: c.run_id == ^run_id,
        where:
          not exists(
            from cl in CommentClassifications,
              where:
                cl.comment_id == parent_as(:comment).id and cl.prompt_version == ^prompt_version
          ),
        order_by: c.id
    )
  end

  defp latest_classifications do
    from cl in CommentClassifications,
      distinct: cl.comment_id,
      order_by: [asc: cl.comment_id, desc: cl.id]
  end

  # ---- Helpers ----

  defp stringify(attrs), do: Map.new(attrs, fn {k, v} -> {to_string(k), v} end)

  defp error_message(%Ecto.Changeset{} = changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
    |> Enum.map_join("; ", fn
      # Unique-index errors land on the first key column; the message says it all.
      {:channel_id, msgs} -> Enum.join(msgs, ", ")
      {field, msgs} -> "#{field} #{Enum.join(msgs, ", ")}"
    end)
  end

  defp error_message(other), do: inspect(other)
end
