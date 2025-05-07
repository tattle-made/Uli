defmodule UliCommunity.Repo.Migrations.AddPageUrlToCrowdsourcedSlurs do
  use Ecto.Migration

  def change do
    alter table(:crowdsourced_slurs) do
      add(:page_url, :text)
    end
  end
end
