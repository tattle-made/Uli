defmodule UliCommunity.Repo.Migrations.CreatePluginSlurs do
  use Ecto.Migration

  def change do
    create table(:plugin_slurs) do
      add :label, :string
      add :language, :string
      add :batch, :integer

      timestamps(type: :utc_datetime)
    end
  end
end
