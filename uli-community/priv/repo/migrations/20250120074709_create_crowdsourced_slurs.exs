defmodule UliCommunity.Repo.Migrations.CreateCrowdsourcedSlurs do
  use Ecto.Migration

  def change do

    execute("CREATE TYPE level_of_severity AS ENUM ('low', 'medium', 'high')")
    create table(:crowdsourced_slurs) do
      add :label, :string
      add :level_of_severity, :level_of_severity
      add :casual, :boolean, default: false, null: false
      add :appropriated, :boolean, default: false, null: false
      add :appropriation_context, :boolean, default: false, null: false
      add :meaning, :text
      add :category, {:array, :string}

      timestamps(type: :utc_datetime)
    end
  end
end
