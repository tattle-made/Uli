defmodule UliCommunity.UserContribution do
  @moduledoc """
  The UserContribution context.
  """

  import Ecto.Query, warn: false
  alias UliCommunity.Repo

  alias UliCommunity.UserContribution.CrowdsourcedSlur

  @doc """
  Returns the list of crowdsourced_slurs.

  ## Examples

      iex> list_crowdsourced_slurs()
      [%CrowdsourcedSlur{}, ...]

  """
  def list_crowdsourced_slurs do
    Repo.all(CrowdsourcedSlur)
  end

  @doc """
  Returns paginated and filtered list of crowdsourced_slurs.
  """
  def list_crowdsourced_slurs_with_filters(search_params) do
    page_num = Keyword.get(search_params, :page_num, 1)
    per_page = 20
    offset = (page_num - 1) * per_page

    query = build_filtered_query(search_params)

    # Get total count
    count_query = from(s in query, select: count(s.id))
    total_count = Repo.one(count_query)

    # Get paginated results
    results_query =
      query
      |> apply_sorting(search_params)
      |> limit(^per_page)
      |> offset(^offset)

    results = Repo.all(results_query)

    {total_count, results}
  end

  defp build_filtered_query(search_params) do
    CrowdsourcedSlur
    |> filter_by_level_of_severity(search_params)
    |> filter_by_casual(search_params)
    |> filter_by_appropriated(search_params)
    |> filter_by_source(search_params)
    |> filter_by_date_range(search_params)
    |> filter_by_categories(search_params)
  end

  defp apply_sorting(query, search_params) do
    case Keyword.get(search_params, :sort) do
      "oldest" -> order_by(query, [s], asc: s.inserted_at)
      "newest" -> order_by(query, [s], desc: s.inserted_at)
      _ -> order_by(query, [s], desc: s.inserted_at)
    end
  end

  defp filter_by_level_of_severity(query, search_params) do
    case Keyword.get(search_params, :level_of_severity) do
      "all" ->
        query

      level when level in ["low", "medium", "high"] ->
        from(s in query, where: s.level_of_severity == ^String.to_existing_atom(level))

      _ ->
        query
    end
  end

  defp filter_by_casual(query, search_params) do
    case Keyword.get(search_params, :casual) do
      "all" -> query
      "true" -> from(s in query, where: s.casual == true)
      "false" -> from(s in query, where: s.casual == false)
      _ -> query
    end
  end

  defp filter_by_appropriated(query, search_params) do
    case Keyword.get(search_params, :appropriated) do
      "all" -> query
      "true" -> from(s in query, where: s.appropriated == true)
      "false" -> from(s in query, where: s.appropriated == false)
      _ -> query
    end
  end

  defp filter_by_source(query, search_params) do
    case Keyword.get(search_params, :source) do
      "all" ->
        query

      source when source in ["plugin", "experts_2022", "crowdsourcing_exercise"] ->
        from(s in query, where: s.source == ^String.to_existing_atom(source))

      _ ->
        query
    end
  end

  defp filter_by_date_range(query, search_params) do
    from_date = Keyword.get(search_params, :from)
    to_date = Keyword.get(search_params, :to)

    query
    |> maybe_filter_by_date(from_date, to_date)
  end

  defp maybe_filter_by_date(query, nil, nil), do: query

  defp maybe_filter_by_date(query, from_date, nil) do
    case Date.from_iso8601(from_date) do
      {:ok, date} -> from(s in query, where: fragment("DATE(?)", s.inserted_at) >= ^date)
      _ -> query
    end
  end

  defp maybe_filter_by_date(query, nil, to_date) do
    case Date.from_iso8601(to_date) do
      {:ok, date} -> from(s in query, where: fragment("DATE(?)", s.inserted_at) <= ^date)
      _ -> query
    end
  end

  defp maybe_filter_by_date(query, from_date, to_date) do
    case {Date.from_iso8601(from_date), Date.from_iso8601(to_date)} do
      {{:ok, from}, {:ok, to}} ->
        from(s in query,
          where:
            fragment("DATE(?)", s.inserted_at) >= ^from and
              fragment("DATE(?)", s.inserted_at) <= ^to
        )

      _ ->
        query
    end
  end

  defp filter_by_categories(query, search_params) do
    categories = Keyword.get(search_params, :categories, [])

    if Enum.empty?(categories) do
      query
    else
      from(s in query, where: fragment("? && ?", s.categories, ^categories))
    end
  end

  @doc """
  Gets a single crowdsourced_slur.

  Raises `Ecto.NoResultsError` if the Crowdsourced slur does not exist.

  ## Examples

      iex> get_crowdsourced_slur!(123)
      %CrowdsourcedSlur{}

      iex> get_crowdsourced_slur!(456)
      ** (Ecto.NoResultsError)

  """
  def get_crowdsourced_slur!(id), do: Repo.get!(CrowdsourcedSlur, id)

  @doc """
  Creates a crowdsourced_slur.

  ## Examples

      iex> create_crowdsourced_slur(%{field: value})
      {:ok, %CrowdsourcedSlur{}}

      iex> create_crowdsourced_slur(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_crowdsourced_slur(attrs \\ %{}) do
    %CrowdsourcedSlur{}
    |> CrowdsourcedSlur.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, slur} ->
        Phoenix.PubSub.broadcast(UliCommunity.PubSub, "crowdsourced_slurs", {:new_slur, slur})
        {:ok, slur}

      error ->
        error
    end
  end

  def create_crowdsourced_slur_with_label(attrs \\ %{}) do
    %CrowdsourcedSlur{}
    |> CrowdsourcedSlur.changeset_only_label(attrs)
    |> Repo.insert()
  end

  def create_crowdsourced_slur_seed(attrs \\ %{}) do
    %CrowdsourcedSlur{}
    |> CrowdsourcedSlur.changeset_seed(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a crowdsourced_slur.

  ## Examples

      iex> update_crowdsourced_slur(crowdsourced_slur, %{field: new_value})
      {:ok, %CrowdsourcedSlur{}}

      iex> update_crowdsourced_slur(crowdsourced_slur, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_crowdsourced_slur(%CrowdsourcedSlur{} = crowdsourced_slur, attrs) do
    crowdsourced_slur
    |> CrowdsourcedSlur.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a crowdsourced_slur.

  ## Examples

      iex> delete_crowdsourced_slur(crowdsourced_slur)
      {:ok, %CrowdsourcedSlur{}}

      iex> delete_crowdsourced_slur(crowdsourced_slur)
      {:error, %Ecto.Changeset{}}

  """
  def delete_crowdsourced_slur(%CrowdsourcedSlur{} = crowdsourced_slur) do
    Repo.delete(crowdsourced_slur)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking crowdsourced_slur changes.

  ## Examples

      iex> change_crowdsourced_slur(crowdsourced_slur)
      %Ecto.Changeset{data: %CrowdsourcedSlur{}}

  """
  def change_crowdsourced_slur(%CrowdsourcedSlur{} = crowdsourced_slur, attrs \\ %{}) do
    CrowdsourcedSlur.changeset(crowdsourced_slur, attrs)
  end

  def get_crowdsourced_slur_by_user(contributor_user_id) do
    slurs =
      Repo.all(from(s in CrowdsourcedSlur, where: s.contributor_user_id == ^contributor_user_id))

    {:ok, slurs}
  end
end
