defmodule UliCommunityWeb.LocaleController do
  use UliCommunityWeb, :controller

  @supported_locales ["en", "hi"]

  def set(conn, %{"locale" => locale}) when locale in @supported_locales do
    conn
    |> put_session(:locale, locale)
    |> redirect(to: ~p"/")
  end

  def set(conn, _params) do
    redirect(conn, to: ~p"/")
  end
end
