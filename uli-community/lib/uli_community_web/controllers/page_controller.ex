defmodule UliCommunityWeb.PageController do
  use UliCommunityWeb, :controller

  def home(conn, _params) do
    conn
    |> put_root_layout(false)
    |> render(:home, layout: false)
  end

end

