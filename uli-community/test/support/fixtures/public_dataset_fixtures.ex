defmodule UliCommunity.PublicDatasetFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `UliCommunity.PublicDataset` context.
  """

  @doc """
  Generate a plugin_slur_metadata.
  """
  def plugin_slur_metadata_fixture(attrs \\ %{}) do
    {:ok, plugin_slur_metadata} =
      attrs
      |> Enum.into(%{
        appropriated: true,
        appropriation_context: true,
        batch: 42,
        casual: true,
        categories: ["gendered", "sexualized"],
        label: "some label",
        language: "some language",
        level_of_severity: "low",
        meaning: "some meaning"
      })
      |> UliCommunity.PublicDataset.create_plugin_slur_metadata()

    plugin_slur_metadata
  end

  @doc """
  Generate a plugin_slur.
  """
  def plugin_slur_fixture(attrs \\ %{}) do
    {:ok, plugin_slur} =
      attrs
      |> Enum.into(%{
        batch: 42,
        label: "some label",
        language: "some language"
      })
      |> UliCommunity.PublicDataset.create_plugin_slur()

    plugin_slur
  end
end
