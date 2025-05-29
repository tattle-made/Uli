defmodule UliCommunityWeb.DashboardController do
  use UliCommunityWeb, :controller

  def index(conn, _params) do
    pie_data = UliCommunity.UserContribution.get_top_slurs(5)
    render(conn, :index, pie_data: pie_data)
  end
end
