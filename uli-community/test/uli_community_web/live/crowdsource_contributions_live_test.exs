defmodule UliCommunityWeb.CrowdsourceContributionsLiveTest do
  use ExUnit.Case, async: true

  alias UliCommunityWeb.CrowdsourceContributionsLive

  defp click_category(search_params, payload) do
    socket = %Phoenix.LiveView.Socket{assigns: %{__changed__: %{}, search_params: search_params}}

    {:noreply, socket} =
      CrowdsourceContributionsLive.handle_event("change-search", payload, socket)

    Keyword.get(socket.assigns.search_params, :categories)
  end

  test "ticking a category adds it to the search" do
    payload = %{"name" => "categories", "category" => "gendered", "value" => "gendered"}
    assert click_category([], payload) == ["gendered"]
  end

  test "unticking a category removes it, although LiveView sends no value key" do
    payload = %{"name" => "categories", "category" => "gendered"}
    assert click_category([categories: ["gendered", "caste"]], payload) == ["caste"]
  end
end
