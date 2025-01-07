defmodule UliCommunity.Api do
  alias UliCommunity.Repo
  alias UliCommunity.Api.AccessToken

  def add_new_access_token(attrs) do
    attrs = Map.put_new(attrs, :token_id, Ecto.UUID.generate())

    %AccessToken{}
    |> AccessToken.changeset(attrs)
    |> Repo.insert()
  end

  def get_access_tokens_by_user_id(id) do
    import Ecto.Query, only: [from: 2]

    query =
      from token in AccessToken,
        where: token.created_by_user == ^id,
        order_by: [desc: token.inserted_at]

    Repo.all(query)
  end

  def get_access_token(token_id) do
    Repo.get_by(AccessToken, token_id: token_id)
  end

  def delete_access_token_by_token_id(token_id) do
    entry = Repo.get_by(AccessToken, token_id: token_id)

    if entry do
      Repo.delete(entry)
    end
  end
end
