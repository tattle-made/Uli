defmodule UliCommunityWeb.LocaleOnMount do
  import Phoenix.Component

  @supported_locales ["en", "hi"]
  @default_locale "en"

  def on_mount(:set_locale, _params, session, socket) do
    locale =
      case Map.get(session, "locale") do
        l when l in @supported_locales -> l
        _ -> @default_locale
      end

    Gettext.put_locale(UliCommunityWeb.Gettext, locale)
    {:cont, assign(socket, :locale, locale)}
  end
end
