defmodule UliCommunity.MediaStore.VectorStore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "vector_store" do
    field :embedding, Pgvector.Ecto.Vector
    field :media_type, :string

    timestamps()
  end

  def changeset(vector_store, attrs) do
    vector_store
    |> cast(attrs, [:embedding, :media_type])
    |> validate_required([:embedding, :media_type])
  end
end
