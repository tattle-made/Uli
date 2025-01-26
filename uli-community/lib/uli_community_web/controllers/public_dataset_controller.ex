defmodule UliCommunityWeb.PublicDatasetController do
  alias UliCommunity.PublicDataset
  use UliCommunityWeb, :controller

  def get_slurs_by_batch(conn, %{"batch" => batch}) do
    {:ok, slurs} = PublicDataset.get_plugin_slurs_by_batch(batch)

    json(conn, %{message: "success", slurs: slurs})
  end


  def get_slursmetadata_by_batch(conn, %{"batch" => batch}) do
    {:ok, slurs_metadata} = PublicDataset.get_plugin_slur_metadata_by_batch(batch)

    json(conn, %{message: "success", slurs_metadata: slurs_metadata})
  end
end
