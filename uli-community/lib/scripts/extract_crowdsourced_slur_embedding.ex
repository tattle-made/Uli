defmodule Scripts.ExtractCrowdsourcedSlurEmbedding do
  alias UliCommunity.Workers.TextEmbeddingWorker
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.Repo
  import Ecto.Query
  require Logger

  @doc """
  Enqueues all unprocessed words from crowdsourced_slurs table.
  A word is considered unprocessed if it doesn't have a corresponding embedding i.e. an entry in text_vec_store_vyakyarth table
  """
  def enqueue_unprocessed_texts_batch do
    unprocessed_slurs_query =
      from s in CrowdsourcedSlur,
        left_join: v in TextVecStoreVyakyarth,
        on: v.crowdsourced_slur_id == s.id,
        where: is_nil(v.id),
        group_by: fragment("LOWER(TRIM(?))", s.label),
        select: %{
          id: min(s.id),
          label: fragment("LOWER(TRIM(?))", min(s.label))
        }

    unprocessed_slurs = Repo.all(unprocessed_slurs_query)
    Logger.info("Enqueueing #{length(unprocessed_slurs)} unique unprocessed slurs")

    batch_size = 256

    unprocessed_slurs
    |> Enum.chunk_every(batch_size)
    |> Enum.each(fn batch ->
      %{"items" => batch}
      |> TextEmbeddingWorker.new()
      |> Oban.insert()
    end)

    {:ok, length(unprocessed_slurs)}
  end
end
