defmodule UliCommunityWeb.UserApp.CreateUserAppLive do
  alias UliCommunity.Apps
  alias UliCommunity.Apps.UserApplication
  use UliCommunityWeb, :live_view
  import UliCommunityWeb.CoreComponents

  @impl Phoenix.LiveView
  def mount(params, session, socket) do
    changeset = UserApplication.changeset(%UserApplication{}, %{})
    app_form = to_form(changeset)
    socket = assign(socket, app_form: app_form)
    {:ok, socket}
  end

  def handle_event("submit", %{"user_application" => params}, socket) do
    params = Map.put(params, "user_id", socket.assigns.current_user.id)

    changeset =
      UserApplication.changeset(%UserApplication{}, params)

    if changeset.valid? do
      IO.inspect(params, label: "VALID FORM. PARAMS: ")

      case Apps.create_user_app(params) do
        {:ok, created_app} ->
          socket =
            socket
            |> put_flash(:info, "User App created successfully!")
            |> push_navigate(to: "/app/my-apps")

          IO.inspect(created_app, label: "Created app: ")
          {:noreply, socket}

        {:error, _} ->
          socket =
            socket |> put_flash(:error, "Something went wrong while creating the user app!")

          {:noreply, socket}

        _ ->
          socket = socket |> put_flash(:error, "Something went wrong!")
          {:noreply, socket}
      end
    else
      # add action to the changeset to display field error.
      IO.inspect(changeset, label: "Changeset: ")
      changeset = changeset |> Map.put(:action, :insert)
      {:noreply, assign(socket, app_form: to_form(changeset))}
    end
  end

  @impl Phoenix.LiveView
  def render(assigns) do
    ~H"""
    <div class="flex flex-col lg:w-[30%] mx-auto">
      <.header class="text-center">Create a new User App</.header>
      <.simple_form for={@app_form} phx-submit="submit">
        <.input required field={@app_form[:app_name]} label="App Name" class="w-full" />
        <.input required field={@app_form[:webhook_endpoint]} label="Webhook URL" class="w-full" />
        <:actions>
          <.button class="mx-auto">Create New App</.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end
end
