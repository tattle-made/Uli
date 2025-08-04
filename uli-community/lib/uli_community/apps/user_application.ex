defmodule UliCommunity.Apps.UserApplication do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  # @foreign_key_type :binary_id
  schema "user_applications" do
    field :app_name, :string
    field :webhook_endpoint, :string
    belongs_to :user, UliCommunity.Accounts.User
    has_many :app_access_token, UliCommunity.Api.AppAccessToken

    timestamps(type: :utc_datetime)
  end

  def changeset(user_app, params \\ %{}) do
    user_app
    |> cast(params, [:app_name, :webhook_endpoint, :user_id])
    |> validate_required([:app_name, :webhook_endpoint, :user_id])
    |> validate_change(:webhook_endpoint, &validate_webhook_url/2)
  end

  defp validate_webhook_url(:webhook_endpoint, url) do
    case URI.parse(url) do
      %URI{scheme: scheme, host: host}
      when scheme in ["http", "https"] and is_binary(host) ->
        # no errors
        []

      _ ->
        [webhook_endpoint: "Invalid URL: must be something like https://myapp/webhook-endpoint"]
    end
  end
end
