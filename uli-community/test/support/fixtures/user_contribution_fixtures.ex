defmodule UliCommunity.UserContributionFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `UliCommunity.UserContribution` context.
  """

  @doc """
  Generate a crowdsourced_slur.
  """
  def crowdsourced_slur_fixture(attrs \\ %{}) do
    {:ok, crowdsourced_slur} =
      attrs
      |> Enum.into(%{
        appropriated: true,
        appropriation_context: true,
        casual: true,
        category: ["option1", "option2"],
        label: "some label",
        level_of_severity: "some level_of_severity",
        meaning: "some meaning"
      })
      |> UliCommunity.UserContribution.create_crowdsourced_slur()

    crowdsourced_slur
  end
end
