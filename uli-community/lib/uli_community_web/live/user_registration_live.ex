defmodule UliCommunityWeb.UserRegistrationLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Accounts
  alias UliCommunity.Accounts.User

  def render(assigns) do
    ~H"""
    <div class="w-full max-w-[440px] mx-auto flex flex-col items-center">
      
      <!-- Headline & Subtitle in Labrada -->
      <div class="text-center mb-6 font-['Labrada']">
        <h1 class="text-[28px] font-normal text-[#4e1818] tracking-tight leading-tight">
          <%= gettext("Create your account") %>
        </h1>
        <p class="text-[15px] text-[#4e1818]/70 mt-1">
          <%= gettext("Join the community to start contributing.") %>
        </p>
      </div>

      <!-- Modern Dashboard Card (Sans-Serif for dashboard UI elements) -->
      <div class="w-full bg-white border border-[#e2d8cc] rounded-2xl shadow-sm overflow-hidden font-sans">
        
        <!-- Segmented Mode Switcher (Homepage active burgundy & orange hover) -->
        <div class="p-3.5 sm:p-4 bg-[#f4ede4] border-b border-[#e2d8cc]">
          <div class="grid grid-cols-2 p-1 bg-[#e7ded3] rounded-xl gap-1">
            <.link 
              navigate={~p"/users/log_in"} 
              class="py-2 text-center text-sm font-medium text-[#4e1818] hover:bg-[#ff5e00] hover:text-white rounded-lg transition-colors duration-150"
            >
              <%= gettext("Log in") %>
            </.link>
            <span class="py-2 text-center text-sm font-semibold text-[#fdf6ed] bg-[#4e1818] rounded-lg shadow-sm select-none">
              <%= gettext("Register") %>
            </span>
          </div>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-8 bg-white">
          <.form
            :let={f}
            for={@form}
            id="registration_form"
            phx-submit="save"
            phx-change="validate"
            phx-trigger-action={@trigger_submit}
            action={~p"/users/log_in?_action=registered"}
            method="post"
            class="space-y-4"
          >
            <.error :if={@check_errors}>
              <%= gettext("Oops, something went wrong! Please check the errors below.") %>
            </.error>

            <!-- Email Input -->
            <div>
              <label for={f[:email].id} class="block text-sm font-semibold text-[#4e1818] mb-1.5">
                <%= gettext("Email address") %>
              </label>
              <input
                type="email"
                name={f[:email].name}
                id={f[:email].id}
                value={Phoenix.HTML.Form.normalize_value("email", f[:email].value)}
                required
                autofocus
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full px-3.5 py-2.5 bg-white border border-[#d6c7b2] rounded-lg text-[#4e1818] placeholder-[#4e1818]/40 text-sm focus:outline-none focus:border-[#ff5e00] focus:ring-1 focus:ring-[#ff5e00] transition-colors duration-150"
              />
              <.error :for={msg <- f[:email].errors}><%= msg %></.error>
            </div>

            <!-- Password Input -->
            <div>
              <label for={f[:password].id} class="block text-sm font-semibold text-[#4e1818] mb-1.5">
                <%= gettext("Password") %>
              </label>
              <input
                type="password"
                name={f[:password].name}
                id={f[:password].id}
                value={Phoenix.HTML.Form.normalize_value("password", f[:password].value)}
                required
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 bg-white border border-[#d6c7b2] rounded-lg text-[#4e1818] placeholder-[#4e1818]/40 text-sm focus:outline-none focus:border-[#ff5e00] focus:ring-1 focus:ring-[#ff5e00] transition-colors duration-150"
              />
              <.error :for={msg <- f[:password].errors}><%= msg %></.error>
            </div>

            <!-- Primary Submit Button (Homepage peach/salmon with orange hover) -->
            <div class="pt-2">
              <button
                type="submit"
                phx-disable-with={gettext("Creating account...")}
                class="w-full h-[44px] bg-[#ffcdc0] border border-[#4e1818] text-[#4e1818] text-sm font-semibold rounded-lg hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-colors duration-150 inline-flex items-center justify-center cursor-pointer shadow-sm"
              >
                <%= gettext("Create an account") %> <span aria-hidden="true" class="ml-2 font-mono">→</span>
              </button>
            </div>
          </.form>
        </div>

      </div>

      <!-- Bottom switch link in Labrada -->
      <p class="mt-6 text-center text-sm text-[#4e1818]/80 font-['Labrada']">
        <%= gettext("Already registered?") %>
        <.link 
          navigate={~p"/users/log_in"} 
          class="font-normal text-[#4e1818] underline underline-offset-4 hover:text-[#ff5e00] ml-1 transition-colors"
        >
          <%= gettext("Log in now") %>
        </.link>
      </p>

    </div>
    """
  end

  def mount(_params, _session, socket) do
    changeset = Accounts.change_user_registration(%User{})

    socket =
      socket
      |> assign(trigger_submit: false, check_errors: false)
      |> assign_form(changeset)

    {:ok, socket, temporary_assigns: [form: nil]}
  end

  def handle_event("save", %{"user" => user_params}, socket) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        {:ok, _} =
          Accounts.deliver_user_confirmation_instructions(
            user,
            &url(~p"/users/confirm/#{&1}")
          )

        changeset = Accounts.change_user_registration(user)
        {:noreply, socket |> assign(trigger_submit: true) |> assign_form(changeset)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, socket |> assign(check_errors: true) |> assign_form(changeset)}
    end
  end

  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset = Accounts.change_user_registration(%User{}, user_params)
    {:noreply, assign_form(socket, Map.put(changeset, :action, :validate))}
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    form = to_form(changeset, as: "user")

    if changeset.valid? do
      assign(socket, form: form, check_errors: false)
    else
      assign(socket, form: form)
    end
  end
end
