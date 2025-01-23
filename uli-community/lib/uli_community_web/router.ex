defmodule UliCommunityWeb.Router do
  use UliCommunityWeb, :router

  import UliCommunityWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {UliCommunityWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    # plug Corsica, origins: "*", allow_headers: ["content-type"], allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  end

  pipeline :authenticated_api do
    plug UliCommunityWeb.Plugs.AuthenticateApi
  end

  pipeline :authenticated_access_token do
    plug UliCommunityWeb.Plugs.AuthenticateAccessToken
  end

  scope "/", UliCommunityWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", UliCommunityWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:uli_community, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: UliCommunityWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/nolive", UliCommunityWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    get "/users/register", UserRegistrationController, :new
    post "/users/register", UserRegistrationController, :create
    get "/users/log_in", UserSessionController, :new
    post "/users/log_in", UserSessionController, :create
    get "/users/reset_password", UserResetPasswordController, :new
    post "/users/reset_password", UserResetPasswordController, :create
    get "/users/reset_password/:token", UserResetPasswordController, :edit
    put "/users/reset_password/:token", UserResetPasswordController, :update
  end

  scope "/nolive", UliCommunityWeb do
    pipe_through [:browser, :require_authenticated_user]

    get "/users/settings", UserSettingsController, :edit
    put "/users/settings", UserSettingsController, :update
    get "/users/settings/confirm_email/:token", UserSettingsController, :confirm_email
  end

  scope "/nolive", UliCommunityWeb do
    pipe_through [:browser]

    delete "/users/log_out", UserSessionController, :delete
    get "/users/confirm", UserConfirmationController, :new
    post "/users/confirm", UserConfirmationController, :create
    get "/users/confirm/:token", UserConfirmationController, :edit
    post "/users/confirm/:token", UserConfirmationController, :update
  end

  ## Auth routes for API
  scope "/api", UliCommunityWeb do
    pipe_through :api
    post "/auth/login", SessionControllerApi, :new
  end

  scope "/api", UliCommunityWeb do
    pipe_through [:api, :authenticated_api]
    get "/auth/hi", SessionControllerApi, :say_hi
    resources "/slurs", SlursController, except: [:edit, :new]
    options "/slurs", SlurController, :options
  end
  # scope "/api", UliCommunityWeb do
  #   pipe_through [:api]
  #   options "/slurs", SlurController, :options

  # end

  ## Auth routes for Access Token
  scope "/api/accesstoken", UliCommunityWeb do
    pipe_through [:api, :authenticated_access_token]
    get "/hi", AccessTokenController, :say_hi
  end

  ## Authentication routes

  scope "/", UliCommunityWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    live_session :redirect_if_user_is_authenticated,
      on_mount: [{UliCommunityWeb.UserAuth, :redirect_if_user_is_authenticated}] do
      live "/users/register", UserRegistrationLive, :new
      live "/users/log_in", UserLoginLive, :new
      live "/users/reset_password", UserForgotPasswordLive, :new
      live "/users/reset_password/:token", UserResetPasswordLive, :edit
    end

    post "/users/log_in", UserSessionLiveController, :create
  end

  scope "/", UliCommunityWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [
        {UliCommunityWeb.UserAuth, :ensure_authenticated},
        {UliCommunityWeb.UserAuth, :ensure_authorized}
      ] do
      live "/users/settings", UserSettingsLive, :edit
      live "/users/settings/confirm_email/:token", UserSettingsLive, :confirm_email
      live "/testadmin", TestAdminRoleLive, :index
      live "/gentoken", TokenGeneratorLive, :index
    end
  end

  scope "/", UliCommunityWeb do
    pipe_through [:browser]

    delete "/users/log_out", UserSessionController, :delete

    live_session :current_user,
      on_mount: [{UliCommunityWeb.UserAuth, :mount_current_user}] do
      live "/users/confirm/:token", UserConfirmationLive, :edit
      live "/users/confirm", UserConfirmationInstructionsLive, :new
    end
  end

  def route_info(method, path, host) do
    Phoenix.Router.route_info(__MODULE__, method, path, host)
  end
end
