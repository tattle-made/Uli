defmodule UliCommunityWeb.AnalyticsLive do
  use UliCommunityWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">
        Analytics
      </h1>

      <div class="border rounded-lg p-4 shadow-sm w-80">
        <.link
          navigate={~p"/analytics/user-registrations"}
          class="text-blue-600 hover:underline font-medium"
        >
          User registrations →
        </.link>
      </div>
    </div>
    """
  end
end
