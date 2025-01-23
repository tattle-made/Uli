defmodule UliCommunityWeb.SlursController do
  use UliCommunityWeb, :controller
  alias UliCommunity.UserContribution
  import Logger

  def options(conn, _params) do
    conn
    |> send_resp(200, "")
  end

  def index(conn,_) do
    user = conn.assigns[:current_user]

    case UserContribution.get_crowdsourced_slur_by_user(user.id) do
      {:ok, slurs} ->
        # IO.inspect(slurs, label: "SLURS: ")
        json(conn, %{message: "success", slurs: slurs})

      {:error, reason} ->
        Logger.error("Failed to get slurs: #{inspect(reason)}")

        conn
        |> put_status(:internal_server_error)
        |> json(%{
          message: "Failed to get slurs",
        })
    _ ->
        Logger.error("Something went wrong during getting slurs")

        conn
        |> put_status(:internal_server_error)
        |> json(%{
          message: "Failed to get slurs",
        })
    end
  end

  def show(conn, %{"id" => id}) do

    case UserContribution.get_crowdsourced_slur!(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Slur not found"})
      slur->
        conn
        |> json(%{message: "success", slur: slur})

    end

  end

  def update(conn, payload) do

    IO.inspect(payload, label: "RECEIVED PAYLOAD: ")

    payload =
      payload
      |> Enum.into(%{}, fn {k, v} -> {Macro.underscore(k), v} end)
      # |> Map.put("contributor_user_id", user.id)

    slur = UserContribution.get_crowdsourced_slur!(payload["id"])

    case UserContribution.update_crowdsourced_slur(slur, payload) do
      {:ok, slur} ->
        json(conn, %{message: "success", data: slur})

      {:error, changeset} ->
        Logger.error("Failed to create slur: #{inspect(changeset.errors)}")

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          message: "Failed to create resource",
          errors: translate_errors(changeset)
        })
    end
  end

  def delete(conn, %{"id" => id}) do
    case UserContribution.get_crowdsourced_slur!(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Slur not found"})

      slur ->
        case UserContribution.delete_crowdsourced_slur(slur) do
          {:ok, deleted_slur} ->
            conn
            |> json(%{message: "Slur successfully deleted", deleted_slur: deleted_slur})

          {:error, reason} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to delete slur", reason: reason})
        end
    end
  end


  def create(conn, %{"label" => _label} = payload) when map_size(payload) == 1 do
    user = conn.assigns[:current_user]

    payload =
      payload
      |> Map.put("contributor_user_id", user.id)

    Logger.debug("INSIDE CREATE REQUEST: #{inspect(payload)}")
    # Logger.debug("USER IS: #{inspect(user)}")

    case UserContribution.create_crowdsourced_slur_with_label(payload) do
      {:ok, slur} ->
        json(conn, %{message: "success", data: slur})

      {:error, changeset} ->
        Logger.error("Failed to create slur: #{inspect(changeset.errors)}")

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          message: "Failed to create resource",
          errors: translate_errors(changeset)
        })
    end
  end

  def create(conn, payload) do
    user = conn.assigns[:current_user]

    payload =
      payload
      |> Enum.into(%{}, fn {k, v} -> {Macro.underscore(k), v} end)
      |> Map.put("contributor_user_id", user.id)

    Logger.debug("INSIDE CREATE REQUEST: #{inspect(payload)}")
    # Logger.debug("USER IS: #{inspect(user)}")

    case UserContribution.create_crowdsourced_slur(payload) do
      {:ok, slur} ->
        json(conn, %{message: "success", data: slur})

      {:error, changeset} ->
        Logger.error("Failed to create slur: #{inspect(changeset.errors)}")

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          message: "Failed to create resource",
          errors: translate_errors(changeset)
        })
    end
  end

  # Helper to translate changeset errors into a readable format
  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts
        |> Keyword.get(String.to_existing_atom(key), key)
        |> to_string()
      end)
    end)
  end
end
