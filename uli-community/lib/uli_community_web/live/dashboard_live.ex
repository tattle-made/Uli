defmodule UliCommunityWeb.DashboardLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.UserContribution
  @topic "slur_updates"

  def mount(_params, _session, socket) do
    if connected?(socket), do: Phoenix.PubSub.subscribe(UliCommunity.PubSub, @topic)
    slurs = UserContribution.get_top_slurs(5)
    {:ok, assign(socket, slurs: slurs)}
  end

  def handle_info(:slur_changed, socket) do
    slurs = UserContribution.get_top_slurs(5)
    {:noreply, assign(socket, slurs: slurs)}
  end
end
