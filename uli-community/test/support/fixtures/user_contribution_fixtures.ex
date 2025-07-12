defmodule UliCommunity.UserContributionFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `UliCommunity.UserContribution` context.
  """

  alias UliCommunity.UserContribution
  alias UliCommunity.AccountsFixtures

  def crowdsourced_slur_fixture(attrs \\ %{}) do
    attrs =
      case Map.get(attrs, :contributor_user_id) do
        nil ->
          user = AccountsFixtures.user_fixture()
          Map.put(attrs, :contributor_user_id, user.id)

        _ ->
          attrs
      end

    valid_attrs = %{
      appropriated: false,
      appropriation_context: nil,
      casual: true,
      label: "test-slur",
      level_of_severity: :medium,
      meaning: "some meaning",
      categories: [:other],
      source: :plugin
    }

    {:ok, crowdsourced_slur} =
      attrs
      |> Enum.into(valid_attrs)
      |> UserContribution.create_crowdsourced_slur()

    crowdsourced_slur
  end
end
