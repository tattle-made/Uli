defmodule UliCommunityWeb.CrowdsourceContributionsSearchParamsTest do
  use ExUnit.Case, async: true
  alias UliCommunityWeb.CrowdsourceContributionsSearchParams, as: Params

  # ------------------------------------------------------------------
  # 1. params_to_keyword_list/1  – raw query map ➜ keyword list
  # ------------------------------------------------------------------
  test "params_to_keyword_list/1 parses values and keeps defaults" do
    result =
      Params.params_to_keyword_list(%{
        "level_of_severity" => "high",
        "page_num" => "2",
        "categories" => "caste"
      })

    assert Keyword.get(result, :level_of_severity) == "high"
    assert Keyword.get(result, :page_num) == 2
    assert Keyword.get(result, :categories) == ["caste"]
  end

  # ------------------------------------------------------------------
  # 2. update_search_param/2  – ek field update karta hai
  # ------------------------------------------------------------------
  test "update_search_param/2 changes level_of_severity" do
    params = [page_num: 1, level_of_severity: "low"]

    updated =
      Params.update_search_param(
        params,
        %{"name" => "level_of_severity", "value" => "high"}
      )

    assert Keyword.get(updated, :level_of_severity) == "high"
    # बाकी वही रहता है
    assert Keyword.get(updated, :page_num) == 1
  end

  # ------------------------------------------------------------------
  # 3. search_param_string/1 – keyword list ➜ query string
  # ------------------------------------------------------------------
  test "search_param_string/1 builds query string" do
    qs = Params.search_param_string(level_of_severity: "low", page_num: 2)

    assert qs =~ "level_of_severity=low"
    assert qs =~ "page_num=2"
  end

  # ------------------------------------------------------------------
  # 4. pagination helpers – next / previous page
  # ------------------------------------------------------------------
  test "pagination helpers respect bounds" do
    assert Params.search_param_string_for_next_page(page_num: 1) =~ "page_num=2"
    assert Params.search_param_string_for_previous_page(page_num: 1) =~ "page_num=1"
  end

  # ------------------------------------------------------------------------------
  # Pagination helpers – build next / previous page query-strings
  # ------------------------------------------------------------------------------
  def search_param_string_for_next_page(params) do
    current = Keyword.get(params, :page_num, 1)

    params
    |> Keyword.put(:page_num, current + 1)
    |> URI.encode_query()
  end

  def search_param_string_for_previous_page(params) do
    current = Keyword.get(params, :page_num, 1)

    params
    |> Keyword.put(:page_num, max(current - 1, 1))
    |> URI.encode_query()
  end
end
