defmodule UliCommunityWeb.UserRegistrationsLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Accounts

  @per_page 20

  def mount(_params, _session, socket) do
    page = 1
    offset = (page - 1) * @per_page

    users = Accounts.list_recent_users(@per_page, offset)
    total_users = Accounts.count_users()

    {:ok,
     assign(socket,
       users: users,
       page: page,
       total_users: total_users,
       per_page: @per_page
     )}
  end

  def handle_event("next", _, socket) do
    page = socket.assigns.page + 1
    offset = (page - 1) * @per_page

    users = Accounts.list_recent_users(@per_page, offset)

    {:noreply,
     assign(socket,
       users: users,
       page: page
     )}
  end

  def handle_event("prev", _, socket) do
    page = max(socket.assigns.page - 1, 1)
    offset = (page - 1) * @per_page

    users = Accounts.list_recent_users(@per_page, offset)

    {:noreply,
     assign(socket,
       users: users,
       page: page
     )}
  end

  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">
        User Registrations
      </h1>

      <table class="min-w-full border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">Email</th>
            <th class="border px-4 py-2 text-left">Role</th>
            <th class="border px-4 py-2 text-left">Registered At</th>
          </tr>
        </thead>

        <tbody>
          <%= for user <- @users do %>
            <tr>
              <td class="border px-4 py-2"><%= user.email %></td>
              <td class="border px-4 py-2"><%= user.role %></td>
              <td class="border px-4 py-2"><%= user.inserted_at %></td>
            </tr>
          <% end %>
        </tbody>
      </table>

      <div class="flex justify-center items-center gap-4 mt-6">

        <button
          phx-click="prev"
          disabled={@page == 1}
          class={[
            "px-4 py-2 rounded font-medium transition",
            if(@page == 1,
              do: "bg-gray-300 text-gray-500 cursor-not-allowed",
              else: "bg-gray-700 text-white hover:bg-gray-800"
            )
          ]}
        >
          Previous
        </button>

        <span class="font-semibold text-lg">
          Page <%= @page %>
        </span>

        <button
          phx-click="next"
          disabled={@page * @per_page >= @total_users}
          class={[
            "px-4 py-2 rounded font-medium transition",
            if(@page * @per_page >= @total_users,
              do: "bg-gray-300 text-gray-500 cursor-not-allowed",
              else: "bg-blue-600 text-white hover:bg-blue-700"
            )
          ]}
        >
          Next
        </button>

      </div>
    </div>
    """
  end
end
