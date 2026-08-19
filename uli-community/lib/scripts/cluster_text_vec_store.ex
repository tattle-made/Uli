defmodule Scripts.ClusterTextVecStore do
  @moduledoc """
  Script to cluster text vector store embeddings using Python clustering functionality.
  """
  use Export.Python
  require Logger
  alias UliCommunity.Repo
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth

  @python_path Application.compile_env(:uli_community, [:python, :python_path])
  @python_executable Application.compile_env(:uli_community, [:python, :python])

  def run do
    # Get all text vector store entries
    vectors = Repo.all(TextVecStoreVyakyarth)
    Logger.info("Starting text vector clustering for #{length(vectors)} vectors")

    # Format data for Python clustering
    operator_parameters =
      Enum.map(vectors, fn vector ->
        %{
          "payload" => %{
            "id" => vector.id
          },
          "embedding" => Pgvector.to_list(vector.embedding)
        }
      end)

    case Python.start(python_path: @python_path, python: @python_executable) do
      {:ok, py} ->
        Logger.info("Python clustering process started")

        try do
          clusters = Python.call(py, "clustering", "get_clusters", [operator_parameters])

          update_clusters(clusters)
          Logger.info("Finished updating cluster assignments")

          {:ok, clusters}
        rescue
          e ->
            Logger.error("Failed to run clustering: #{inspect(e)}")
            {:error, "Clustering failed: #{inspect(e)}"}
        after
          Python.stop(py)
        end

      {:error, reason} ->
        Logger.error("Failed to start Python process: #{inspect(reason)}")
        {:error, "Failed to initialize Python environment: #{inspect(reason)}"}
    end
  end

  defp update_clusters(clusters) do
    Enum.each(clusters, fn {cluster_key, items} ->
      # Convert key to string and extract the number after "cluster_"
      cluster_str = to_string(cluster_key)

      cluster_number =
        case String.split(cluster_str, "_") do
          [_, num] -> num
          _ -> raise "Unexpected cluster key format: #{inspect(cluster_key)}"
        end

      Logger.info("Updating #{length(items)} vectors for cluster #{cluster_number}")

      Enum.each(items, fn item ->
        # because the key is a charlist
        id = item |> Map.get(~c"id")

        case Repo.get(TextVecStoreVyakyarth, id) do
          nil ->
            Logger.warning(
              "Could not find vector #{inspect(id)} while updating cluster #{cluster_number}"
            )

          vector ->
            case vector |> Ecto.Changeset.change(%{cluster: cluster_number}) |> Repo.update() do
              {:ok, _vector} ->
                :ok

              {:error, changeset} ->
                Logger.warning(
                  "Failed to update vector #{inspect(id)} for cluster #{cluster_number}: #{inspect(changeset.errors)}"
                )
            end
        end
      end)
    end)
  end
end
