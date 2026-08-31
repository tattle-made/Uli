defmodule UliCommunityWeb.UserLoginLive do
  use UliCommunityWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="w-full max-w-[440px] mx-auto flex flex-col items-center">
      
      <!-- Headline & Subtitle in Labrada -->
      <div class="text-center mb-6 font-['Labrada']">
        <h1 class="text-[28px] font-normal text-[#4e1818] tracking-tight leading-tight">
          <%= gettext("Log in to your account") %>
        </h1>
        <p class="text-[15px] text-[#4e1818]/70 mt-1">
          <%= gettext("Welcome back! Please enter your details.") %>
        </p>
      </div>

      <!-- Modern Dashboard Card (Sans-Serif for dashboard UI elements) -->
      <div class="w-full bg-white border border-[#e2d8cc] rounded-2xl shadow-sm overflow-hidden font-sans">
        
        <!-- Segmented Mode Switcher (Homepage active burgundy & orange hover) -->
        <div class="p-3.5 sm:p-4 bg-[#f4ede4] border-b border-[#e2d8cc]">
          <div class="grid grid-cols-2 p-1 bg-[#e7ded3] rounded-xl gap-1">
            <span class="py-2 text-center text-sm font-semibold text-[#fdf6ed] bg-[#4e1818] rounded-lg shadow-sm select-none">
              <%= gettext("Log in") %>
            </span>
            <.link 
              navigate={~p"/users/register"} 
              class="py-2 text-center text-sm font-medium text-[#4e1818] hover:bg-[#ff5e00] hover:text-white rounded-lg transition-colors duration-150"
            >
              <%= gettext("Register") %>
            </.link>
          </div>
        </div>

        <!-- Form Body -->
        <div class="p-6 sm:p-8 bg-white">
          <.form
            :let={f}
            for={@form}
            id="login_form"
            action={~p"/users/log_in"}
            phx-update="ignore"
            class="space-y-4"
          >
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
              <div class="flex items-center justify-between mb-1.5">
                <label for={f[:password].id} class="block text-sm font-semibold text-[#4e1818]">
                  <%= gettext("Password") %>
                </label>
                <.link 
                  href={~p"/users/reset_password"} 
                  class="text-xs font-medium text-[#4e1818] hover:text-[#ff5e00] hover:underline transition-colors duration-150"
                >
                  <%= gettext("Forgot password?") %>
                </.link>
              </div>
              <input
                type="password"
                name={f[:password].name}
                id={f[:password].id}
                value={Phoenix.HTML.Form.normalize_value("password", f[:password].value)}
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 bg-white border border-[#d6c7b2] rounded-lg text-[#4e1818] placeholder-[#4e1818]/40 text-sm focus:outline-none focus:border-[#ff5e00] focus:ring-1 focus:ring-[#ff5e00] transition-colors duration-150"
              />
              <.error :for={msg <- f[:password].errors}><%= msg %></.error>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="pt-1">
              <label class="flex items-center gap-2.5 text-sm text-[#4e1818] font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  name={f[:remember_me].name}
                  id={f[:remember_me].id}
                  value="true"
                  checked={Phoenix.HTML.Form.normalize_value("checkbox", f[:remember_me].value)}
                  class="rounded border-[#d6c7b2] text-[#4e1818] focus:ring-[#ff5e00] h-4 w-4 cursor-pointer"
                />
                <span><%= gettext("Keep me logged in") %></span>
              </label>
            </div>

            <!-- Primary Submit Button (Homepage deep burgundy with electric orange hover) -->
            <div class="pt-2">
              <button
                type="submit"
                phx-disable-with={gettext("Logging in...")}
                class="w-full h-[44px] bg-[#4e1818] border border-[#4e1818] text-[#fdf6ed] text-sm font-semibold rounded-lg hover:bg-[#ff5e00] hover:border-[#ff5e00] hover:text-white transition-colors duration-150 inline-flex items-center justify-center cursor-pointer shadow-sm"
              >
                <%= gettext("Log in") %> <span aria-hidden="true" class="ml-2 font-mono">→</span>
              </button>
            </div>
          </.form>
        </div>

      </div>

      <!-- Bottom switch link in Labrada -->
      <p class="mt-6 text-center text-sm text-[#4e1818]/80 font-['Labrada']">
        <%= gettext("Don't have an account?") %>
        <.link 
          navigate={~p"/users/register"} 
          class="font-normal text-[#4e1818] underline underline-offset-4 hover:text-[#ff5e00] ml-1 transition-colors"
        >
          <%= gettext("Sign up now") %>
        </.link>
      </p>

    </div>
    """
  end

  def mount(_params, _session, socket) do
    email = Phoenix.Flash.get(socket.assigns.flash, :email)
    form = to_form(%{"email" => email}, as: "user")
    {:ok, assign(socket, form: form), temporary_assigns: [form: form]}
  end
end
