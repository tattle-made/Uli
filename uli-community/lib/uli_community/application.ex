defmodule UliCommunity.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children =
      [
        UliCommunityWeb.Telemetry,
        UliCommunity.Repo,
        {DNSCluster, query: Application.get_env(:uli_community, :dns_cluster_query) || :ignore},
        {Oban, Application.fetch_env!(:uli_community, Oban)},
        {Phoenix.PubSub, name: UliCommunity.PubSub},
        # Start the Finch HTTP client for sending emails
        {Finch, name: UliCommunity.Finch}
        # Start a worker by calling: UliCommunity.Worker.start_link(arg)
        # {UliCommunity.Worker, arg},
      ] ++
        enable_text_vyakyarth_model() ++
        [
          # Start to serve requests, typically the last entry
          UliCommunityWeb.Endpoint
        ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: UliCommunity.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    UliCommunityWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  def enable_text_vyakyarth_model do
    if Application.get_env(:uli_community, :enable_text_vec_rep_vyakyarth, false) do
      [UliCommunity.MediaProcessing.TextVecRepVyakyarth]
    else
      []
    end
  end
end
