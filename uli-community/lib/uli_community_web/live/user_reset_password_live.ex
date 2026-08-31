defmodule UliCommunityWeb.UserResetPasswordLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Accounts

  def render(assigns) do
    ~H"""
    <div class="w-full max-w-[440px] mx-auto flex flex-col items-center">
      
      <!-- Headline & Subtitle in Labrada -->
      <div class="text-center mb-6 font-['Labrada']">
        <h1 class="text-[28px] font-normal text-[#4e1818] tracking-tight leading-tight">
          <%= gettext("Reset your password") %>
        </h1>
        <p class="text-[15px] text-[#4e1818]/70 mt-1">
          <%= gettext("Enter your new password below.") %>
        </p>
      </div>

      <!-- Modern Dashboard Card (Sans-serif) -->
      <div class="w-full bg-white border border-[#e2d8cc] rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 font-sans">
        <.form
          :let={f}
          for={@form}
          id="reset_password_form"
          phx-submit="reset_password"
          phx-change="validate"
          class="space-y-4"
        >
          <.error :if={@form.errors != []}>
            <%= gettext("Oops, something went wrong! Please check the errors below.") %>
          </.error>

          <div>
            <label for={f[:password].id} class="block text-sm font-semibold text-[#4e1818] mb-1.5">
              <%= gettext("New password") %>
            </label>
            <input
              type="password"
              name={f[:password].name}
              id={f[:password].id}
              value={Phoenix.HTML.Form.normalize_value("password", f[:password].value)}
              required
              autofocus
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-white border border-[#d6c7b2] rounded-lg text-[#4e1818] placeholder-[#4e1818]/40 text-sm focus:outline-none focus:border-[#ff5e00] focus:ring-1 focus:ring-[#ff5e00] transition-colors duration-150"
            />
            <.error :for={msg <- f[:password].errors}><%= msg %></.error>
          </div>

          <div>
            <label for={f[:password_confirmation].id} class="block text-sm font-semibold text-[#4e1818] mb-1.5">
              <%= gettext("Confirm new password") %>
            </label>
            <input
              type="password"
              name={f[:password_confirmation].name}
              id={f[:password_confirmation].id}
              value={Phoenix.HTML.Form.normalize_value("password", f[:password_confirmation].value)}
              required
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-white border border-[#d6c7b2] rounded-lg text-[#4e1818] placeholder-[#4e1818]/40 text-sm focus:outline-none focus:border-[#ff5e00] focus:ring-1 focus:ring-[#ff5e00] transition-colors duration-150"
            />
            <.error :for={msg <- f[:password_confirmation].errors}><%= msg %></.error>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              phx-disable-with={gettext("Resetting...")}
              class="w-full h-[44px] bg-[#4e1818] border border-[#4e1818] text-[#fdf6ed] text-sm font-semibold rounded-lg hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-colors duration-150 inline-flex items-center justify-center cursor-pointer shadow-sm"
            >
              <%= gettext("Reset Password") %> <span aria-hidden="true" class="ml-2 font-mono">→</span>
            </button>
          </div>
        </.form>
      </div>

      <!-- Bottom switch link in Labrada -->
      <div class="mt-6 flex items-center justify-center gap-3 text-sm text-[#4e1818]/80 font-['Labrada']">
        <.link href={~p"/users/register"} class="font-normal text-[#4e1818] underline hover:text-[#ff5e00] transition-colors">
          <%= gettext("Register") %>
        </.link>
        <span>•</span>
        <.link href={~p"/users/log_in"} class="font-normal text-[#4e1818] underline hover:text-[#ff5e00] transition-colors">
          <%= gettext("Log in") %>
        </.link>
      </div>

    </div>
    """
  end

  def mount(params, _session, socket) do
    socket = assign_user_and_token(socket, params)

    form_source =
      case socket.assigns do
        %{user: user} ->
          Accounts.change_user_password(user)

        _ ->
          %{}
      end

    {:ok, assign_form(socket, form_source), temporary_assigns: [form: nil]}
  end

  # Do not log in the user after reset password to avoid a
  # leaked token giving the user access to the account.
  def handle_event("reset_password", %{"user" => user_params}, socket) do
    case Accounts.reset_user_password(socket.assigns.user, user_params) do
      {:ok, _} ->
        {:noreply,
         socket
         |> put_flash(:info, "Password reset successfully.")
         |> redirect(to: ~p"/users/log_in")}

      {:error, changeset} ->
        {:noreply, assign_form(socket, Map.put(changeset, :action, :insert))}
    end
  end

  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset = Accounts.change_user_password(socket.assigns.user, user_params)
    {:noreply, assign_form(socket, Map.put(changeset, :action, :validate))}
  end

  defp assign_user_and_token(socket, %{"token" => token}) do
    if user = Accounts.get_user_by_reset_password_token(token) do
      assign(socket, user: user, token: token)
    else
      socket
      |> put_flash(:error, "Reset password link is invalid or it has expired.")
      |> redirect(to: ~p"/")
    end
  end

  defp assign_form(socket, %{} = source) do
    assign(socket, :form, to_form(source, as: "user"))
  end
end
