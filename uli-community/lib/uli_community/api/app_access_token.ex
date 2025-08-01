defmodule UliCommunity.Api.AppAccessToken do
  use Ecto.Schema
  import Ecto.Changeset

  schema "app_access_tokens" do
    field :token_id, Ecto.UUID
    field :token_name, :string
    field :scope, {:array, :string}, default: ["dataset", "classify"]
    field :expiry, :date
    belongs_to :user_application, UliCommunity.Apps.UserApplication, type: :binary_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(access_token, attrs) do
    access_token
    |> cast(attrs, [:token_id, :token_name, :expiry, :user_application_id])
    |> validate_required([:token_id, :token_name, :expiry, :user_application_id])
  end
end
