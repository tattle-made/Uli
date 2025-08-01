defmodule UliCommunity.Repo.Migrations.CreateAppAccessTokenTable do
  use Ecto.Migration

  def change do
    create table(:app_access_tokens) do
      add :token_id, :uuid
      add :token_name, :string
      add :scope, {:array, :string}
      add :expiry, :date
      add :user_application_id, references(:user_applications, type: :binary_id, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime)
    end

  end
end
