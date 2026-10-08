defmodule UliCommunityWeb.Labs.B2P1.PostLive do
  use UliCommunityWeb, :live_view

  import UliCommunityWeb.Labs.B2P1.Components
  alias UliCommunity.Labs.B2P1

  @stages [
    queued: "Queued",
    fetching: "Fetching comments",
    categorizing: "Categorizing",
    done: "Done"
  ]

  def mount(%{"id" => id}, _session, socket) do
    case load_post(id) do
      nil ->
        {:ok,
         socket
         |> put_flash(:error, "Post not found.")
         |> push_navigate(to: ~p"/labs/b2_p1/channels")}

      post ->
        if connected?(socket), do: B2P1.subscribe()

        {:ok,
         assign(socket,
           page_title: "#{post.title || "Post"} · Labs B2_P1",
           post: post,
           channel: B2P1.get_channel!(post.channel_id),
           run_id: nil,
           tab: "categorized",
           filter: "all",
           expanded: MapSet.new(),
           raw_open: MapSet.new(),
           refetch_post: nil,
           # Comments picked for the creator report, reset whenever another run is shown.
           selected: MapSet.new(),
           selection_run_id: nil,
           show_report: false
         )
         |> load_run()}
    end
  end

  def handle_params(params, _uri, socket) do
    run_id =
      case Integer.parse(params["run"] || "") do
        {n, _} -> n
        :error -> nil
      end

    {:noreply, socket |> assign(run_id: run_id) |> load_run()}
  end

  def handle_info(:labs_b2_p1_updated, socket) do
    case load_post(socket.assigns.post.id) do
      nil -> {:noreply, push_navigate(socket, to: ~p"/labs/b2_p1/channels")}
      post -> {:noreply, socket |> assign(post: post) |> load_run()}
    end
  end

  def handle_event("select_run", %{"run" => run_id}, socket) do
    {:noreply,
     push_patch(socket, to: ~p"/labs/b2_p1/posts/#{socket.assigns.post.id}?run=#{run_id}")}
  end

  def handle_event("tab", %{"tab" => tab}, socket), do: {:noreply, assign(socket, tab: tab)}
  def handle_event("filter", %{"filter" => f}, socket), do: {:noreply, assign(socket, filter: f)}

  def handle_event("toggle_replies", %{"id" => id}, socket),
    do: {:noreply, assign(socket, expanded: toggle(socket.assigns.expanded, id))}

  def handle_event("toggle_raw", %{"id" => id}, socket),
    do: {:noreply, assign(socket, raw_open: toggle(socket.assigns.raw_open, id))}

  def handle_event("open_refetch", _, socket),
    do: {:noreply, assign(socket, refetch_post: socket.assigns.post)}

  def handle_event("close_modal", _, socket),
    do: {:noreply, assign(socket, refetch_post: nil, show_report: false)}

  def handle_event("toggle_select", %{"id" => id}, socket),
    do: {:noreply, assign(socket, selected: toggle(socket.assigns.selected, id))}

  # Select all / Clear only act on the current view (All, or one category);
  # what's selected in other views is kept.
  def handle_event("select_all", _, socket) do
    %{selected: selected, comments: comments, filter: filter} = socket.assigns
    {:noreply, assign(socket, selected: MapSet.union(selected, view_ids(comments, filter)))}
  end

  def handle_event("select_none", _, socket) do
    %{selected: selected, comments: comments, filter: filter} = socket.assigns
    {:noreply, assign(socket, selected: MapSet.difference(selected, view_ids(comments, filter)))}
  end

  def handle_event("open_report", _, socket), do: {:noreply, assign(socket, show_report: true)}

  def handle_event("refetch", %{"post_id" => id, "config" => config}, socket) do
    case B2P1.refetch(socket.assigns.post, config) do
      {:ok, _run} ->
        # Jump to the new run.
        {:noreply,
         socket
         |> put_flash(:info, "Refetch queued.")
         |> assign(refetch_post: nil)
         |> push_patch(to: ~p"/labs/b2_p1/posts/#{id}")}

      {:error, msg} ->
        {:noreply, socket |> put_flash(:error, msg) |> assign(refetch_post: nil)}
    end
  end

  defp toggle(set, id),
    do: if(MapSet.member?(set, id), do: MapSet.delete(set, id), else: MapSet.put(set, id))

  # The post with numbered runs and the latest run, or nil if it no longer exists.
  defp load_post(id) do
    case UliCommunity.Repo.get(B2P1.Posts, id) do
      nil -> nil
      _ -> id |> B2P1.get_post!() |> with_run_info()
    end
  end

  defp load_run(socket) do
    %{post: post, run_id: run_id} = socket.assigns
    run = Enum.find(post.runs, &(&1.id == run_id)) || post.latest_run
    comments = if run && run.status == :done, do: comment_rows(run), else: []

    socket =
      if socket.assigns.selection_run_id == (run && run.id) do
        socket
      else
        assign(socket, selected: default_selection(comments), selection_run_id: run && run.id)
      end

    assign(socket,
      run: run,
      comments: comments,
      counts: count_categories(comments),
      by_id: Map.new(comments, &{&1["id"], &1}),
      replies: comments |> Enum.filter(& &1["parent_id"]) |> Enum.group_by(& &1["parent_id"])
    )
  end

  # The run's comments as the maps the templates use. Within a run, comments are keyed by
  # their platform ID, which is also what replies point to (parent_id).
  defp comment_rows(run) do
    for {c, cl} <- B2P1.comments_with_classification(run.id) do
      %{
        "id" => c.external_id,
        "parent_id" => c.parent_external_id,
        "url" => c.url,
        "text" => c.text,
        "author_username" => c.author_username,
        "author_verified" => c.author_verified,
        "commented_at" => c.commented_at,
        "likes" => c.likes,
        "reply_count" => c.reply_count,
        "scraper" => to_string(run.scraper),
        "category" => cl && to_string(cl.category),
        "remark" => cl && cl.remark,
        "raw" => c.raw
      }
    end
  end

  defp count_categories(comments) do
    comments |> Enum.frequencies_by(& &1["category"]) |> string_counts()
  end

  # Abusive and worth-engaging comments are what the creator most needs to see.
  defp default_selection(comments) do
    comments
    |> Enum.filter(&(&1["category"] in ["abusive", "worth_engaging"]))
    |> MapSet.new(& &1["id"])
  end

  @report_sections [
    {"abusive", "ABUSIVE", "These may be worth reporting, hiding or blocking."},
    {"worth_engaging", "WORTH ENGAGING", "These may be worth a reply."},
    {"neutral_spam", "NEUTRAL / SPAM", nil},
    {nil, "NOT CATEGORIZED", nil}
  ]

  # Plain-text email body for the creator, grouped by category.
  defp report_text(assigns) do
    %{channel: channel, post: post, comments: comments, selected: selected, by_id: by_id} =
      assigns

    picked = Enum.filter(comments, &MapSet.member?(selected, &1["id"]))

    sections =
      for {category, title, hint} <- @report_sections,
          group = Enum.filter(picked, &(&1["category"] == category)),
          group != [] do
        items =
          group
          |> Enum.with_index(1)
          |> Enum.map(fn {c, i} ->
            parent = by_id[c["parent_id"]]
            reply = if parent, do: " (reply to @#{parent["author_username"]})", else: ""
            text = (c["text"] || "") |> String.replace(~r/\s+/, " ") |> String.trim()
            text = if text == "", do: "(sticker or GIF)", else: "\"#{text}\""
            link = c["url"] || post.url

            "#{i}. @#{c["author_username"]}#{reply}: #{text}\n" <>
              if(c["remark"], do: "   Why: #{c["remark"]}\n", else: "") <>
              "   Link: #{link}"
          end)

        Enum.join(["#{title} (#{length(group)})" | List.wrap(hint)] ++ items, "\n")
      end

    Enum.join(
      [
        "Hi @#{channel.handle},",
        "Here's a summary of comments on your post that may need your attention.",
        "Post: #{post.url}" | sections
      ],
      "\n\n"
    )
  end

  # IDs of every comment in a view, replies included.
  defp view_ids(comments, "all"), do: MapSet.new(comments, & &1["id"])

  defp view_ids(comments, category),
    do: comments |> Enum.filter(&(&1["category"] == category)) |> MapSet.new(& &1["id"])

  defp visible_comments(comments, "all"), do: Enum.reject(comments, & &1["parent_id"])
  defp visible_comments(comments, f), do: Enum.filter(comments, &(&1["category"] == f))

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-5xl">
      <.breadcrumbs crumbs={[
        {"Channels", ~p"/labs/b2_p1/channels"},
        {"@#{@channel.handle}", ~p"/labs/b2_p1/channels/#{@channel.id}"},
        {@post.title || "Post", nil}
      ]} />

      <%!-- Header --%>
      <div class="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-zinc-900">{@post.title || "Untitled post"}</h1>
            <a
              href={@post.url}
              target="_blank"
              rel="noopener"
              class="mt-1 inline-flex items-center gap-1 break-all text-sm text-zinc-500 hover:text-zinc-800 hover:underline"
            >
              {@post.url} <.icon name="hero-arrow-top-right-on-square-mini" class="h-3.5 w-3.5" />
            </a>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span class="rounded bg-zinc-100 px-1.5 py-0.5 font-medium uppercase">
                {@post.content_type}
              </span>
              <span>Current settings: {config_summary(@post.config)}</span>
            </div>
          </div>
          <.button phx-click="open_refetch" disabled={in_progress?(@post.latest_run)}>
            <.icon name="hero-arrow-path-mini" class="-ml-0.5 h-4 w-4" />
            {if @post.latest_run, do: "Refetch", else: "Fetch comments"}
          </.button>
        </div>

        <div
          :if={@post.runs != []}
          class="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4"
        >
          <form phx-change="select_run" class="flex items-center gap-2 text-sm">
            <label for="run-picker" class="font-semibold text-zinc-700">Run</label>
            <select
              id="run-picker"
              name="run"
              class="rounded-lg border-zinc-300 py-1.5 text-sm focus:border-zinc-400 focus:ring-0"
            >
              <option :for={r <- @post.runs} value={r.id} selected={@run && r.id == @run.id}>
                #{r.number} · {format_dt(r.started_at || r.inserted_at)} · {r.comment_limit} comments, {scraper_label(
                  r.scraper
                )}{if r == @post.latest_run, do: " (latest)"}
              </option>
            </select>
          </form>
          <.status_badge run={@run} />
          <span :if={@run && @run.fetched_count} class="text-xs text-zinc-500">
            {@run.fetched_count} comments fetched
          </span>
        </div>
      </div>

      <%!-- Body --%>
      <%= cond do %>
        <% is_nil(@run) -> %>
          <div class="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <p class="font-semibold text-zinc-800">Comments haven't been fetched yet</p>
            <p class="mt-1 text-sm text-zinc-500">Start a run to fetch and categorize comments.</p>
          </div>
        <% @run.status == :failed -> %>
          <div class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <div class="flex items-center gap-2 font-semibold">
              <.icon name="hero-exclamation-triangle" class="h-5 w-5" /> Run #{@run.number} failed
            </div>
            <p class="mt-2">{@run.error}</p>
            <p class="mt-2 text-red-700">Check the URL and refetch, or pick an earlier run above.</p>
          </div>
        <% in_progress?(@run) -> %>
          <.progress_steps run={@run} />
        <% true -> %>
          <.results {assigns} />
      <% end %>

      <.refetch_modal :if={@refetch_post} post={@refetch_post} />

      <.modal :if={@show_report} id="report-modal" show on_cancel={JS.push("close_modal")}>
        <h2 class="text-lg font-semibold text-zinc-900">Report for @{@channel.handle}</h2>
        <p class="mt-1 text-sm text-zinc-500">
          {MapSet.size(@selected)} comments. Copy this into an email and edit it as you like before sending.
        </p>
        <textarea
          id="creator-report"
          readonly
          rows="16"
          class="mt-4 block w-full rounded-lg border-zinc-300 font-mono text-xs leading-relaxed text-zinc-800 focus:border-zinc-400 focus:ring-0"
        >{report_text(assigns)}</textarea>
        <div class="mt-4 flex justify-end gap-3">
          <button
            type="button"
            phx-click={JS.exec("data-cancel", to: "#report-modal")}
            class="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
          >
            Close
          </button>
          <.button
            type="button"
            onclick="const t = document.getElementById('creator-report'); t.select(); navigator.clipboard.writeText(t.value).then(() => { this.textContent = 'Copied!'; });"
          >
            Copy report
          </.button>
        </div>
      </.modal>
    </div>
    """
  end

  defp progress_steps(assigns) do
    assigns = assign(assigns, stages: @stages)

    ~H"""
    <div class="rounded-xl border border-zinc-200 bg-white p-8">
      <p class="mb-6 text-sm font-semibold text-zinc-700">
        Run #{@run.number} in progress ({config_summary(@run)})
      </p>
      <ol class="flex flex-wrap items-center gap-3">
        <%= for {{stage, label}, i} <- Enum.with_index(@stages) do %>
          <% current = Enum.find_index(@stages, fn {s, _} -> s == @run.status end) %>
          <li class="flex items-center gap-3">
            <span class={[
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
              cond do
                i < current -> "bg-emerald-50 text-emerald-700"
                i == current -> "bg-blue-50 text-blue-800 ring-1 ring-blue-200"
                true -> "bg-zinc-50 text-zinc-400"
              end
            ]}>
              <.icon :if={i < current} name="hero-check-mini" class="h-4 w-4" />
              <.icon :if={i == current} name="hero-arrow-path" class="h-4 w-4 animate-spin" />
              {label}
            </span>
            <.icon :if={stage != :done} name="hero-chevron-right-mini" class="h-4 w-4 text-zinc-300" />
          </li>
        <% end %>
      </ol>
      <p class="mt-6 text-xs text-zinc-500">
        This page updates on its own; you can leave and come back.
      </p>
    </div>
    """
  end

  defp results(assigns) do
    ~H"""
    <div>
      <%!-- Tabs --%>
      <div class="mb-5 flex gap-1 border-b border-zinc-200">
        <button
          :for={{key, label} <- [{"categorized", "Categorized"}, {"raw", "Raw dataset"}]}
          phx-click="tab"
          phx-value-tab={key}
          class={[
            "-mb-px border-b-2 px-4 py-2 text-sm font-semibold",
            if(@tab == key,
              do: "border-zinc-900 text-zinc-900",
              else: "border-transparent text-zinc-500 hover:text-zinc-800"
            )
          ]}
        >
          {label}
        </button>
      </div>

      <div
        :if={@comments == []}
        class="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500"
      >
        No comments available for this run in the demo dataset.
      </div>

      <div :if={@comments != [] && @tab == "categorized"}>
        <%!-- Summary tiles double as filters --%>
        <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <.tile
            filter={@filter}
            key="all"
            label="All comments"
            count={length(@comments)}
            class="text-zinc-900"
          />
          <.tile
            filter={@filter}
            key="abusive"
            label="Abusive"
            count={@counts["abusive"]}
            class="text-red-700"
          />
          <.tile
            filter={@filter}
            key="neutral_spam"
            label="Neutral / Spam"
            count={@counts["neutral_spam"]}
            class="text-zinc-600"
          />
          <.tile
            filter={@filter}
            key="worth_engaging"
            label="Worth engaging"
            count={@counts["worth_engaging"]}
            class="text-emerald-700"
          />
        </div>

        <p :if={Map.get(@counts, nil, 0) > 0} class="mb-3 text-xs text-zinc-500">
          {Map.get(@counts, nil)} comments weren't categorized by the LLM and show as "Not categorized".
        </p>

        <p :if={@run.scraper == "basic"} class="mb-3 text-xs text-zinc-500">
          Fetched with "Comments only", so replies aren't included. Refetch with "Comments + replies" to get threads.
        </p>

        <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm">
          <span class="text-zinc-700">
            <span class="font-semibold">{MapSet.size(@selected)}</span>
            of {length(@comments)} comments selected for the creator report
          </span>
          <% view =
            if @filter == "all", do: nil, else: String.downcase(category_label(@filter)) %>
          <button phx-click="select_all" class="font-semibold text-zinc-500 hover:text-zinc-800">
            {if view,
              do: "Select all #{view} (#{MapSet.size(view_ids(@comments, @filter))})",
              else: "Select all"}
          </button>
          <button phx-click="select_none" class="font-semibold text-zinc-500 hover:text-zinc-800">
            {if view, do: "Clear #{view}", else: "Clear"}
          </button>
          <div class="ml-auto flex items-center gap-2">
            <%!-- A plain form POST (not a LiveView event); the controller sends the CSV as a
                 download. It targets a hidden iframe because LiveView disconnects on any
                 regular form submit that isn't aimed at another tab or frame. --%>
            <iframe name="b2-p1-csv-download" class="hidden"></iframe>
            <.form
              for={%{}}
              action={~p"/labs/b2_p1/runs/#{@run.id}/export"}
              method="post"
              target="b2-p1-csv-download"
            >
              <input type="hidden" name="comment_ids" value={Enum.join(@selected, ",")} />
              <button
                type="submit"
                disabled={MapSet.size(@selected) == 0}
                class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <.icon name="hero-arrow-down-tray-mini" class="-ml-0.5 h-4 w-4" /> Download CSV
              </button>
            </.form>
            <.button phx-click="open_report" disabled={MapSet.size(@selected) == 0}>
              <.icon name="hero-envelope-mini" class="-ml-0.5 h-4 w-4" /> Prepare report
            </.button>
          </div>
        </div>

        <ul class="space-y-3">
          <li :for={c <- visible_comments(@comments, @filter)}>
            <.comment_card
              comment={c}
              parent={@filter != "all" && @by_id[c["parent_id"]]}
              selected={MapSet.member?(@selected, c["id"])}
            />

            <%= if @filter == "all" do %>
              <% replies = Map.get(@replies, c["id"], []) %>
              <button
                :if={replies != []}
                phx-click="toggle_replies"
                phx-value-id={c["id"]}
                class="ml-12 mt-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
              >
                {if MapSet.member?(@expanded, c["id"]),
                  do: "Hide replies",
                  else: "Show #{length(replies)} replies"}
              </button>
              <ul
                :if={replies != [] && MapSet.member?(@expanded, c["id"])}
                class="ml-10 mt-2 space-y-2 border-l-2 border-zinc-100 pl-4"
              >
                <li :for={r <- replies}>
                  <.comment_card comment={r} selected={MapSet.member?(@selected, r["id"])} />
                </li>
              </ul>
            <% end %>
          </li>
        </ul>
        <p
          :if={visible_comments(@comments, @filter) == []}
          class="py-8 text-center text-sm text-zinc-500"
        >
          No comments in this category.
        </p>
      </div>

      <div
        :if={@comments != [] && @tab == "raw"}
        class="overflow-x-auto rounded-xl border border-zinc-200 bg-white"
      >
        <p class="border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500">
          {length(@comments)} items as returned by the scraper ({scraper_label(@run.scraper)}).
          Expand a row to see the full JSON.
        </p>
        <table class="min-w-full divide-y divide-zinc-100 text-sm">
          <thead class="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Author</th>
              <th class="px-4 py-2">Text</th>
              <th class="px-4 py-2">Posted</th>
              <th class="px-4 py-2">Likes</th>
              <th class="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <%= for c <- @comments do %>
              <tr class="align-top hover:bg-zinc-50">
                <td class="px-4 py-2 font-mono text-xs text-zinc-500">
                  {c["id"]}
                  <div :if={c["parent_id"]} class="text-zinc-400">↳ {c["parent_id"]}</div>
                </td>
                <td class="px-4 py-2 text-zinc-700">@{c["author_username"]}</td>
                <td class="max-w-md truncate px-4 py-2 text-zinc-700">{c["text"]}</td>
                <td class="whitespace-nowrap px-4 py-2 text-xs text-zinc-500">
                  {format_dt(c["commented_at"])}
                </td>
                <td class="px-4 py-2 text-zinc-600">{c["likes"]}</td>
                <td class="px-4 py-2 text-right">
                  <button
                    phx-click="toggle_raw"
                    phx-value-id={c["id"]}
                    class="rounded px-2 py-1 font-mono text-xs text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-100"
                  >
                    JSON
                  </button>
                </td>
              </tr>
              <tr :if={MapSet.member?(@raw_open, c["id"])}>
                <td colspan="6" class="bg-zinc-950 px-4 py-3">
                  <pre class="max-h-96 overflow-auto text-xs leading-relaxed text-zinc-100"><%= Jason.encode!(c["raw"], pretty: true) %></pre>
                </td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end

  attr :filter, :string, required: true
  attr :key, :string, required: true
  attr :label, :string, required: true
  attr :count, :integer, required: true
  attr :class, :string, default: nil

  defp tile(assigns) do
    ~H"""
    <button
      phx-click="filter"
      phx-value-filter={@key}
      class={[
        "rounded-xl border bg-white p-4 text-left transition hover:border-zinc-400",
        if(@filter == @key, do: "border-zinc-900 ring-1 ring-zinc-900", else: "border-zinc-200")
      ]}
    >
      <div class={["text-2xl font-bold", @class]}>{@count}</div>
      <div class="text-xs font-medium text-zinc-500">{@label}</div>
    </button>
    """
  end

  attr :comment, :map, required: true
  attr :parent, :any, default: nil
  attr :selected, :boolean, default: false

  defp comment_card(assigns) do
    ~H"""
    <div class="rounded-xl border border-zinc-200 bg-white p-4">
      <p :if={@parent} class="mb-2 truncate text-xs text-zinc-400">
        ↳ replying to @{@parent["author_username"]}: “{String.slice(@parent["text"] || "", 0, 80)}”
      </p>
      <div class="flex items-start gap-3">
        <input
          type="checkbox"
          checked={@selected}
          phx-click="toggle_select"
          phx-value-id={@comment["id"]}
          title="Include in creator report"
          class="mt-2.5 h-4 w-4 flex-none cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-0"
        />
        <div class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold uppercase text-zinc-500">
          {String.first(@comment["author_username"] || "?")}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="font-semibold text-zinc-900">@{@comment["author_username"]}</span>
            <.icon
              :if={@comment["author_verified"]}
              name="hero-check-badge-mini"
              class="h-4 w-4 text-sky-500"
            />
            <span class="text-xs text-zinc-400">{format_dt(@comment["commented_at"])}</span>
            <span class="text-xs text-zinc-400">· ♥ {@comment["likes"]}</span>
            <a
              :if={@comment["url"]}
              href={@comment["url"]}
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-0.5 text-xs text-zinc-400 hover:text-zinc-800 hover:underline"
            >
              · View on Instagram <.icon name="hero-arrow-top-right-on-square-mini" class="h-3 w-3" />
            </a>
            <span class="ml-auto"><.category_badge category={@comment["category"]} /></span>
          </div>
          <p
            :if={(@comment["text"] || "") != ""}
            class="mt-1 whitespace-pre-line break-words text-sm text-zinc-800"
          >
            {@comment["text"]}
          </p>
          <p :if={(@comment["text"] || "") == ""} class="mt-1 text-sm italic text-zinc-400">
            (no text — sticker or GIF)
          </p>
          <p :if={@comment["remark"]} class="mt-2 flex items-start gap-1.5 text-xs text-zinc-500">
            <.icon name="hero-sparkles-mini" class="mt-px h-3.5 w-3.5 flex-none text-violet-400" />
            <span>{@comment["remark"]}</span>
          </p>
          <p
            :if={@comment["scraper"] == "basic" && (@comment["reply_count"] || 0) > 0}
            class="mt-2 text-xs text-zinc-400"
          >
            {@comment["reply_count"]} replies · not fetched
          </p>
        </div>
      </div>
    </div>
    """
  end
end
