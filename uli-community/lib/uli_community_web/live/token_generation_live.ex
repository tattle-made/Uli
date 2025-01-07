defmodule UliCommunityWeb.TokenGeneratorLive do
  require Logger
  alias UliCommunity.Api.Token
  alias UliCommunity.Api
  alias UliCommunity.Accounts
  use UliCommunityWeb, :live_view
  import UliCommunityWeb.CoreComponents

  import UliCommunityWeb.Components.TokenModal

  def render(assigns) do
    ~H"""
    <.token_modal show={@token.open?} id="example-modal" phx-click="close-info-modal">
      <:title>Generated Token</:title>
      <:body>
        This is your generated token. Please make sure to copy it now, as it will not be displayed again:
        <p id="generated-token" class="text-sm text-slate-600"><%= @token.token %></p>
        <div class="flex">
          <button
            id="copy-button"
            class=" mt-1 text-xs text-slate-600 border border-slate-300 px-2 py-1 rounded-sm"
            phx-click={JS.dispatch("phx:copy", to: "#generated-token")}
          >
            Copy 📋
          </button>
        </div>
      </:body>
      <:footer>
        <div class="flex justify-center">
          <button
            phx-click="close-info-modal"
            class="text-sm text-red-500 border border-red-500 px-2 py-1"
          >
            Close
          </button>
        </div>
      </:footer>
    </.token_modal>

    <.header class="text-center">
      Generate Access Tokens
    </.header>
    <.table id="abcd" rows={@rows}>
      <:col :let={token} label="Token's Name"><%= token.token_name %></:col>
      <:col :let={token} label="Access Level"><%= token.access_level %></:col>
      <:col :let={token} label="Created"><%= DateTime.to_date(token.inserted_at) %></:col>
      <:col :let={token} label="Expiry"><%= token.expiry %></:col>
      <:col :let={token} label="Status">
        <%= if token.expiry >= Date.utc_today() do %>
          <span class="text-green-500">Active</span>
        <% else %>
          <span class="text-red-500">Expired</span>
        <% end %>
      </:col>
      <:col :let={token} label="Delete">
        <button
          class=" px-2 py-1 border border-red-400 text-red-500 text-xs rounded-md"
          phx-click={JS.push("delete_token", value: %{token: token})}
        >
          Delete
        </button>
      </:col>
    </.table>

    <p class="text-xs text-gray-500 text-center">
      <%= if @rows == nil or @rows == [] do
        "No Tokens to Display. Generate Tokens to Display Here."
      else
        ""
      end %>
    </p>

    <.simple_form for={@token_form} phx-submit="gen_token" phx-update="ignore">
      <.input field={@token_form[:token_name]} label="Token Name" />
      <%!-- <.input field={@token_form[:access_level]} label="Access Level"/> --%>
      <.input type="date" min={Date.utc_today()} field={@token_form[:expiry]} label="Set Expiry" />
      <.input
        type="select"
        field={@token_form[:access_level]}
        label="Access Level"
        options={@access_levels}
      />

      <:actions>
        <.button>Save</.button>
      </:actions>
    </.simple_form>
    """
  end

  def mount(_params, session, socket) do
    user_token = Map.get(session, "user_token")

    form = to_form(%{}, as: "token")

    if user_token do
      case Accounts.get_user_by_session_token(user_token) do
        nil ->
          {:ok, socket}

        user ->
          tokens_by_curr_user =
            Api.get_access_tokens_by_user_id(user.id)
            |> Enum.map(
              &Map.take(&1, [
                :id,
                :token_id,
                :token_name,
                :access_level,
                :expiry,
                :created_by_user,
                :revoked?,
                :inserted_at,
                :updated_at
              ])
            )

          access_levels =
            if user.role == :user do
              [
                {"User", "user"}
              ]
            else
              [
                {"Admin", "admin"},
                {"User", "user"}
              ]
            end

          {:ok,
           assign(socket,
             tokens_to_show: tokens_by_curr_user,
             current_user: user,
             rows: tokens_by_curr_user,
             token: %{token: nil, open?: false},
             access_levels: access_levels,
             delete_token: nil,
             show_delete_modal?: false,
             token_form: form,
             temporary_assigns: [token_form: form]
           )}
      end
    else
      {:ok, socket}
    end
  end

  def handle_event("gen_token", %{"token" => params}, socket) do
    # IO.inspect(params, label: "Params are: ")

    # IO.inspect(socket.assigns.current_user, label: "Socket: ")

    attrs = %{
      created_by_user: socket.assigns.current_user.id,
      token_name: params["token_name"],
      access_level: params["access_level"],
      expiry: params["expiry"]
    }

    with {:ok, added_entry} <- Api.add_new_access_token(attrs),
         {:ok, token} <- Token.sign(%{token_id: added_entry.token_id}) do
      Logger.debug("Successfully generated token: #{inspect(token)}")

      new_entry =
        Map.take(added_entry, [
          :id,
          :token_id,
          :token_name,
          :access_level,
          :expiry,
          :created_by_user,
          :revoked?,
          :inserted_at,
          :updated_at
        ])

      updated_rows = [new_entry] ++ socket.assigns.rows

      socket = assign(socket, token: %{token: token, open?: true}, rows: updated_rows)
      Logger.debug("Assigned token to socket: #{inspect(socket.assigns.token)}")

      socket = put_flash(socket, :info, "Token Generated Successfully!")

      {:noreply, socket}
    else
      {:error, reason} ->
        Logger.error(reason)
        socket = put_flash(socket, :error, "Something Went Wrong!")
        {:noreply, socket}
    end
  end

  def handle_event("close-info-modal", _, socket) do
    {:noreply, assign(socket, token: %{token: nil, open?: false})}
  end

  def handle_event("delete_token", %{"token" => token}, socket) do
    case Api.delete_access_token_by_token_id(token["token_id"]) do
      {:ok, deleted_token} ->
        IO.inspect(deleted_token, label: "Deleted TOKEN:")

        updated_rows =
          Enum.reject(socket.assigns.rows, fn t -> t.token_id == deleted_token.token_id end)

        socket =
          socket
          |> assign(:rows, updated_rows)
          |> put_flash(:info, "Token deleted successfully.")

        {:noreply, socket}

      {:error, reason} ->
        IO.inspect(reason, label: "Error Deleting TOKEN:")

        socket =
          socket
          |> put_flash(:error, "Failed to delete the token. Please try again.")

        {:noreply, socket}
    end
  end
end
