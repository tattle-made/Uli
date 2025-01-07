defmodule UliCommunityWeb.Plugs.AuthenticateAccessToken do
  use UliCommunityWeb, :controller

  require Logger

  alias UliCommunity.Api.AccessToken
  alias UliCommunity.Api.Token
  alias UliCommunity.Api

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, data} <- Token.verify(token),
         %AccessToken{} = access_token <- Api.get_access_token(data.token_id),
         true <- access_token.expiry >= Date.utc_today() do
      conn |> assign(:access_token, access_token)
    else
      _error -> conn |> put_status(:unauthorized) |> json(%{error: "Access is Unauthorized"}) |> halt()
    end
  end

end
