defmodule UliCommunity.Labs.B2P1.Channels do
  use Ecto.Schema
  import Ecto.Changeset

  schema "b2_p1_channels" do
    field :name, :string
    field :handle, :string

    belongs_to :platform, UliCommunity.Labs.B2P1.Platforms
    has_many :posts, UliCommunity.Labs.B2P1.Posts, foreign_key: :channel_id

    timestamps(type: :utc_datetime)
  end

  def changeset(channel, attrs) do
    channel
    |> cast(attrs, [:platform_id, :name, :handle])
    |> update_change(:handle, &(&1 |> String.trim() |> String.trim_leading("@")))
    |> validate_required([:platform_id, :handle])
    |> foreign_key_constraint(:platform_id)
    |> unique_constraint([:platform_id, :handle], message: "channel already exists")
  end
end
