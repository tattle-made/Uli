defmodule UliCommunityWeb.CrowdsourceContributionsLive do
  use UliCommunityWeb, :live_view
  import UliCommunityWeb.CoreComponents
  alias UliCommunity.PublicDataset.PluginSlurMetadata

  alias UliCommunity.UserContribution
  def mount(_params, _session, socket) do
    slurs_metadata_list = UserContribution.list_crowdsourced_slurs()

    # IO.inspect(slurs_metadata_list, label: "LIST OF SLURS METADATA: ")

    form = to_form(%{}, as: "slur_form")

    {:ok,
     assign(socket,
       slurs_metadata_list: slurs_metadata_list,
       selected_slur: nil,
       slur_form: form
      #  temporary_assigns: [slur_form: form]
     )}
  end

  def handle_event("open-add-slur-modal", %{"slur"=> slur}, socket) do

    IO.inspect(slur, label: "Selected Slur: ")
    socket = assign(socket, selected_slur: slur, slur_form: to_form(slur) )
    # IO.inspect(socket, label: "modified socket: ")
    {:noreply, socket}
  end

  @impl Phoenix.LiveView
  def handle_event("close-modal", _unsigned_params, socket) do


    {:noreply, assign(socket, selected_slur: nil)}
  end

  @impl Phoenix.LiveView
  def handle_event("submit-slur", unsigned_params, socket) do

    IO.inspect(unsigned_params, label: "PAYLOAD FROM THE FORM")

    IO.inspect(socket, label: "SOCKET AFTER SUBMITTING THE FORM")

    {:noreply, socket}
  end




  # def render(assigns) do
  # #  render("crowdsource_contributions.html", assigns)
  # #  Phoenix.View.render(UliCommunityWeb.PageView, "crowdsource_contributions.html", assigns)
  #   # ~H"""
  #   # <.header class="text-center">
  #   #   Crowdsource Contributions
  #   # </.header>

  #   # <.table id="crowdsource-slur-metadata-table" rows={@slurs_metadata_list}>
  #   #   <:col :let={slur} label="Slur's Label"><%= slur.label %></:col>
  #   #   <:col :let={slur} label="Level of Severity"><%= slur.level_of_severity || "-" %></:col>
  #   #   <:col :let={slur} label="Is Casual?"><%= slur.casual || "-" %></:col>
  #   #   <:col :let={slur} label="Is Appropriated?"><%= slur.appropriated || "-" %></:col>
  #   #   <:col :let={slur} label="Appropriation Context"><%= slur.appropriation_context || "-"%></:col>
  #   #   <:col :let={slur} label="Meaning"><%= slur.meaning || "-" %></:col>
  #   #   <:col :let={slur} label="Categories"><%= Enum.join(slur.categories || ["-"], ",") %></:col>
  #   #   <:col :let={slur} ><button></button></:col>

  #   # </.table>

  #   # """
  # end
end
