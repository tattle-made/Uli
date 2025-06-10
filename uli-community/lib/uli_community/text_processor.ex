defmodule UliCommunity.TextProcessor do
  alias UliCommunity.Workers.TextEmbeddingWorker
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.Repo
  import Ecto.Query

  @doc """
  Enqueues a single text for embedding processing.
  """
  def enqueue_text(label, crowdsourced_slur_id) do
    %{label: label, crowdsourced_slur_id: crowdsourced_slur_id}
    |> TextEmbeddingWorker.new()
    |> Oban.insert()
  end

  @doc """
  Enqueues all unprocessed words from crowdsourced_slurs table.
  A word is considered unprocessed if it doesn't have a corresponding embedding i.e. an entry in text_vec_store_vyakyarth table
  """
  def enqueue_unprocessed_texts do
    # Find all crowdsourced slurs that don't have vector embeddings yet
    unprocessed_slurs_query =
      from s in CrowdsourcedSlur,
        left_join: v in TextVecStoreVyakyarth,
        on: v.crowdsourced_slur_id == s.id,
        where: is_nil(v.id),
        select: {s.id, s.label}

    # Get all unprocessed slurs
    unprocessed_slurs = Repo.all(unprocessed_slurs_query)

    # Enqueue each unprocessed slur
    Enum.each(unprocessed_slurs, fn {slur_id, label} ->
      enqueue_text(label, slur_id)
    end)

    {:ok, length(unprocessed_slurs)}
  end
end
