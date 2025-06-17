defmodule UliCommunityWeb.DashboardLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.UserContribution

  def mount(_params, _session, socket) do
    slurs =
      try do
        UserContribution.get_top_slurs(10)
      rescue
        _ -> nil
      end

    severity_data =
      try do
        UserContribution.get_severity_distribution()
      rescue
        _ -> nil
      end

    {:ok, assign(socket, slurs: slurs, severity_data: severity_data)}
  end
end
