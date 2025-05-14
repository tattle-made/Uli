defmodule UliCommunityWeb.PageController do
  use UliCommunityWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end

  def dashboard(conn, _params) do
    render(conn, :dashboard)
  end
end
