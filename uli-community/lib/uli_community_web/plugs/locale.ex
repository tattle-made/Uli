defmodule UliCommunityWeb.Plugs.Locale do
  import Plug.Conn

  @supported_locales ["en", "hi"]
  @default_locale "en"

  def init(opts), do: opts

  def call(conn, _opts) do
    locale =
      case get_session(conn, :locale) do
        l when l in @supported_locales -> l
        _ -> @default_locale
      end

    Gettext.put_locale(UliCommunityWeb.Gettext, locale)
    assign(conn, :locale, locale)
  end
end
