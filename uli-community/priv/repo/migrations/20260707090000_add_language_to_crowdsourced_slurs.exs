defmodule UliCommunity.Repo.Migrations.AddLanguageToCrowdsourcedSlurs do
  use Ecto.Migration

  def change do
    execute("CREATE TYPE language_enum AS ENUM ('hindi', 'english', 'tamil', 'bengali', 'malayalam')")

    alter table(:crowdsourced_slurs) do
      add(:language, :language_enum)
    end
  end
end
