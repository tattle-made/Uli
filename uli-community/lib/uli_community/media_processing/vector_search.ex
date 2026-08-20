defmodule UliCommunity.MediaProcessing.VectorSearch do
  import Ecto.Query
  alias UliCommunity.Repo
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth

  # Returns top N most similar slurs to the query string
  def search_similar_slurs(query, top_n \\ 10) do
    with {:ok, embedding} <- TextVecRepVyakyarth.get_embedding(query) do
      # Rank base entries (distinct, normalized) by similarity
      ranked_labels =
        from v in TextVecStoreVyakyarth,
          join: s in CrowdsourcedSlur,
          on: v.crowdsourced_slur_id == s.id,
          select: %{
            normalized_label: fragment("LOWER(TRIM(?))", s.label),
            distance: fragment("? <=> ?", v.embedding, ^embedding)
          },
          order_by: fragment("? <=> ?", v.embedding, ^embedding),
          limit: ^top_n

      # Fetch all variants, ordered by the rank of their label
      all_variants_query =
        from s in CrowdsourcedSlur,
          join: r in subquery(ranked_labels),
          on: fragment("LOWER(TRIM(?))", s.label) == r.normalized_label,
          order_by: r.distance,
          select: s

      Repo.all(all_variants_query)
    end
  end
end
