defmodule UliCommunityWeb.UserConfirmationLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.Accounts

  def render(%{live_action: :edit} = assigns) do
    ~H"""
    <div class="w-full max-w-[440px] mx-auto flex flex-col items-center">
      
      <!-- Headline & Subtitle -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">
          <%= gettext("Confirm your account") %>
        </h1>
        <p class="text-sm text-neutral-500 mt-1">
          <%= gettext("Click below to complete your email confirmation.") %>
        </p>
      </div>

      <!-- Modern Dashboard Card -->
      <div class="w-full bg-white border border-[#e2d8cc] rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <.form for={@form} id="confirmation_form" phx-submit="confirm_account" class="space-y-4">
          <input type="hidden" name={@form[:token].name} value={@form[:token].value} />
          <div>
            <button
              type="submit"
              phx-disable-with={gettext("Confirming...")}
              class="w-full h-[44px] bg-[#4e1818] border border-[#4e1818] text-[#fdf6ed] text-sm font-semibold rounded-lg hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-colors duration-150 inline-flex items-center justify-center cursor-pointer shadow-sm"
            >
              <%= gettext("Confirm my account") %> <span aria-hidden="true" class="ml-2 font-mono">→</span>
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

  def mount(%{"token" => token}, _session, socket) do
    form = to_form(%{"token" => token}, as: "user")
    {:ok, assign(socket, form: form), temporary_assigns: [form: nil]}
  end

  # Do not log in the user after confirmation to avoid a
  # leaked token giving the user access to the account.
  def handle_event("confirm_account", %{"user" => %{"token" => token}}, socket) do
    case Accounts.confirm_user(token) do
      {:ok, _} ->
        {:noreply,
         socket
         |> put_flash(:info, "User confirmed successfully.")
         |> redirect(to: ~p"/")}

      :error ->
        # If there is a current user and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the user themselves, so we redirect without
        # a warning message.
        case socket.assigns do
          %{current_user: %{confirmed_at: confirmed_at}} when not is_nil(confirmed_at) ->
            {:noreply, redirect(socket, to: ~p"/")}

          %{} ->
            {:noreply,
             socket
             |> put_flash(:error, "User confirmation link is invalid or it has expired.")
             |> redirect(to: ~p"/")}
        end
    end
  end
end
