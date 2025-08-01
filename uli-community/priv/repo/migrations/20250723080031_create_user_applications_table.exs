defmodule UliCommunity.Repo.Migrations.CreateUserApplicationsTable do
  use Ecto.Migration

  def change do
    create table(:user_applications, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :app_name, :string, null: false
      add :webhook_endpoint, :string, null: false
      add :user_id, references(:users, type: :integer), null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:user_applications, [:id])
    create index(:user_applications, [:user_id])
  end
end
