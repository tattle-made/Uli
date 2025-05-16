defmodule UliCommunityWeb.PageController do
  use UliCommunityWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end

end
