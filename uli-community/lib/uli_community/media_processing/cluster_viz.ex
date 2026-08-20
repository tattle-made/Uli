defmodule UliCommunity.MediaProcessing.ClusterViz do
  import Ecto.Query
  alias UliCommunity.Repo
  alias UliCommunity.MediaProcessing.Store.TextVecStoreVyakyarth
  alias UliCommunity.UserContribution.CrowdsourcedSlur

  # Returns clusters as a list of %{cluster: cluster_id, words: [label, ...]},
  # largest clusters first. Vectors without a cluster assignment yet are
  # grouped together under "unclustered" and sorted last.
  def list_clusters do
    query =
      from v in TextVecStoreVyakyarth,
        join: s in CrowdsourcedSlur,
        on: v.crowdsourced_slur_id == s.id,
        select: %{cluster: v.cluster, label: s.label}

    Repo.all(query)
    |> Enum.group_by(fn %{cluster: cluster} -> cluster || "unclustered" end, & &1.label)
    |> Enum.map(fn {cluster, labels} ->
      %{cluster: cluster, words: labels |> Enum.uniq() |> Enum.sort()}
    end)
    |> Enum.sort_by(fn %{cluster: cluster, words: words} ->
      {cluster == "unclustered", -length(words)}
    end)
  end
end
