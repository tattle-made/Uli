defmodule UliCommunity.Labs.P1.Platforms do
  use Ecto.Schema
  import Ecto.Changeset

  schema "p1_platforms" do
    field :slug, :string
    field :name, :string
    field :content_types, {:array, :string}, default: []

    has_many :channels, UliCommunity.Labs.P1.Channels, foreign_key: :platform_id

    timestamps(type: :utc_datetime)
  end

  def changeset(platform, attrs) do
    platform
    |> cast(attrs, [:slug, :name, :content_types])
    |> validate_required([:slug, :name])
    |> unique_constraint(:slug)
  end
end
