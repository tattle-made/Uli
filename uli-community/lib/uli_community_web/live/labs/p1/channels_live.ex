defmodule UliCommunityWeb.Labs.P1.ChannelsLive do
  use UliCommunityWeb, :live_view

  import UliCommunityWeb.Labs.P1.Components
  alias UliCommunity.Labs.P1.DummyData

  def mount(_params, _session, socket) do
    if connected?(socket), do: DummyData.subscribe()

    {:ok,
     assign(socket,
       page_title: "Channels · Labs P1",
       channels: DummyData.list_channels(),
       show_new: false,
       form_error: nil
     )}
  end

  def handle_info(:labs_p1_updated, socket) do
    {:noreply, assign(socket, channels: DummyData.list_channels())}
  end

  def handle_event("open_new", _, socket),
    do: {:noreply, assign(socket, show_new: true, form_error: nil)}

  def handle_event("close_modal", _, socket), do: {:noreply, assign(socket, show_new: false)}

  def handle_event("create_channel", %{"channel" => attrs}, socket) do
    case DummyData.create_channel(attrs) do
      {:ok, channel} ->
        {:noreply,
         socket
         |> put_flash(:info, "Channel @#{channel.handle} added.")
         |> push_navigate(to: ~p"/labs/p1/channels/#{channel.id}")}

      {:error, msg} ->
        {:noreply, assign(socket, form_error: msg)}
    end
  end

  def handle_event("reset_demo", _, socket) do
    DummyData.reset()
    {:noreply, socket |> put_flash(:info, "Demo data reset.") |> assign(channels: DummyData.list_channels())}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl">
      <.breadcrumbs crumbs={[{"Channels", nil}]} />

      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900">Channels</h1>
          <p class="mt-1 text-sm text-zinc-500">
            Creator accounts whose post comments we fetch and categorize.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            phx-click="reset_demo"
            data-confirm="Reset all demo data to its starting state?"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100"
          >
            Reset demo
          </button>
          <.button phx-click="open_new">
            <.icon name="hero-plus-mini" class="-ml-0.5 h-4 w-4" /> New channel
          </.button>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table class="min-w-full divide-y divide-zinc-200 text-sm">
          <thead class="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th class="px-4 py-3">Channel</th>
              <th class="px-4 py-3">Platform</th>
              <th class="px-4 py-3">Posts</th>
              <th class="px-4 py-3">Last run</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr
              :for={ch <- @channels}
              class="cursor-pointer hover:bg-zinc-50"
              phx-click={JS.navigate(~p"/labs/p1/channels/#{ch.id}")}
            >
              <td class="px-4 py-3">
                <div class="font-semibold text-zinc-900"><%= ch.name %></div>
                <div class="text-zinc-500">@<%= ch.handle %></div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700">
                  <.icon name="hero-camera-mini" class="h-3.5 w-3.5" /> Instagram
                </span>
              </td>
              <td class="px-4 py-3 text-zinc-700"><%= ch.post_count %></td>
              <td class="px-4 py-3 text-zinc-500"><%= format_dt(ch.last_run_at) %></td>
              <td class="px-4 py-3 text-right">
                <.icon name="hero-chevron-right" class="h-4 w-4 text-zinc-400" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <.modal :if={@show_new} id="new-channel-modal" show on_cancel={JS.push("close_modal")}>
        <h2 class="text-lg font-semibold text-zinc-900">New channel</h2>
        <form phx-submit="create_channel" class="mt-6 space-y-4">
          <label class="block text-sm">
            <span class="font-semibold text-zinc-800">Platform</span>
            <select
              name="channel[platform]"
              class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
            >
              <option :for={p <- DummyData.platforms()} value={p.slug}><%= p.name %></option>
              <option disabled>YouTube (coming soon)</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="font-semibold text-zinc-800">Display name</span>
            <input
              type="text"
              name="channel[name]"
              placeholder="e.g. National Geographic"
              class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
            />
          </label>
          <label class="block text-sm">
            <span class="font-semibold text-zinc-800">Handle</span>
            <input
              type="text"
              name="channel[handle]"
              placeholder="@natgeo"
              class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
            />
          </label>
          <p :if={@form_error} class="text-sm text-red-600"><%= @form_error %></p>
          <div class="flex justify-end">
            <.button type="submit">Add channel</.button>
          </div>
        </form>
      </.modal>
    </div>
    """
  end
end
