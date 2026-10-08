defmodule UliCommunity.Labs.B2P1 do
  @moduledoc """
  Context for the Labs B2_P1 Comments Classifier: channels, posts, their fetch settings,
  runs (one Apify run per post, then LLM classification) and the results.
  """
  import Ecto.Query, warn: false

  alias Ecto.Multi
  alias UliCommunity.Repo

  alias UliCommunity.Labs.B2P1.{
    Channels,
    CommentClassifications,
    Comments,
    Platforms,
    PostConfigs,
    Posts,
    Runs
  }

  alias UliCommunity.Workers.B2P1.FetchCommentsWorker

  @topic "labs_b2_p1"
  @in_progress [:queued, :fetching, :categorizing]
  # A run that's fetching/categorizing with no update for this long has stopped responding
  # (e.g. the server restarted mid-job). Apify runs are capped at 15 minutes.
  @stale_after_minutes 30
  @instagram_url ~r{^https?://(?:www\.)?instagram\.com/(?:[A-Za-z0-9_.]+/)?(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)}

  # ---- Live updates ----

  def subscribe, do: Phoenix.PubSub.subscribe(UliCommunity.PubSub, @topic)

  @doc "Tells every open B2_P1 page that something changed."
  def broadcast, do: Phoenix.PubSub.broadcast(UliCommunity.PubSub, @topic, :labs_b2_p1_updated)

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
  Adds posts to the channel and queues a run for each. Each entry is a map with a
  `"url"`, optional `"caption"` and `"context"`, and the `"config"` (fetch settings) for
  that post. Returns `{:ok, added_posts, errors}` where errors are `{url, message}` for
  invalid or already-added URLs.

  entries: [%{"url" => ..., "caption" => ..., "context" => ..., "config" => %{...}}, ...]
  """
  def add_posts(%Channels{} = channel, entries) do
    {added, errors} =
      entries
      |> Enum.map(&Map.update(&1, "url", "", fn url -> String.trim(url || "") end))
      |> Enum.reject(&(&1["url"] == ""))
      |> Enum.reduce({[], []}, fn entry, {added, errors} ->
        case add_post(channel, entry) do
          {:ok, post} -> {[post | added], errors}
          {:error, message} -> {added, [{entry["url"], message} | errors]}
        end
      end)

    if added != [], do: broadcast()
    {:ok, Enum.reverse(added), Enum.reverse(errors)}
  end

  defp add_post(channel, entry) do
    config_attrs = entry["config"] || %{}

    with {:ok, shortcode} <- parse_instagram_url(entry["url"]) do
      post_attrs = %{
        channel_id: channel.id,
        external_id: shortcode,
        # /p/ works for reels too, so every post is stored in this one form.
        url: "https://www.instagram.com/p/#{shortcode}/",
        caption: entry["caption"],
        context: entry["context"]
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

  @doc "Whether a run is still being processed. Stalled runs don't count, so they can be refetched."
  def in_progress?(%Runs{status: status} = run), do: status in @in_progress and not stale?(run)
  def in_progress?(_), do: false

  @doc """
  Whether a run is stuck: fetching or categorizing with no update for #{@stale_after_minutes}
  minutes. Queued runs never count: their Oban job is in the DB and runs after a restart.
  """
  def stale?(%Runs{status: status, updated_at: %DateTime{} = updated_at})
      when status in [:fetching, :categorizing] do
    DateTime.diff(DateTime.utc_now(), updated_at, :minute) >= @stale_after_minutes
  end

  def stale?(_), do: false

  def latest_run(%Posts{runs: [latest | _]}), do: latest
  def latest_run(_), do: nil

  @doc """
  Saves new fetch settings for the post (they become its default) and queues a new run.
  Refused while the post's latest run is still in progress.
  """
  def refetch(%Posts{} = post, config_attrs) do
    Multi.new()
    |> Multi.run(:post, fn repo, _ -> lock_post_for_refetch(repo, post.id) end)
    |> Multi.run(:stale_run, fn repo, %{post: post} -> fail_stale_run(repo, latest_run(post)) end)
    |> Multi.update(:config, fn %{post: post} ->
      PostConfigs.changeset(post.config, stringify(config_attrs))
    end)
    |> Multi.merge(fn %{post: post, config: config} -> run_multi(post, config) end)
    |> Repo.transaction()
    |> case do
      {:ok, %{run: run}} ->
        broadcast()
        {:ok, run}

      {:error, :post, :in_progress, _} ->
        {:error, "This post is already being processed."}

      {:error, _step, changeset, _} ->
        {:error, error_message(changeset)}
    end
  end

  # Locks the post's row (SELECT ... FOR UPDATE) before checking for a run in progress, so
  # two refetches at the same moment can't both pass the check and start two paid runs.
  # Also reloads the post, so the new run copies its latest caption and context.
  defp lock_post_for_refetch(repo, post_id) do
    post =
      from(p in Posts, where: p.id == ^post_id, lock: "FOR UPDATE")
      |> repo.one!()
      |> repo.preload([:config, runs: from(r in Runs, order_by: [desc: r.id])])

    if in_progress?(latest_run(post)), do: {:error, :in_progress}, else: {:ok, post}
  end

  # A refetch over a stalled run marks that run failed, so it doesn't stay "fetching" forever.
  defp fail_stale_run(repo, run) do
    if stale?(run) do
      run
      |> Runs.changeset(%{
        status: :failed,
        error: "Stopped responding (no progress for #{@stale_after_minutes}+ minutes).",
        finished_at: DateTime.utc_now() |> DateTime.truncate(:second)
      })
      |> repo.update()
    else
      {:ok, nil}
    end
  end

  @doc "Updates a post's optional caption and context; they're used from the next run on."
  def update_post_details(%Posts{} = post, attrs) do
    with {:ok, post} <- post |> Posts.details_changeset(attrs) |> Repo.update() do
      broadcast()
      {:ok, post}
    end
  end

  # Creates a queued run with a copy of the config and of the post's caption and context,
  # and queues the fetch job for it.
  defp run_multi(post, config) do
    Multi.new()
    |> Multi.insert(
      :run,
      Runs.changeset(%Runs{}, %{
        post_id: post.id,
        status: :queued,
        comment_limit: config.comment_limit,
        scraper: config.scraper,
        sort: config.sort,
        caption: post.caption,
        context: post.context
      })
    )
    |> Oban.insert(:job, fn %{run: run} -> FetchCommentsWorker.new(%{run_id: run.id}) end)
  end

  def get_run!(id), do: Runs |> Repo.get!(id) |> Repo.preload(post: :channel)

  @doc "The run's position among its post's runs (#1 is the oldest)."
  def run_number(%Runs{id: id, post_id: post_id}) do
    Repo.aggregate(from(r in Runs, where: r.post_id == ^post_id and r.id <= ^id), :count)
  end

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
