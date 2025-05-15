defmodule UliCommunity.Repo.Migrations.AddSourceAndSessionIdToCrowdsourcedSlurs do
  use Ecto.Migration

  def change do
    execute("""
    CREATE TYPE crowdsourced_slurs_source AS ENUM ('plugin', 'experts_2022', 'crowdsourcing_exercise')
    """)

    alter table(:crowdsourced_slurs) do
      add(:source, :crowdsourced_slurs_source)
      add(:session_id, :string)
    end
  end
end
