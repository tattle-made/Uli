defmodule UliCommunity.MediaProcessing.VectorSearch do
  import Ecto.Query
  alias UliCommunity.Repo
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth

  # Returns top N most similar slurs to the query string
  def search_similar_slurs(query, top_n \\ 10) do
    with {:ok, embedding} <- TextVecRepVyakyarth.get_embedding(query) do
      # Rank base entries by similarity, collapsing duplicate embeddings
      # that can accumulate for the same normalized label over time
      ranked_labels =
        from v in TextVecStoreVyakyarth,
          join: s in CrowdsourcedSlur,
          on: v.crowdsourced_slur_id == s.id,
          # bucket rows that share a label instead of one row per embedding
          group_by: fragment("LOWER(TRIM(?))", s.label),
          select: %{
            normalized_label: fragment("LOWER(TRIM(?))", s.label),
            # each bucket can hold >1 distance, keep the closest one
            distance: min(fragment("? <=> ?", v.embedding, ^embedding))
          },
          # must sort by the same aggregate used above, not the raw column
          order_by: min(fragment("? <=> ?", v.embedding, ^embedding)),
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
