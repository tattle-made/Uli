defmodule UliCommunityWeb.Labs.B2P1.ChannelLive do
  use UliCommunityWeb, :live_view

  import UliCommunityWeb.Labs.B2P1.Components
  alias UliCommunity.Labs.B2P1
  alias UliCommunity.Labs.B2P1.PostConfigs

  # Prefills the add-posts form; scraping with replies is the default for now.
  @default_config %PostConfigs{}

  def mount(%{"id" => id}, _session, socket) do
    case UliCommunity.Repo.get(B2P1.Channels, id) do
      nil ->
        {:ok,
         socket
         |> put_flash(:error, "Channel not found.")
         |> push_navigate(to: ~p"/labs/b2_p1/channels")}

      _ ->
        channel = B2P1.get_channel!(id)
        if connected?(socket), do: B2P1.subscribe()

        {:ok,
         assign(socket,
           page_title: "@#{channel.handle} · Labs B2_P1",
           channel: channel,
           posts: load_posts(channel.id),
           default_config: @default_config,
           show_add: false,
           add_text: "",
           add_errors: [],
           refetch_post: nil
         )}
    end
  end

  def handle_info(:labs_b2_p1_updated, socket) do
    {:noreply, assign(socket, posts: load_posts(socket.assigns.channel.id))}
  end

  defp load_posts(channel_id), do: channel_id |> B2P1.list_posts() |> Enum.map(&with_run_info/1)

  def handle_event("open_add", _, socket),
    do: {:noreply, assign(socket, show_add: true, add_text: "", add_errors: [])}

  def handle_event("open_refetch", %{"id" => id}, socket) do
    {:noreply, assign(socket, refetch_post: B2P1.get_post!(id))}
  end

  def handle_event("close_modal", _, socket),
    do: {:noreply, assign(socket, show_add: false, refetch_post: nil)}

  def handle_event("add_posts", %{"urls" => text, "config" => config}, socket) do
    urls = String.split(text, ["\n", "\r", ",", " "], trim: true)
    {:ok, added, errors} = B2P1.add_posts(socket.assigns.channel, urls, config)

    socket =
      if added != [],
        do: put_flash(socket, :info, "#{length(added)} post(s) added and queued for fetching."),
        else: socket

    socket =
      cond do
        urls == [] ->
          assign(socket, add_errors: [{"", "Paste at least one post URL."}])

        errors == [] ->
          assign(socket, show_add: false)

        true ->
          # Keep the dialog open with only the lines that need fixing.
          assign(socket,
            add_text: errors |> Enum.map(&elem(&1, 0)) |> Enum.join("\n"),
            add_errors: errors
          )
      end

    {:noreply, assign(socket, posts: load_posts(socket.assigns.channel.id))}
  end

  def handle_event("refetch", %{"post_id" => id, "config" => config}, socket) do
    socket =
      case B2P1.refetch(B2P1.get_post!(id), config) do
        {:ok, _run} -> put_flash(socket, :info, "Refetch queued.")
        {:error, msg} -> put_flash(socket, :error, msg)
      end

    {:noreply, assign(socket, refetch_post: nil, posts: load_posts(socket.assigns.channel.id))}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl">
      <.breadcrumbs crumbs={[{"Channels", ~p"/labs/b2_p1/channels"}, {"@#{@channel.handle}", nil}]} />

      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900">{display_name(@channel)}</h1>
          <p class="mt-1 flex items-center gap-2 text-sm text-zinc-500">
            <span class="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700">
              <.icon name="hero-camera-mini" class="h-3.5 w-3.5" /> {@channel.platform.name}
            </span>
            @{@channel.handle} · {length(@posts)} posts
          </p>
        </div>
        <.button phx-click="open_add">
          <.icon name="hero-plus-mini" class="-ml-0.5 h-4 w-4" /> Add posts
        </.button>
      </div>

      <div
        :if={@posts == []}
        class="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center"
      >
        <.icon name="hero-photo" class="mx-auto h-10 w-10 text-zinc-300" />
        <p class="mt-3 font-semibold text-zinc-800">No posts yet</p>
        <p class="mt-1 text-sm text-zinc-500">
          Add one or more post URLs to fetch and categorize their comments.
        </p>
        <.button phx-click="open_add" class="mt-4">Add posts</.button>
      </div>

      <div :if={@posts != []} class="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table class="min-w-full divide-y divide-zinc-200 text-sm">
          <thead class="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th class="px-4 py-3">Post</th>
              <th class="px-4 py-3">Settings</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3" title="Abusive / Neutral-Spam / Worth engaging">Categories</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr :for={post <- @posts} class="hover:bg-zinc-50">
              <td class="px-4 py-3">
                <.link navigate={~p"/labs/b2_p1/posts/#{post.id}"} class="group block">
                  <div class="font-semibold text-zinc-900 group-hover:underline">
                    {post.title || short_url(post.url)}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-zinc-500">
                    <span class="rounded bg-zinc-100 px-1.5 py-0.5 font-medium uppercase">
                      {post.content_type}
                    </span>
                    {short_url(post.url)}
                  </div>
                </.link>
              </td>
              <td class="px-4 py-3 text-xs text-zinc-600">{config_summary(post.config)}</td>
              <td class="px-4 py-3">
                <.status_badge run={post.latest_run} />
                <div :if={post.latest_run} class="mt-1 text-xs text-zinc-400">
                  Run #{post.latest_run.number}
                  {if post.latest_run.fetched_count,
                    do: "· #{post.latest_run.fetched_count} comments"}
                </div>
              </td>
              <td class="px-4 py-3"><.count_pills counts={post.counts} /></td>
              <td class="whitespace-nowrap px-4 py-3 text-right">
                <button
                  phx-click="open_refetch"
                  phx-value-id={post.id}
                  disabled={in_progress?(post.latest_run)}
                  class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <.icon name="hero-arrow-path-mini" class="h-3.5 w-3.5" />
                  {if post.latest_run, do: "Refetch", else: "Fetch"}
                </button>
                <.link
                  navigate={~p"/labs/b2_p1/posts/#{post.id}"}
                  class="ml-1 inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  View <.icon name="hero-chevron-right-mini" class="h-3.5 w-3.5" />
                </.link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <.modal :if={@show_add} id="add-posts-modal" show on_cancel={JS.push("close_modal")}>
        <h2 class="text-lg font-semibold text-zinc-900">Add posts to @{@channel.handle}</h2>
        <p class="mt-1 text-sm text-zinc-500">
          Paste one Instagram post or reel URL per line. Each one is queued for comment fetching.
        </p>
        <form phx-submit="add_posts" class="mt-6 space-y-5">
          <textarea
            name="urls"
            rows="6"
            placeholder="https://www.instagram.com/p/ABC123/\nhttps://www.instagram.com/reel/XYZ789/"
            class="block w-full rounded-lg border-zinc-300 font-mono text-sm focus:border-zinc-400 focus:ring-0"
          ><%= @add_text %></textarea>

          <ul :if={@add_errors != []} class="space-y-1 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <li :for={{url, msg} <- @add_errors}>
              <span :if={url != ""} class="font-mono">{url}</span>
              <span :if={url != ""}>—</span> {msg}
            </li>
          </ul>

          <details class="rounded-lg border border-zinc-200 p-4">
            <summary class="cursor-pointer text-sm font-semibold text-zinc-700">
              Fetch settings
              <span class="font-normal text-zinc-500">
                (default: {config_summary(@default_config)})
              </span>
            </summary>
            <div class="mt-4"><.config_fields config={@default_config} /></div>
          </details>

          <div class="flex justify-end">
            <.button type="submit">Add &amp; start fetching</.button>
          </div>
        </form>
      </.modal>

      <.refetch_modal :if={@refetch_post} post={@refetch_post} />
    </div>
    """
  end

  defp short_url(url), do: String.replace(url, ~r{^https?://(www\.)?}, "")
end
