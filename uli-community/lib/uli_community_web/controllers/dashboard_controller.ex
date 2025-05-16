defmodule UliCommunityWeb.DashboardController do
  use UliCommunityWeb, :controller

  def index(conn, _params) do
    render(conn, :index, layout: false)
  end
end
