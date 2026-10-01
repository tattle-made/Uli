defmodule UliCommunity.Labs.P1.DummyData do
  @moduledoc """
  In-memory dummy data for the Labs P1 Comments Classifier prototype.

  Channels, posts and runs are hardcoded here. Comments are read from normalized
  sample files in `<python path>/scraper_output/labs_p1`, which are not committed. Categories come only
  from the OpenAI response files (`llm_response_*.json`) in the same folder; a comment
  without an LLM result shows as not categorized. Runs started from
  the UI are simulated with timers and broadcast on `topic/0`, so every open
  page updates live. State lives in this process and resets on restart.
  """
  use GenServer

  @topic "labs_p1"
  @comment_files ["comments_basic.json", "comments_with_replies.json", "comments_pavi212.json"]

  # Seconds spent in each stage of a simulated run.
  @stage_durations [queued: 2, fetching: 7, categorizing: 6]

  @platforms [
    %{id: 1, slug: "instagram", name: "Instagram", content_types: ["post", "reel", "story"]}
  ]

  @default_config %{comment_limit: 100, scraper: "basic", sort: "recent"}

  @instagram_url ~r{^https?://(www\.)?instagram\.com/(p|reel|reels)/([A-Za-z0-9_-]+)/?(\?.*)?$}

  # ---- Public API ----

  def start_link(_opts), do: GenServer.start_link(__MODULE__, nil, name: __MODULE__)

  def topic, do: @topic
  def subscribe, do: Phoenix.PubSub.subscribe(UliCommunity.PubSub, @topic)

  def platforms, do: @platforms
  def default_config, do: @default_config

  def list_channels, do: GenServer.call(__MODULE__, :list_channels)
  def get_channel(id), do: GenServer.call(__MODULE__, {:get_channel, to_id(id)})
  def list_posts(channel_id), do: GenServer.call(__MODULE__, {:list_posts, to_id(channel_id)})
  def get_post(id), do: GenServer.call(__MODULE__, {:get_post, to_id(id)})

  def create_channel(attrs), do: GenServer.call(__MODULE__, {:create_channel, attrs})

  @doc "Adds one post per valid URL and starts a run for each. Returns `{:ok, added, errors}`."
  def add_posts(channel_id, urls, config),
    do: GenServer.call(__MODULE__, {:add_posts, to_id(channel_id), urls, config})

  def refetch(post_id, config), do: GenServer.call(__MODULE__, {:refetch, to_id(post_id), config})

  def reset, do: GenServer.call(__MODULE__, :reset)

  @doc "Comments for a run: categorized sample comments for the run's post URL and scraper."
  def comments_for_run(nil), do: []

  def comments_for_run(run) do
    all = comments()
    exact = Enum.filter(all, &(&1["post_url"] == run.data_url and &1["scraper"] == run.scraper))

    if exact != [] do
      exact
    else
      Enum.filter(all, &(&1["post_url"] == run.data_url))
    end
    |> Enum.take(run.comment_limit)
  end

  def category_counts(comments) do
    Enum.reduce(comments, %{"abusive" => 0, "neutral_spam" => 0, "worth_engaging" => 0}, fn c,
                                                                                            acc ->
      Map.update(acc, c["category"], 1, &(&1 + 1))
    end)
  end

  def data_available?, do: comments() != []

  # ---- GenServer ----

  @impl true
  def init(_) do
    {:ok, seed()}
  end

  @impl true
  def handle_call(:list_channels, _from, state) do
    channels =
      Enum.map(state.channels, fn ch ->
        posts = Enum.filter(state.posts, &(&1.channel_id == ch.id))
        runs = Enum.filter(state.runs, fn r -> Enum.any?(posts, &(&1.id == r.post_id)) end)
        last = runs |> Enum.map(& &1.started_at) |> Enum.max(DateTime, fn -> nil end)
        Map.merge(ch, %{post_count: length(posts), last_run_at: last})
      end)

    {:reply, channels, state}
  end

  def handle_call({:get_channel, id}, _from, state) do
    {:reply, Enum.find(state.channels, &(&1.id == id)), state}
  end

  def handle_call({:list_posts, channel_id}, _from, state) do
    posts =
      state.posts
      |> Enum.filter(&(&1.channel_id == channel_id))
      |> Enum.sort_by(& &1.added_at, {:desc, DateTime})
      |> Enum.map(&with_runs(&1, state))

    {:reply, posts, state}
  end

  def handle_call({:get_post, id}, _from, state) do
    post = Enum.find(state.posts, &(&1.id == id))
    {:reply, post && with_runs(post, state), state}
  end

  def handle_call({:create_channel, attrs}, _from, state) do
    name = String.trim(attrs["name"] || "")
    handle = attrs["handle"] |> to_string() |> String.trim() |> String.trim_leading("@")

    cond do
      name == "" or handle == "" ->
        {:reply, {:error, "Name and handle are required."}, state}

      Enum.any?(state.channels, &(&1.handle == handle)) ->
        {:reply, {:error, "A channel with @#{handle} already exists."}, state}

      true ->
        {id, state} = next_id(state)

        channel = %{
          id: id,
          name: name,
          handle: handle,
          platform: "instagram",
          added_at: now()
        }

        state = %{state | channels: state.channels ++ [channel]}
        broadcast()
        {:reply, {:ok, channel}, state}
    end
  end

  def handle_call({:add_posts, channel_id, urls, config}, _from, state) do
    config = normalize_config(config)
    existing = state.posts |> Enum.filter(&(&1.channel_id == channel_id)) |> Enum.map(& &1.url)

    {added, errors, state} =
      urls
      |> Enum.map(&String.trim/1)
      |> Enum.reject(&(&1 == ""))
      |> Enum.uniq()
      |> Enum.reduce({[], [], state}, fn url, {added, errors, state} ->
        case parse_url(url) do
          {:ok, clean_url, content_type} ->
            if clean_url in existing do
              {added, errors ++ [{url, "already added to this channel"}], state}
            else
              {post, state} = insert_post(state, channel_id, clean_url, content_type, config)
              {added ++ [post], errors, start_run(state, post, config)}
            end

          :error ->
            {added, errors ++ [{url, "not an Instagram post or reel URL"}], state}
        end
      end)

    if added != [], do: broadcast()
    {:reply, {:ok, added, errors}, state}
  end

  def handle_call({:refetch, post_id, config}, _from, state) do
    post = Enum.find(state.posts, &(&1.id == post_id))
    latest = post && latest_run(state, post_id)

    cond do
      is_nil(post) ->
        {:reply, {:error, "Post not found."}, state}

      latest && latest.status in [:queued, :fetching, :categorizing] ->
        {:reply, {:error, "This post is already being processed."}, state}

      true ->
        config = normalize_config(config)
        post = %{post | config: config}
        state = %{state | posts: replace_by_id(state.posts, post)}
        state = start_run(state, post, config)
        broadcast()
        {:reply, :ok, state}
    end
  end

  def handle_call(:reset, _from, _state) do
    # Also re-read the comment and LLM response files on the next access.
    :persistent_term.erase({__MODULE__, :comments})
    broadcast()
    {:reply, :ok, seed()}
  end

  @impl true
  def handle_info({:advance, run_id}, state) do
    case Enum.find(state.runs, &(&1.id == run_id)) do
      nil ->
        {:noreply, state}

      run ->
        run = advance(run)
        state = %{state | runs: replace_by_id(state.runs, run)}
        if run.status != :done, do: schedule_advance(run)
        broadcast()
        {:noreply, state}
    end
  end

  # ---- Internals ----

  defp advance(%{status: :queued} = run), do: %{run | status: :fetching}

  defp advance(%{status: :fetching} = run) do
    %{run | status: :categorizing, fetched: length(comments_for_run(run))}
  end

  defp advance(%{status: :categorizing} = run), do: %{run | status: :done, finished_at: now()}

  defp schedule_advance(run) do
    Process.send_after(self(), {:advance, run.id}, @stage_durations[run.status] * 1000)
  end

  defp start_run(state, post, config) do
    {id, state} = next_id(state)
    number = Enum.count(state.runs, &(&1.post_id == post.id)) + 1

    run =
      Map.merge(config, %{
        id: id,
        post_id: post.id,
        number: number,
        status: :queued,
        fetched: nil,
        data_url: post.data_url,
        started_at: now(),
        finished_at: nil,
        error: nil
      })

    schedule_advance(run)
    %{state | runs: state.runs ++ [run]}
  end

  defp insert_post(state, channel_id, url, content_type, config) do
    {id, state} = next_id(state)

    post = %{
      id: id,
      channel_id: channel_id,
      url: url,
      title: nil,
      content_type: content_type,
      config: config,
      data_url: demo_data_url(url),
      added_at: now()
    }

    {post, %{state | posts: state.posts ++ [post]}}
  end

  # Posts added from the UI don't have sample comments of their own, so they borrow
  # one of the sample posts' comments (picked by URL, so it's stable).
  defp demo_data_url(url) do
    urls = comments() |> Enum.map(& &1["post_url"]) |> Enum.uniq() |> Enum.sort()

    cond do
      url in urls -> url
      urls == [] -> url
      true -> Enum.at(urls, :erlang.phash2(url, length(urls)))
    end
  end

  defp with_runs(post, state) do
    runs =
      state.runs
      |> Enum.filter(&(&1.post_id == post.id))
      |> Enum.sort_by(& &1.number, :desc)

    latest = List.first(runs)

    counts =
      if latest && latest.status == :done, do: category_counts(comments_for_run(latest))

    Map.merge(post, %{runs: runs, latest_run: latest, counts: counts})
  end

  defp latest_run(state, post_id) do
    state.runs |> Enum.filter(&(&1.post_id == post_id)) |> Enum.max_by(& &1.number, fn -> nil end)
  end

  defp parse_url(url) do
    case Regex.run(@instagram_url, url) do
      [_, _, kind, code | _] ->
        {:ok, "https://www.instagram.com/#{if kind == "p", do: "p", else: "reel"}/#{code}/",
         if(kind == "p", do: "post", else: "reel")}

      _ ->
        :error
    end
  end

  defp normalize_config(config) do
    limit =
      case Integer.parse(to_string(config["comment_limit"] || "")) do
        {n, _} when n > 0 -> min(n, 1000)
        _ -> @default_config.comment_limit
      end

    # Sort ("recent" or "popular") only exists for the comments-only scraper.
    if config["scraper"] == "with_replies" do
      %{comment_limit: limit, scraper: "with_replies", sort: nil}
    else
      %{
        comment_limit: limit,
        scraper: "basic",
        sort: if(config["sort"] == "popular", do: "popular", else: "recent")
      }
    end
  end

  defp next_id(state), do: {state.next_id, %{state | next_id: state.next_id + 1}}

  defp replace_by_id(list, item), do: Enum.map(list, &if(&1.id == item.id, do: item, else: &1))

  defp broadcast, do: Phoenix.PubSub.broadcast(UliCommunity.PubSub, @topic, :labs_p1_updated)

  defp now, do: DateTime.utc_now() |> DateTime.truncate(:second)

  defp to_id(id) when is_integer(id), do: id

  defp to_id(id) do
    case Integer.parse(to_string(id)) do
      {n, ""} -> n
      _ -> nil
    end
  end

  defp comments do
    case :persistent_term.get({__MODULE__, :comments}, nil) do
      nil ->
        loaded = load_comments()
        :persistent_term.put({__MODULE__, :comments}, loaded)
        loaded

      loaded ->
        loaded
    end
  end

  # Loads the sample comments, keeps only posts that have an LLM response, and takes
  # category + remark from those responses (never from the comment files themselves).
  defp load_comments do
    # Same python folder the scraper uses: lib/python in dev, /app/lib/python in prod.
    python_path = Application.get_env(:uli_community, :python)[:python_path]
    dir = Path.join([python_path, "scraper_output", "labs_p1"])

    responses =
      Path.join(dir, "llm_response_*.json")
      |> Path.wildcard()
      |> Enum.map(&read_json(&1, %{}))

    labelled_posts = MapSet.new(responses, & &1["post_url"])

    labels =
      for response <- responses,
          result <- get_in(response, ["response", "results"]) || [],
          into: %{},
          do: {result["comment_id"], result}

    @comment_files
    |> Enum.flat_map(&read_json(Path.join(dir, &1), []))
    |> Enum.filter(&MapSet.member?(labelled_posts, &1["post_url"]))
    |> Enum.map(fn c ->
      label = labels[c["id"]] || %{}
      Map.merge(c, %{"category" => label["category"], "remark" => label["remark"]})
    end)
  end

  defp read_json(path, default) do
    with {:ok, body} <- File.read(path),
         {:ok, data} <- Jason.decode(body) do
      data
    else
      _ -> default
    end
  end

  # ---- Seed data ----

  defp seed do
    t = fn iso ->
      {:ok, dt, _} = DateTime.from_iso8601(iso)
      dt
    end

    ig = fn code -> "https://www.instagram.com/p/#{code}/" end
    basic = fn limit -> %{comment_limit: limit, scraper: "basic", sort: "recent"} end

    replies = fn limit -> %{comment_limit: limit, scraper: "with_replies", sort: nil} end

    channels = [
      %{
        id: 1,
        name: "pavi212",
        handle: "pavi212",
        platform: "instagram",
        added_at: t.("2026-10-01T03:15:00Z")
      },
      %{
        id: 2,
        name: "National Geographic",
        handle: "natgeo",
        platform: "instagram",
        added_at: t.("2026-09-08T10:00:00Z")
      }
    ]

    post = fn id, channel_id, url, title, type, config, added ->
      %{
        id: id,
        channel_id: channel_id,
        url: url,
        title: title,
        content_type: type,
        config: config,
        data_url: demo_data_url(url),
        added_at: t.(added)
      }
    end

    posts = [
      post.(10, 1, ig.("DUK4C5mk5Ux"), nil, "post", replies.(200), "2026-10-01T03:18:00Z"),
      post.(11, 1, ig.("DJ376DtymVB"), nil, "post", replies.(200), "2026-10-01T03:17:00Z"),
      post.(
        20,
        2,
        ig.("DdHGxUwOKug"),
        "Everest: The Other Side",
        "reel",
        basic.(50),
        "2026-09-11T13:50:00Z"
      ),
      post.(
        21,
        2,
        ig.("DdFLUBol7Wx"),
        "9/11: Seventeen minutes",
        "post",
        replies.(150),
        "2026-09-10T09:00:00Z"
      )
    ]

    run = fn id, post_id, config, url, fetched, started, finished ->
      Map.merge(config, %{
        id: id,
        post_id: post_id,
        number: 1,
        status: :done,
        fetched: fetched,
        data_url: url,
        started_at: t.(started),
        finished_at: t.(finished),
        error: nil
      })
    end

    runs = [
      run.(
        100,
        10,
        replies.(200),
        ig.("DUK4C5mk5Ux"),
        95,
        "2026-10-01T03:20:00Z",
        "2026-10-01T03:36:00Z"
      ),
      run.(
        101,
        11,
        replies.(200),
        ig.("DJ376DtymVB"),
        107,
        "2026-10-01T03:20:00Z",
        "2026-10-01T03:36:00Z"
      ),
      run.(
        102,
        20,
        basic.(50),
        ig.("DdHGxUwOKug"),
        45,
        "2026-09-11T14:01:00Z",
        "2026-09-11T14:03:20Z"
      ),
      run.(
        103,
        21,
        replies.(150),
        ig.("DdFLUBol7Wx"),
        147,
        "2026-09-12T11:00:00Z",
        "2026-09-12T11:06:30Z"
      )
    ]

    %{channels: channels, posts: posts, runs: runs, next_id: 1000}
  end
end
