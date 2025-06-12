defmodule UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth do
  use Ecto.Schema
  import Ecto.Changeset

  schema "text_vec_store_vyakyarth" do
    field :embedding, Pgvector.Ecto.Vector
    field :cluster, :string
    belongs_to :crowdsourced_slur, UliCommunity.UserContribution.CrowdsourcedSlur

    timestamps()
  end

  def changeset(vector_store, attrs) do
    vector_store
    |> cast(attrs, [:embedding, :crowdsourced_slur_id])
    |> validate_required([:embedding, :crowdsourced_slur_id])
    |> foreign_key_constraint(:crowdsourced_slur_id)
  end
end
