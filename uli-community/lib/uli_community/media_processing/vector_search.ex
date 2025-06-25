defmodule UliCommunity.MediaProcessing.VectorSearch do
  import Ecto.Query
  alias UliCommunity.Repo
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth

  # Returns top N most similar slurs to the query string
  def search_similar_slurs(query, top_n \\ 25) do
    with {:ok, embedding} <- TextVecRepVyakyarth.get_embedding(query) do
      # Fetch top N similar base entries (distinct, normalized)
      base_query =
        from v in TextVecStoreVyakyarth,
          join: s in CrowdsourcedSlur,
          on: v.crowdsourced_slur_id == s.id,
          order_by: fragment("? <-> ?", v.embedding, ^embedding),
          limit: ^top_n,
          select: fragment("LOWER(TRIM(?))", s.label)

      normalized_labels = Repo.all(base_query)

      # Fetch all variants from CrowdsourcedSlur
      all_variants_query =
        from s in CrowdsourcedSlur,
          where: fragment("LOWER(TRIM(?))", s.label) in ^normalized_labels,
          select: s

      Repo.all(all_variants_query)
    end
  end
end
