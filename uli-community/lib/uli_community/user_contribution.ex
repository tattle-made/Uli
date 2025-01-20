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
end
