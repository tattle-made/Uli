defmodule UliCommunityWeb.ClusterVizLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.MediaProcessing.ClusterViz

  @impl true
  def mount(_params, _session, socket) do
    clusters = ClusterViz.list_clusters()
    word_count = Enum.reduce(clusters, 0, fn c, acc -> acc + length(c.words) end)

    {:ok,
     assign(socket,
       clusters: clusters,
       cluster_count: length(clusters),
       word_count: word_count,
       view: "bubbles"
     )}
  end

  @impl true
  def handle_event("set-view", %{"view" => view}, socket) do
    {:noreply, assign(socket, view: view)}
  end
end
