defmodule UliCommunity.Api do
  alias UliCommunity.Repo
  alias UliCommunity.Api.AccessToken
  alias UliCommunity.Api.AppAccessToken
  alias UliCommunity.Accounts.Scope
  import Ecto.Query

  def add_new_access_token(%Scope{} = scope, attrs) do
    attrs =
      attrs
      |> Map.put_new(:token_id, Ecto.UUID.generate())
      |> Map.put(:created_by_user, scope.user.id)

    %AccessToken{}
    |> AccessToken.changeset(attrs)
    |> Repo.insert()
  end

  def get_access_tokens_by_user_id(%Scope{} = scope) do
    from(token in AccessToken,
      where: token.created_by_user == ^scope.user.id,
      order_by: [desc: token.inserted_at]
    )
    |> Repo.all()
  end

  def get_access_token(token_id) do
    Repo.get_by(AccessToken, token_id: token_id)
  end

  def delete_access_token_by_token_id(%Scope{} = scope, token_id) do
    entry = Repo.get_by(AccessToken, token_id: token_id)

    cond do
      is_nil(entry) -> {:error, :not_found}
      entry.created_by_user != scope.user.id -> {:error, :unauthorized}
      true -> Repo.delete(entry)
    end
  end

  def add_new_app_access_token(attrs) do
    attrs = Map.put_new(attrs, :token_id, Ecto.UUID.generate())

    %AppAccessToken{}
    |> AppAccessToken.changeset(attrs)
    |> Repo.insert()
  end

  def get_app_access_tokens_by_app_id(app_id) do
    from(token in AppAccessToken,
      where: token.user_application_id == ^app_id,
      order_by: [desc: token.inserted_at]
    )
    |> Repo.all()
  end

  def delete_app_access_token_by_token_id(%Scope{} = scope, token_id) do
    query =
      from t in AppAccessToken,
        join: a in UliCommunity.Apps.UserApplication,
        on: t.user_application_id == a.id,
        where: t.token_id == ^token_id and a.user_id == ^scope.user.id

    case Repo.one(query) do
      nil -> {:error, :not_found}
      entry -> Repo.delete(entry)
    end
  end

  def get_app_access_token(token_id) do
    Repo.get_by(AppAccessToken, token_id: token_id)
  end
end
