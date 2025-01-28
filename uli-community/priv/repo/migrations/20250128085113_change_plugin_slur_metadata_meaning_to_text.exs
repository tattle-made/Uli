defmodule UliCommunity.Repo.Migrations.ChangePluginSlurMetadataMeaningToText do
  use Ecto.Migration

  def change do
    alter table(:plugin_slur_metadata) do
      modify(:meaning, :text)
    end
  end
end
