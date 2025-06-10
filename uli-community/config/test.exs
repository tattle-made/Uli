import Config
config :uli_community, Oban, testing: :manual

# Only in tests, remove the complexity from the password hashing algorithm
config :bcrypt_elixir, :log_rounds, 1

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :uli_community, UliCommunity.Repo,
  username: "uli_community",
  password: "weak_password",
  hostname: "localhost",
  database: "uli_community_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: System.schedulers_online() * 2

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :uli_community, UliCommunityWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "UzRwVgVkiriZM7MRHm+TDKbg4FH0J9MaXpfE5tMwCZ6MfvFZP+jRcy2h9GcVA9I/",
  server: false

# In test we don't send emails
config :uli_community, UliCommunity.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true

# setup python venv paths
config :uli_community, :python,
  python: Path.join([File.cwd!(), "lib", "python", ".venv", "bin", "python"]),
  python_path: Path.join([File.cwd!(), "lib", "python"])
