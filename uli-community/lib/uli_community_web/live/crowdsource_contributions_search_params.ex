defmodule UliCommunityWeb.CrowdsourceContributionsSearchParams do
  @allowed_filter_keys [
    "level_of_severity",
    "casual",
    "appropriated",
    "source",
    "page_num",
    "sort",
    "from",
    "to",
    "categories",
    "search"
  ]

  def params_to_keyword_list(params) do
    default_filter_params = [
      page_num: "1",
      sort: "newest",
      level_of_severity: "all",
      casual: "all",
      appropriated: "all",
      source: "all",
      from: "2024-01-01",
      to: Date.to_iso8601(Date.utc_today()),
      categories: [],
      search: ""
    ]

    {:ok, params} =
      Enum.filter(params, fn {key, _value} -> Enum.member?(@allowed_filter_keys, key) end)
      |> Enum.filter(fn {_key, value} -> value && value != "" end)
      |> Enum.map(fn {key, value} -> {String.to_existing_atom(key), value} end)
      |> Keyword.validate(default_filter_params)

    params |> convert_page_num_to_integer |> convert_categories_to_list
  end

  defp convert_page_num_to_integer(params_keyword) do
    Keyword.update(params_keyword, :page_num, 1, fn value -> String.to_integer(value) end)
  end

  defp convert_categories_to_list(params) do
    Keyword.update(params, :categories, [], fn val ->
      case val do
        val when is_list(val) ->
          val

        val when is_binary(val) ->
          if val == "" do
            []
          else
            String.split(val, ",")
          end

        _ ->
          []
      end
    end)
  end

  def update_search_param(search_params, value) do
    case value["name"] do
      "sort-by" ->
        Keyword.put(search_params, :sort, value["value"])

      "date-range" ->
        case value["type"] do
          "start" -> Keyword.put(search_params, :from, value["value"])
          "end" -> Keyword.put(search_params, :to, value["value"])
        end

      "level_of_severity" ->
        Keyword.put(search_params, :level_of_severity, value["value"])

      "casual" ->
        Keyword.put(search_params, :casual, value["value"])

      "appropriated" ->
        Keyword.put(search_params, :appropriated, value["value"])

      "source" ->
        Keyword.put(search_params, :source, value["value"])

      "categories" ->
        current_categories = Keyword.get(search_params, :categories, [])

        new_categories =
          if value["value"] in current_categories do
            List.delete(current_categories, value["value"])
          else
            [value["value"] | current_categories]
          end

        Keyword.put(search_params, :categories, new_categories)

      "search" ->
        Keyword.put(search_params, :search, value["value"])

      _ ->
        search_params
    end
  end

  def search_param_string(search_params) do
    search_params
    |> Enum.reduce("", fn {key, value}, acc ->
      param_value =
        case value do
          value when is_list(value) -> Enum.join(value, ",")
          value -> to_string(value)
        end

      "#{acc}&#{key}=#{param_value}"
    end)
    |> String.slice(1..-1//1)
  end

  def search_param_string_for_next_page(search_params) do
    search_params
    |> Keyword.update(:page_num, 1, fn page_num -> page_num + 1 end)
    |> search_param_string()
  end

  def search_param_string_for_previous_page(search_params) do
    search_params
    |> Keyword.update(:page_num, 1, fn page_num -> if page_num == 1, do: 1, else: page_num - 1 end)
    |> search_param_string()
  end
end
