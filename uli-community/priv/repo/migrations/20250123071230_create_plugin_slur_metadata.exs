defmodule UliCommunity.Repo.Migrations.CreatePluginSlurMetadata do
  use Ecto.Migration

  def change do
    create table(:plugin_slur_metadata) do
      # The types level_of_severity and category_enum were already created in the previous migration "20250120074709_create_crowdsourced_slurs".
      add :label, :string
      add :level_of_severity, :level_of_severity
      add :casual, :boolean
      add :appropriated, :boolean, default: false, null: false
      add :appropriation_context, :boolean, default: false, null: true
      add :meaning, :string
      add :language, :string
      add :batch, :integer
      add :categories, {:array, :category_enum}

      timestamps(type: :utc_datetime)
    end
  end
end
