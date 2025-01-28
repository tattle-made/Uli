defmodule UliCommunityWeb.PluginMetadataSlurLive do
  use UliCommunityWeb, :live_view
alias UliCommunity.PublicDataset
  @impl Phoenix.LiveView
  def mount(params, _session, socket) do
    IO.inspect(params, label: "VIEW METADATA")
    slur_label = params["slur_label"]
    {:ok, all_slur_metadata} = PublicDataset.get_plugin_slur_metadata_by_label(slur_label)
    {:ok, assign(socket, slur_label: slur_label, all_slur_metadata: all_slur_metadata)}
  end




end
