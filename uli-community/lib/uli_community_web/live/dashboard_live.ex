defmodule UliCommunityWeb.DashboardLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.UserContribution
  @topic "slur_updates"

  def mount(_params, _session, socket) do
    if connected?(socket), do: Phoenix.PubSub.subscribe(UliCommunity.PubSub, @topic)

    slurs = UserContribution.get_top_slurs(10)
    severity_data = UserContribution.get_severity_distribution()

    {:ok, assign(socket, slurs: slurs, severity_data: severity_data)}
  end

  def handle_info(:slur_changed, socket) do
    slurs = UserContribution.get_top_slurs(10)
    severity_data = UserContribution.get_severity_distribution()

    {:noreply, assign(socket, slurs: slurs, severity_data: severity_data)}
  end
end
