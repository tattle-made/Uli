defmodule UliCommunityWeb.UserApp.DisplaySingleUserAppLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Apps
  alias UliCommunity.Accounts
  # import Timex
  import UliCommunityWeb.CoreComponents
  alias UliCommunity.Apps.UserApplication

  import UliCommunityWeb.Components.TokenModal

  @impl Phoenix.LiveView
  def mount(%{"app_id" => app_id}, _session, socket) do
    app = Apps.get_user_app_by_id(app_id, socket.assigns.current_user.id)

    IO.inspect(app, label: "APP IS: ")
    user = if app, do: Accounts.get_user!(app.user_id), else: nil

    ist_inserted_at =
      if app, do: Timex.Timezone.convert(app.inserted_at, "Asia/Kolkata"), else: nil

    ist_updated_at = if app, do: Timex.Timezone.convert(app.updated_at, "Asia/Kolkata"), else: nil
    changeset = if app, do: UserApplication.changeset(app, %{}), else: nil
    app_form = if changeset, do: to_form(changeset), else: nil
    app_tokens = if app, do: UliCommunity.Api.get_app_access_tokens_by_app_id(app.id), else: []
    token_form = to_form(%{}, as: "app_token")

    access_levels = [
      {"User", "user"},
      {"Admin", "admin"}
    ]

    {:ok,
     assign(socket,
       app: app,
       user: user,
       ist_inserted_at: ist_inserted_at,
       ist_updated_at: ist_updated_at,
       edit_mode: false,
       app_form: app_form,
       show_delete_modal: false,
       app_tokens: app_tokens,
       token_form: token_form,
       access_levels: access_levels,
       token_modal: %{token: nil, open?: false}
     )}
  end

  @impl true
  def handle_event("edit", _params, socket) do
    {:noreply, assign(socket, edit_mode: true)}
  end

  @impl true
  def handle_event("cancel_edit", _params, socket) do
    {:noreply, assign(socket, edit_mode: false)}
  end

  @impl true
  def handle_event("validate", %{"user_application" => params}, socket) do
    changeset =
      UserApplication.changeset(socket.assigns.app, params) |> Map.put(:action, :validate)

    {:noreply, assign(socket, app_form: to_form(changeset))}
  end

  @impl true
  def handle_event("save", %{"user_application" => params}, socket) do
    case Apps.update_user_app(socket.assigns.app, params) do
      {:ok, updated_app} ->
        user = Accounts.get_user!(updated_app.user_id)
        ist_inserted_at = Timex.Timezone.convert(updated_app.inserted_at, "Asia/Kolkata")
        ist_updated_at = Timex.Timezone.convert(updated_app.updated_at, "Asia/Kolkata")
        changeset = UserApplication.changeset(updated_app, %{})
        app_form = to_form(changeset)

        {:noreply,
         socket
         |> assign(
           app: updated_app,
           user: user,
           ist_inserted_at: ist_inserted_at,
           ist_updated_at: ist_updated_at,
           edit_mode: false,
           app_form: app_form
         )
         |> put_flash(:info, "App updated successfully!")}

      {:error, changeset} ->
        {:noreply, assign(socket, app_form: to_form(Map.put(changeset, :action, :insert)))}
    end
  end

  @impl true
  def handle_event("delete", _params, socket) do
    try do
      case Apps.delete_user_app(socket.assigns.app) do
        {:ok, _} ->
          {:noreply,
           socket
           |> put_flash(:info, "App deleted successfully!")
           |> push_navigate(to: "/app/my-apps")}

        {:error, _} ->
          hide_modal("delete-app-modal")

          {:noreply,
           socket
           |> put_flash(:error, "Failed to delete app.")
           |> assign(show_delete_modal: false)}
      end
    rescue
      e in Ecto.ConstraintError ->
        IO.inspect(e, label: "INSIDE CONSTRAINT ERROR")

        {:noreply,
         socket
         |> put_flash(:error, "Cannot delete app: Please delete all tokens first.")
         |> assign(show_delete_modal: false)}

      e ->
        IO.inspect(e, label: "UNEXPECTED ERROR")

        {:noreply,
         socket
         |> put_flash(:error, "An unexpected error occurred while deleting the app.")
         |> assign(show_delete_modal: false)}
    end
  end

  @impl true
  def handle_event("gen_app_token", %{"app_token" => params}, socket) do
    attrs = %{
      user_application_id: socket.assigns.app.id,
      token_name: params["token_name"],
      # scope: params["scope"],
      expiry: params["expiry"]
    }

    with {:ok, added_entry} <- UliCommunity.Api.add_new_app_access_token(attrs),
         {:ok, token} <- UliCommunity.Api.Token.sign(%{token_id: added_entry.token_id}) do
      new_entry =
        Map.take(added_entry, [
          :id,
          :token_id,
          :token_name,
          :scope,
          :expiry,
          :user_application_id,
          :inserted_at,
          :updated_at
        ])

      updated_tokens = [new_entry | socket.assigns.app_tokens]
      # Reset form with explicit empty values
      token_form = to_form(%{"token_name" => "", "expiry" => ""}, as: "app_token")

      socket =
        assign(socket, token_form: token_form, token_modal: %{token: token, open?: true}, app_tokens: updated_tokens)

      socket = put_flash(socket, :info, "Token Generated Successfully!")
      {:noreply, socket}
    else
      {:error, reason} ->
        IO.inspect(reason, label: "Error while generating token. REASON: ")
        socket = put_flash(socket, :error, "Something Went Wrong!")
        {:noreply, socket}
    end
  end

  @impl true
  def handle_event("close-app-token-modal", _, socket) do
    {:noreply, assign(socket, token_modal: %{token: nil, open?: false})}
  end

  @impl true
  def handle_event("delete_app_token", %{"token_id" => token_id}, socket) do
    case UliCommunity.Api.delete_app_access_token_by_token_id(token_id) do
      {:ok, _deleted_token} ->
        updated_tokens =
          Enum.reject(socket.assigns.app_tokens, fn t -> t.token_id == token_id end)

        socket = assign(socket, app_tokens: updated_tokens)
        socket = put_flash(socket, :info, "Token deleted successfully.")
        {:noreply, socket}

      {:error, reason} ->
        IO.inspect(reason, label: "Error while deleting token. REASON: ")
        socket = put_flash(socket, :error, "Failed to delete the token. Please try again.")
        {:noreply, socket}
    end
  end

  @impl Phoenix.LiveView
  def render(assigns) do
    ~H"""
    <.link
      navigate="/app/my-apps"
      class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        >
        </path>
      </svg>
      Back to My Apps
    </.link>

    <.header class="text-center mb-4">App Details</.header>

    <%= if @app do %>
      <%= if @edit_mode do %>
        <.simple_form for={@app_form} phx-submit="save" phx-change="validate" class="max-w-lg mx-auto">
          <.input required field={@app_form[:app_name]} label="App Name" class="w-full"/>
          <.input required field={@app_form[:webhook_endpoint]} label="Webhook URL" class="w-full"/>
          <:actions>
            <.button class="mr-2">Save</.button>
            <.button type="button" phx-click="cancel_edit" class="bg-gray-400">Cancel</.button>
          </:actions>
        </.simple_form>
      <% else %>
        <div class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm max-w-3xl">
          <h2 class="text-2xl font-bold mb-4 text-gray-800"><%= @app.app_name %></h2>
          <div class="space-y-3">
            <p class="border-b border-gray-100 pb-2">
              <span class="font-semibold text-gray-700">Webhook Endpoint:</span>
              <span class="text-gray-600 break-all"><%= @app.webhook_endpoint %></span>
            </p>
            <p class="border-b border-gray-100 pb-2">
              <span class="font-semibold text-gray-700">Created By:</span>
              <span class="text-gray-600"><%= @user && @user.email %></span>
            </p>
            <p class="border-b border-gray-100 pb-2">
              <span class="font-semibold text-gray-700">Created At (IST):</span>
              <span class="text-gray-600">
                <%= @ist_inserted_at &&
                  Timex.format!(@ist_inserted_at, "%Y-%m-%d %H:%M:%S", :strftime) %>
              </span>
            </p>
            <p class="pb-2">
              <span class="font-semibold text-gray-700">Updated At (IST):</span>
              <span class="text-gray-600">
                <%= @ist_updated_at &&
                  Timex.format!(@ist_updated_at, "%Y-%m-%d %H:%M:%S", :strftime) %>
              </span>
            </p>
          </div>
          <div class="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              phx-click="edit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              phx-click={show_modal("delete-app-modal")}
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      <% end %>
      <.header class="text-center mt-10">App Tokens</.header>
      <.table id="app-tokens-table" rows={@app_tokens}>
        <:col :let={token} label="Token's Name"><%= token.token_name %></:col>
        <:col :let={token} label="Scope">
          <%= if is_nil(token.scope) do
            "N/A"
          else
            Enum.join(token.scope, ", ")
          end %>
        </:col>
        <:col :let={token} label="Created">
          <%= token.inserted_at && DateTime.to_date(token.inserted_at) %>
        </:col>
        <:col :let={token} label="Expiry"><%= token.expiry %></:col>
        <:col :let={token} label="Delete">
          <button
            class="px-2 py-1 border border-red-400 text-red-500 text-xs rounded-md"
            phx-click="delete_app_token"
            phx-value-token_id={token.token_id}
          >
            Delete
          </button>
        </:col>
      </.table>
      <.header class="text-center mt-10">Generate a New Token</.header>
      <.simple_form for={@token_form} phx-submit="gen_app_token" class="mt-6">
        <.input field={@token_form[:token_name]} label="Token Name" placeholder= "Enter token name" class="w-full lg:w-[40%]"/>
        <.input type="date" min={Date.utc_today()} field={@token_form[:expiry]} label="Set Expiry" class="w-full lg:w-[40%]"/>
        <%!-- <.input
          type="select"
          field={@token_form[:scope]}
          label="Access Level"
          options={@access_levels}
        /> --%>
        <:actions>
          <.button>Save</.button>
        </:actions>
      </.simple_form>
      <.token_modal show={@token_modal.open?} id="app-token-modal" phx-click="close-app-token-modal">
        <:title>Generated Token</:title>
        <:body>
          This is your generated token. Please make sure to copy it now, as it will not be displayed again:
          <p id="generated-token" class="text-sm text-slate-600"><%= @token_modal.token %></p>
          <div class="flex">
            <button
              id="copy-button"
              class="mt-1 text-xs text-slate-600 border border-slate-300 px-2 py-1 rounded-sm"
              phx-click={JS.dispatch("phx:copy", to: "#generated-token")}
            >
              Copy 📋
            </button>
          </div>
        </:body>
        <:footer>
          <div class="flex justify-center mt-4">
            <button
              phx-click="close-app-token-modal"
              class="text-sm text-red-500 border border-red-500 px-2 py-1"
            >
              Close
            </button>
          </div>
        </:footer>
      </.token_modal>
      <.modal
        id="delete-app-modal"
        show={@show_delete_modal}
        on_cancel={hide_modal("delete-app-modal")}
      >
        <div class="p-4">
          <h2 class="text-lg font-bold mb-4">Confirm Delete</h2>
          <p>
            Are you sure you want to delete this app? All the related access tokens will also be deleted. This action cannot be undone.
          </p>
          <div class="flex gap-4 mt-6 justify-end">
            <button phx-click={hide_modal("delete-app-modal")} class="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button phx-click="delete" class="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      </.modal>
    <% else %>
      <p class="text-center text-gray-500">App not found.</p>
    <% end %>
    """
  end
end
