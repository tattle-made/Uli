defmodule UliCommunity.UserContributionFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `UliCommunity.UserContribution` context.
  """

  def crowdsourced_slur_fixture(attrs \\ %{}) do
    # Create a user to associate with the slur
    user = UliCommunity.AccountsFixtures.user_fixture()

    # Valid attributes required by the schema
    valid_attrs = %{
      appropriated: true,
      appropriation_context: true,
      casual: true,
      label: "some label",
      level_of_severity: :medium,
      meaning: "some meaning",
      categories: [:gendered],
      contributor_user_id: user.id,
      source: :plugin
    }

    # Merge any custom overrides from test
    {:ok, crowdsourced_slur} =
      attrs
      |> Enum.into(valid_attrs)
      |> UliCommunity.UserContribution.create_crowdsourced_slur()

    crowdsourced_slur
  end
end
