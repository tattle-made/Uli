defmodule UliCommunity.Workers.VideoEmbeddingWorker do
  use Oban.Worker,
    queue: :index,
    max_attempts: 3

  alias UliCommunity.MediaProcessing.VidVecRepClip
  alias UliCommunity.MediaProcessing.Store.VectorStore
  alias UliCommunity.Repo

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"file_path" => file_path}}) do
    case VidVecRepClip.get_embedding(file_path) do
      {:ok, embedding} ->
        # Create a new vector store entry
        %VectorStore{}
        |> VectorStore.changeset(%{
          embedding: embedding,
          media_type: "video"
        })
        |> Repo.insert()

      {:error, reason} ->
        {:error, "Failed to process video: #{reason}"}
    end
  end
end
