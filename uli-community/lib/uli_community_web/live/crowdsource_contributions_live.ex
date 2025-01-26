defmodule UliCommunityWeb.CrowdsourceContributionsLive do
  use UliCommunityWeb, :live_view
  import UliCommunityWeb.CoreComponents

  alias UliCommunity.UserContribution
  def mount(_params, _session, socket) do
    slurs_metadata_list = UserContribution.list_crowdsourced_slurs()

    IO.inspect(slurs_metadata_list, label: "LIST OF SLURS METADATA: ")

    {:ok,
     assign(socket,
       slurs_metadata_list: slurs_metadata_list
     )}
  end

  def render(assigns) do
    ~H"""
    <.header class="text-center">
      Crowdsource Contributions
    </.header>

    <.table id="crowdsource-slur-metadata-table" rows={@slurs_metadata_list}>
      <:col :let={slur} label="Slur's Label"><%= slur.label %></:col>
      <:col :let={slur} label="Level of Severity"><%= slur.level_of_severity || "-" %></:col>
      <:col :let={slur} label="Is Casual?"><%= slur.casual || "-" %></:col>
      <:col :let={slur} label="Is Appropriated?"><%= slur.appropriated || "-" %></:col>
      <:col :let={slur} label="Appropriation Context"><%= slur.appropriation_context || "-"%></:col>
      <:col :let={slur} label="Meaning"><%= slur.meaning || "-" %></:col>
      <:col :let={slur} label="Categories"><%= Enum.join(slur.categories || ["-"], ",") %></:col>

    </.table>

    """
  end
end
