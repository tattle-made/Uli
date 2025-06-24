defmodule UliCommunity.Repo.Migrations.CreateTextVecStoreVyakyarth do
  use Ecto.Migration

  def change do
    create table(:text_vec_store_vyakyarth) do
      add(:embedding, :vector, size: 768, null: false)

      add(:cluster, :string)

      add(:crowdsourced_slur_id, references(:crowdsourced_slurs, on_delete: :nothing),
        null: false
      )

      timestamps()
    end

    create(index(:text_vec_store_vyakyarth, [:crowdsourced_slur_id]))
  end
end
