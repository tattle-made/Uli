defmodule UliCommunity.PublicDataset do
  @moduledoc """
  The PublicDataset context.
  """

  import Ecto.Query, warn: false
  alias UliCommunity.Repo

  alias UliCommunity.PublicDataset.PluginSlurMetadata

  @doc """
  Returns the list of plugin_slur_metadata.

  ## Examples

      iex> list_plugin_slur_metadata()
      [%PluginSlurMetadata{}, ...]

  """
  def list_plugin_slur_metadata do
    Repo.all(PluginSlurMetadata)
  end

  @doc """
  Gets a single plugin_slur_metadata.

  Raises `Ecto.NoResultsError` if the Plugin slur metadata does not exist.

  ## Examples

      iex> get_plugin_slur_metadata!(123)
      %PluginSlurMetadata{}

      iex> get_plugin_slur_metadata!(456)
      ** (Ecto.NoResultsError)

  """
  def get_plugin_slur_metadata!(id), do: Repo.get!(PluginSlurMetadata, id)

  @doc """
  Creates a plugin_slur_metadata.

  ## Examples

      iex> create_plugin_slur_metadata(%{field: value})
      {:ok, %PluginSlurMetadata{}}

      iex> create_plugin_slur_metadata(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_plugin_slur_metadata(attrs \\ %{}) do
    %PluginSlurMetadata{}
    |> PluginSlurMetadata.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a plugin_slur_metadata.

  ## Examples

      iex> update_plugin_slur_metadata(plugin_slur_metadata, %{field: new_value})
      {:ok, %PluginSlurMetadata{}}

      iex> update_plugin_slur_metadata(plugin_slur_metadata, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_plugin_slur_metadata(%PluginSlurMetadata{} = plugin_slur_metadata, attrs) do
    plugin_slur_metadata
    |> PluginSlurMetadata.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a plugin_slur_metadata.

  ## Examples

      iex> delete_plugin_slur_metadata(plugin_slur_metadata)
      {:ok, %PluginSlurMetadata{}}

      iex> delete_plugin_slur_metadata(plugin_slur_metadata)
      {:error, %Ecto.Changeset{}}

  """
  def delete_plugin_slur_metadata(%PluginSlurMetadata{} = plugin_slur_metadata) do
    Repo.delete(plugin_slur_metadata)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking plugin_slur_metadata changes.

  ## Examples

      iex> change_plugin_slur_metadata(plugin_slur_metadata)
      %Ecto.Changeset{data: %PluginSlurMetadata{}}

  """
  def change_plugin_slur_metadata(%PluginSlurMetadata{} = plugin_slur_metadata, attrs \\ %{}) do
    PluginSlurMetadata.changeset(plugin_slur_metadata, attrs)
  end

  def get_plugin_slur_metadata_by_batch(batch) do
    slurs = Repo.all(from s in PluginSlurMetadata, where: s.batch == ^batch)

    {:ok, slurs}
  end

  def get_plugin_slur_metadata_by_label(label) do
    slurs = Repo.all(from s in PluginSlurMetadata, where: s.label == ^label)

    {:ok, slurs}
  end

  alias UliCommunity.PublicDataset.PluginSlur

  @doc """
  Returns the list of plugin_slurs.

  ## Examples

      iex> list_plugin_slurs()
      [%PluginSlur{}, ...]

  """
  def list_plugin_slurs do
    Repo.all(PluginSlur)
  end

  @doc """
  Gets a single plugin_slur.

  Raises `Ecto.NoResultsError` if the Plugin slur does not exist.

  ## Examples

      iex> get_plugin_slur!(123)
      %PluginSlur{}

      iex> get_plugin_slur!(456)
      ** (Ecto.NoResultsError)

  """
  def get_plugin_slur!(id), do: Repo.get!(PluginSlur, id)

  @doc """
  Creates a plugin_slur.

  ## Examples

      iex> create_plugin_slur(%{field: value})
      {:ok, %PluginSlur{}}

      iex> create_plugin_slur(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_plugin_slur(attrs \\ %{}) do
    %PluginSlur{}
    |> PluginSlur.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a plugin_slur.

  ## Examples

      iex> update_plugin_slur(plugin_slur, %{field: new_value})
      {:ok, %PluginSlur{}}

      iex> update_plugin_slur(plugin_slur, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_plugin_slur(%PluginSlur{} = plugin_slur, attrs) do
    plugin_slur
    |> PluginSlur.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a plugin_slur.

  ## Examples

      iex> delete_plugin_slur(plugin_slur)
      {:ok, %PluginSlur{}}

      iex> delete_plugin_slur(plugin_slur)
      {:error, %Ecto.Changeset{}}

  """
  def delete_plugin_slur(%PluginSlur{} = plugin_slur) do
    Repo.delete(plugin_slur)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking plugin_slur changes.

  ## Examples

      iex> change_plugin_slur(plugin_slur)
      %Ecto.Changeset{data: %PluginSlur{}}

  """
  def change_plugin_slur(%PluginSlur{} = plugin_slur, attrs \\ %{}) do
    PluginSlur.changeset(plugin_slur, attrs)
  end

  def get_plugin_slurs_by_batch(batch) do
    slurs = Repo.all(from s in PluginSlur, where: s.batch == ^batch)

    {:ok, slurs}
  end

  def get_plugin_slurs_by_label(label) do
    slur = Repo.get_by(PluginSlur, label: label)
    {:ok, slur}
  end

end
