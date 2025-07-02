defmodule UliCommunity.Workers.TextEmbeddingWorker do
  use Oban.Worker,
    queue: :text_index,
    max_attempts: 1

  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.Repo

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"items" => items}}) do
    case TextVecRepVyakyarth.get_embeddings(items) do
      {:ok, embeddings} ->
        Enum.each(embeddings, fn embedding_map ->
          id = embedding_map[~c"id"]
          embedding = embedding_map[~c"embedding"]

          %TextVecStoreVyakyarth{}
          |> TextVecStoreVyakyarth.changeset(%{
            embedding: embedding,
            crowdsourced_slur_id: id
          })
          |> Repo.insert()
        end)

      {:error, reason} ->
        {:error, "Failed to process text: #{reason}"}
    end
  end
end
