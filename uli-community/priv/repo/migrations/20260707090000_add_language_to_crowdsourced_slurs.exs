defmodule UliCommunity.Repo.Migrations.AddLanguageToCrowdsourcedSlurs do
  use Ecto.Migration

  def change do
    alter table(:crowdsourced_slurs) do
      add(:language, :string, size: 3)
    end
  end
end
