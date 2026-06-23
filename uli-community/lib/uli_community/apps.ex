defmodule UliCommunity.Apps do
  alias UliCommunity.Repo
  alias UliCommunity.Apps.UserApplication
  alias UliCommunity.Accounts.Scope
  import Ecto.Query

  def create_user_app(%Scope{} = scope, params) do
    params = Map.put(params, "user_id", scope.user.id)

    %UserApplication{}
    |> UserApplication.changeset(params)
    |> Repo.insert()
  end

  def get_user_apps(%Scope{} = scope) do
    UserApplication
    |> where([ua], ua.user_id == ^scope.user.id)
    |> Repo.all()
  end

  def get_user_app_by_id(%Scope{} = scope, app_id) do
    UserApplication
    |> where([ua], ua.id == ^app_id and ua.user_id == ^scope.user.id)
    |> preload(:user)
    |> Repo.one()
  end

  def update_user_app(%UserApplication{} = user_app, params) do
    user_app
    |> UserApplication.changeset(params)
    |> Repo.update()
  end

  def delete_user_app(%UserApplication{} = user_app) do
    Repo.delete(user_app)
  end
end
