defmodule UliCommunityWeb.PageControllerTest do
  use UliCommunityWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")

    assert html_response(conn, 200) =~
             "Explore, annotate and add to our multilingual slur database."
  end
end
