defmodule UliCommunity.Repo do
  use Ecto.Repo,
    otp_app: :uli_community,
    adapter: Ecto.Adapters.Postgres
end
