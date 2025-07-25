defmodule UliCommunityWeb.UserApp.DisplayAllUserAppsLive do
  alias UliCommunity.Apps
  use UliCommunityWeb, :live_view

  def mount(_params, _session, socket) do
    {all_user_apps, socket} =
      case Apps.get_user_apps(socket.assigns.current_user.id) do
        entries when is_list(entries) ->
          {entries, socket}

        {:error, _} ->
          {[], put_flash(socket, :error, "Something went wrong")}

        _ ->
          {[], put_flash(socket, :error, "Something went wrong")}
      end

    {:ok, assign(socket, all_user_apps: all_user_apps)}
  end


  def render(assigns) do
    ~H"""
    <.header class="text-center">My Apps</.header>
    <div class="flex flex-wrap gap-2">
      <%= if length(@all_user_apps) == 0 do %>
        <p class="text-gray-500">No Apps to Display</p>
      <% else %>
        <%= for app <- @all_user_apps   do %>
          <.link
            navigate={"/app/my-apps/#{app.id}"}
            class="block max-w-sm min-w-80 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 "
          >
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-[#2c3e50]">
              <%= app.app_name %>
            </h5>
            <p class="text-gray-700">
              User App
            </p>
          </.link>
        <% end %>
      <% end %>
    </div>
    """
  end
end
