defmodule UliCommunityWeb.CrowdsourceContributionsLive do
  require Logger
  alias UliCommunity.PublicDataset
  use UliCommunityWeb, :live_view
  import UliCommunityWeb.CoreComponents
  alias UliCommunityWeb.CrowdsourceContributionsSearchParams

  alias UliCommunity.UserContribution

  @impl Phoenix.LiveView
  def mount(_params, _session, socket) do
    # IO.inspect(slurs_metadata_list, label: "LIST OF SLURS METADATA: ")

    if connected?(socket) do
      Phoenix.PubSub.subscribe(UliCommunity.PubSub, "crowdsourced_slurs")
    end

    user_role = socket.assigns.current_user.role

    {:ok,
     assign(socket,
       slurs_metadata_list: [],
       selected_slur: nil,
       slur_form: to_form(%{}, as: "slur_form"),
       slur_already_added?: false,
       approve_type: "only-slur",
       already_present_metadata_freq: 0,
       user_role: user_role,
       search_params: [],
       query_count: 0,
       advanced_search: false,
       vector_search_loading: false
     )}
  end

  @doc """
    feed : :common, :my_feed
    sort: :newest, :oldest, :repetition_count
  """
  @impl Phoenix.LiveView
  def handle_params(params, _uri, socket) do
    search_params = CrowdsourceContributionsSearchParams.params_to_keyword_list(params)

    if Keyword.get(search_params, :advanced_search) do
      # Skip fetching anything vector search will populate list
      {:noreply,
       socket
       |> assign(:search_params, search_params)
       |> assign(:slurs_metadata_list, [])
       |> assign(:advanced_search, true)
       |> assign(:query_count, 0)}
    else
      {count, results} = UserContribution.list_crowdsourced_slurs_with_filters(search_params)

      {:noreply,
       socket
       |> assign(:search_params, search_params)
       |> assign(:query_count, count)
       |> assign(:slurs_metadata_list, results)
       |> assign(:advanced_search, false)}
    end
  end

  @impl Phoenix.LiveView
  def handle_info({:new_slur, slur}, socket) do
    {:noreply,
     assign(socket, slurs_metadata_list: [slur | socket.assigns.slurs_metadata_list])
     |> put_flash(:info, "New Contribution Added!")}
  end

  def handle_event("change-search", value, socket) do
    search_params = socket.assigns.search_params

    new_search_params =
      case value do
        %{"name" => "search", "value" => search_value} ->
          Keyword.put(search_params, :search, search_value)

        %{"name" => _name, "value" => _val} ->
          CrowdsourceContributionsSearchParams.update_search_param(search_params, value)

        _ ->
          search_params
      end

    {:noreply,
     socket
     |> assign(:search_params, new_search_params)
     |> push_navigate(
       to:
         "/crowdsource-contributions?#{CrowdsourceContributionsSearchParams.search_param_string(new_search_params)}"
     )}
  end

  def handle_event("toggle-advanced-search", params, socket) do
    {:noreply,
     assign(socket,
       advanced_search: Map.has_key?(params, "advanced_search"),
       vector_search_loading: false
     )}
  end

  def handle_event("search", %{"search" => search_value}, socket) do
    search_params = Keyword.put(socket.assigns.search_params, :search, search_value)

    if socket.assigns.advanced_search do
      send(self(), {:vector_search, search_value})

      {:noreply,
       socket
       |> assign(:vector_search_loading, true)
       |> assign(:search_params, search_params)}
    else
      {:noreply,
       socket
       |> assign(:search_params, search_params)
       |> push_navigate(
         to:
           "/crowdsource-contributions?" <>
             UliCommunityWeb.CrowdsourceContributionsSearchParams.search_param_string(
               search_params
             )
       )}
    end
  end

  def handle_info({:vector_search, search_value}, socket) do
    results = UliCommunity.MediaProcessing.VectorSearch.search_similar_slurs(search_value)
    {:noreply, assign(socket, slurs_metadata_list: results, vector_search_loading: false)}
  end

  def handle_event("open-add-slur-modal", %{"slur" => slur}, socket) do
    # IO.inspect(slur, label: "Selected Slur: ")

    slur_label = String.downcase(slur["label"])

    {:ok, already_added_metadata} = PublicDataset.get_plugin_slur_metadata_by_label(slur_label)

    # IO.inspect(already_added_metadata, label: "ALREADY ADDED METADATA")

    socket =
      case PublicDataset.get_plugin_slurs_by_label(slur_label) do
        {:ok, nil} ->
          assign(socket, slur_already_added?: false)

        {:ok, _slur} ->
          assign(socket, slur_already_added?: true)
      end

    socket =
      assign(socket,
        selected_slur: slur,
        slur_form: to_form(slur),
        already_present_metadata_freq: length(already_added_metadata)
      )

    # IO.inspect(socket, label: "modified socket: ")
    {:noreply, socket}
  end

  def handle_event("add-only-slur", params, socket) do
    slur_label = String.downcase(params["label"])
    lang = params["language"]
    default_batch = 1

    plugin_slur_params = %{label: slur_label, language: lang, batch: default_batch}

    case PublicDataset.create_plugin_slur(plugin_slur_params) do
      {:ok, _plugin_slur} ->
        {:noreply,
         socket
         |> reset_form()
         |> put_flash(:info, "Slur created successfully!")}

      {:error, changeset} ->
        Logger.error("Error while adding Slur: ", changeset)

        {:noreply,
         socket
         |> reset_form()
         |> put_flash(:error, "Failed to create slur. Please check the input.")}
    end
  end

  def handle_event("add-slur-metadata", params, socket) do
    IO.inspect(params, label: "PAYLOAD FROM THE FORM")

    appropriation_context =
      if params["appropriation_context"] == "" do
        nil
      else
        params["appropriation_context"]
      end

    metadata = %{
      label: params["label"],
      language: params["language"],
      level_of_severity: params["level_of_severity"],
      casual: params["casual"],
      appropriated: params["appropriated"],
      appropriation_context: appropriation_context,
      meaning: params["meaning"],
      batch: 1,
      categories: params["categories"]
    }

    IO.inspect(metadata, label: "METADATA to Add")

    case PublicDataset.create_plugin_slur_metadata(metadata) do
      {:ok, _plugin_slur_metadata} ->
        # {:noreply, socket} = handle_event("close-modal", %{}, socket)
        {:noreply,
         socket
         |> reset_form()
         |> put_flash(:info, "Slur Metadata Added Successfully!")}

      {:error, changeset} ->
        Logger.error("Error while adding Slur Metadata: ", changeset)

        {:noreply,
         socket
         |> reset_form()
         |> put_flash(:error, "Something went wrong. Failed to add Metadata.")}
    end
  end

  def handle_event("update-form-type", form_params, socket) do
    IO.inspect(form_params, label: "INSIDE UPDATE FORM")
    approve_type = form_params["approve_type"]

    socket =
      case approve_type do
        "only-slur" ->
          assign(socket, approve_type: "only-slur")

        _ ->
          assign(socket, approve_type: "slur-metadata")
      end

    {:noreply, socket}
  end

  def handle_event("close-modal", _unsigned_params, socket) do
    IO.puts("INSIDE CLOSE MODAL")
    {:noreply, reset_form(socket)}
  end

  defp reset_form(socket) do
    assign(socket,
      selected_slur: nil,
      approve_type: "only-slur",
      slur_form: %{"approve_type" => "only-slur"}
    )
  end
end
