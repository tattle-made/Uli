defmodule UliCommunity.Repo.Migrations.CreateAccessToken do
  use Ecto.Migration

  def change do
    create table(:access_token) do
      add :token_id, :uuid
      add :token_name, :string
      add :access_level, :string
      add :expiry, :date
      add :created_by_user, :bigint

      timestamps(type: :utc_datetime)
    end
  end
end
