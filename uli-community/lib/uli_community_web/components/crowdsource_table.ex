defmodule UliCommunityWeb.CrowdsourceTable do
  use Phoenix.Component

  import UliCommunityWeb.CoreComponents
  alias Phoenix.LiveView.JS

  def slur_metadata_table(assigns) do
    ~H"""
    <.table id="crowdsource-slur-metadata-table" rows={@slurs_metadata_list} class="w-full">
      <:col :let={slur} label="Slur's Label" class="text-center"><%= slur.label %></:col>
      <:col :let={slur} label="Level of Severity" class="text-center"><%= slur.level_of_severity || "-" %></:col>
      <:col :let={slur} label="Is Casual?" class="text-center">
        <%= if is_nil(slur.casual), do: "-", else: (slur.casual == true && "Yes") || "No" %>
      </:col>
      <%= # Fixing the problematic label with a string version %>
      <:col :let={slur} label={String.replace("Is Appropriated?", "?", "")} class="text-center">
        <%= if is_nil(slur.appropriated), do: "-", else: (slur.appropriated == true && "Yes") || "No" %>
      </:col>
      <:col :let={slur} label="Appropriation Context" class="text-center">
        <%= if is_nil(slur.appropriation_context),
          do: "-",
          else: (slur.appropriation_context == true && "Yes") || "No" %>
      </:col>
      <:col :let={slur} label="Meaning" class="text-center"><%= slur.meaning || "-" %></:col>
      <:col :let={slur} label="Categories" class="text-center">
        <%= Enum.join(format_categories(slur.categories || ["-"]), ", ") %>
      </:col>
      <%= # Apply hover on the row element %>
      <:row :let={slur}>
        <div class="hover:bg-blue-200">
          <.button phx-click={
            JS.push("open-add-slur-modal", value: %{slur: slur}) |> show_modal("add-slur-modal")
          }>
            Add
          </.button>
        </div>
      </:row>
    </.table>
    """
  end

  defp format_categories(categories) do
    Enum.map(categories, fn category ->
      category
      |> to_string()
      |> String.replace("_", " ")
      |> String.split(" ")
      |> Enum.map(&String.capitalize(&1))
      |> Enum.join(" ")
    end)
  end
end
