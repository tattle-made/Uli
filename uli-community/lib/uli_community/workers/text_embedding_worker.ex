defmodule UliCommunity.Workers.TextEmbeddingWorker do
  use Oban.Worker,
    queue: :index,
    max_attempts: 1

  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.Repo

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"label" => label, "crowdsourced_slur_id" => slur_id}}) do
    case TextVecRepVyakyarth.get_embedding(label) do
      {:ok, embedding} ->
        # Create a new vector store entry
        %TextVecStoreVyakyarth{}
        |> TextVecStoreVyakyarth.changeset(%{
          embedding: embedding,
          crowdsourced_slur_id: slur_id
        })
        |> Repo.insert()

      {:error, reason} ->
        {:error, "Failed to process text: #{reason}"}
    end
  end
end
