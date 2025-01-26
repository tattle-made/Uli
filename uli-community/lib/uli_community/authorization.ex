defmodule UliCommunity.Authorization do
  alias ElixirLS.LanguageServer.Plugins.Phoenix
  alias UliCommunityWeb.Router

  def authorized?(user, path, method, event \\ nil) when is_binary(path) do
    role = user && user.role
    uri = URI.parse(path)
    method = String.upcase(method || "GET")
    info = Router.route_info(method, uri.path, uri.host)
    route = info.route
    action = get_action(info)

    can?(role, route, "#{event || action}")
  end

  defp can?(_role, "/", _action), do: true
  defp can?(:user, "/testadmin", _action), do: false
  defp can?(_role, _route, _action), do: true

  defp get_action(%{phoenix_live_view: plv}), do: elem(plv, 1)
  defp get_action(%{plug_opts: action}), do: action

end
