defmodule UliCommunity.Repo.Migrations.CreateTextVecStoreVyakyarth do
  use Ecto.Migration

  def up do
    create table(:text_vec_store_vyakyarth) do
      add(:embedding, :vector, size: 768, null: false)
      add(:cluster, :string)

      add(:crowdsourced_slur_id, references(:crowdsourced_slurs, on_delete: :nothing),
        null: false
      )

      timestamps()
    end

    create(index(:text_vec_store_vyakyarth, [:crowdsourced_slur_id]))

    execute("""
    CREATE INDEX text_vec_store_vyakyarth_embedding_hnsw_idx
    ON text_vec_store_vyakyarth
    USING hnsw (embedding vector_cosine_ops)
    """)
  end

  def down do
    drop table(:text_vec_store_vyakyarth)
  end
end
