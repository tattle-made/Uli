defmodule UliCommunity.Api.AccessToken do
  use Ecto.Schema
  import Ecto.Changeset

  schema "access_token" do
    field :token_id, Ecto.UUID
    field :token_name, :string
    field :access_level, :string
    field :expiry, :date
    field :created_by_user, :integer

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(access_token, attrs) do
    access_token
    |> cast(attrs, [:token_id, :token_name, :access_level, :expiry, :created_by_user])
    |> validate_required([:token_id, :token_name, :access_level, :expiry, :created_by_user])
  end
end
