defmodule UliCommunityWeb.UserConfirmationInstructionsLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Accounts

  def render(assigns) do
    ~H"""
    <div class="w-full max-w-[440px] mx-auto flex flex-col items-center">
      
      <!-- Headline & Subtitle -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">
          <%= gettext("Resend confirmation instructions") %>
        </h1>
        <p class="text-sm text-neutral-500 mt-1">
          <%= gettext("Enter your email address and we will send you confirmation instructions.") %>
        </p>
      </div>

      <!-- Modern Dashboard Card -->
      <div class="w-full bg-white border border-[#e2d8cc] rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <.form :let={f} for={@form} id="resend_confirmation_form" phx-submit="send_instructions" class="space-y-4">
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

          <div class="pt-2">
            <button
              type="submit"
              phx-disable-with={gettext("Sending...")}
              class="w-full h-[44px] bg-[#4e1818] border border-[#4e1818] text-[#fdf6ed] text-sm font-semibold rounded-lg hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-colors duration-150 inline-flex items-center justify-center cursor-pointer shadow-sm"
            >
              <%= gettext("Resend instructions") %> <span aria-hidden="true" class="ml-2 font-mono">→</span>
            </button>
          </div>
        </.form>
      </div>

      <!-- Bottom switch links -->
      <p class="mt-6 text-center text-sm text-neutral-500 space-x-2">
        <.link 
          navigate={~p"/users/log_in"} 
          class="font-semibold text-neutral-900 underline underline-offset-4 hover:text-black transition-colors"
        >
          <%= gettext("Log in") %>
        </.link>
        <span>•</span>
        <.link 
          navigate={~p"/users/register"} 
          class="font-semibold text-neutral-900 underline underline-offset-4 hover:text-black transition-colors"
        >
          <%= gettext("Register") %>
        </.link>
      </p>

    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, form: to_form(%{}, as: "user"))}
  end

  def handle_event("send_instructions", %{"user" => %{"email" => email}}, socket) do
    if user = Accounts.get_user_by_email(email) do
      Accounts.deliver_user_confirmation_instructions(
        user,
        &url(~p"/users/confirm/#{&1}")
      )
    end

    info =
      "If your email is in our system and it has not been confirmed yet, you will receive an email with instructions shortly."

    {:noreply,
     socket
     |> put_flash(:info, info)
     |> redirect(to: ~p"/")}
  end
end
