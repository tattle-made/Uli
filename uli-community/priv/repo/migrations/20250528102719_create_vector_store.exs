defmodule UliCommunity.Repo.Migrations.CreateVectorStore do
  use Ecto.Migration

  def change do
    create table(:vector_store) do
      add(:embedding, :vector)
      add(:media_type, :string)

      timestamps()
    end
  end
end
