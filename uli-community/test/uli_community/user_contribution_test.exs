defmodule UliCommunity.UserContributionTest do
  use UliCommunity.DataCase

  alias UliCommunity.UserContribution
  alias UliCommunity.UserContribution.CrowdsourcedSlur
  import UliCommunity.UserContributionFixtures
  import UliCommunity.AccountsFixtures, only: [user_fixture: 0]

  describe "crowdsourced_slurs" do
    @invalid_attrs %{
      label: nil,
      categories: nil,
      level_of_severity: nil,
      casual: nil,
      appropriated: nil,
      appropriation_context: nil,
      meaning: nil,
      source: nil,
      contributor_user_id: nil
    }

    test "list_crowdsourced_slurs/0 returns all crowdsourced_slurs" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert UserContribution.list_crowdsourced_slurs() == [crowdsourced_slur]
    end

    test "get_crowdsourced_slur!/1 returns the crowdsourced_slur with given id" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert UserContribution.get_crowdsourced_slur!(crowdsourced_slur.id) == crowdsourced_slur
    end

    test "create_crowdsourced_slur/1 with valid data creates a crowdsourced_slur" do
      user = user_fixture()

      valid_attrs = %{
        label: "some label",
        categories: [:gendered],
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning: "some meaning",
        source: :plugin,
        contributor_user_id: user.id
      }

      assert {:ok, %CrowdsourcedSlur{} = slur} =
               UserContribution.create_crowdsourced_slur(valid_attrs)

      assert slur.label == "some label"
      assert slur.categories == [:gendered]
      assert slur.level_of_severity == :medium
      assert slur.casual
      assert slur.appropriated
      assert slur.appropriation_context
      assert slur.meaning == "some meaning"
    end

    test "create_crowdsourced_slur/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               UserContribution.create_crowdsourced_slur(@invalid_attrs)
    end

    test "update_crowdsourced_slur/2 with valid data updates the crowdsourced_slur" do
      slur = crowdsourced_slur_fixture()

      update_attrs = %{
        label: "updated label",
        categories: [:caste],
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: false,
        meaning: "updated meaning"
      }

      assert {:ok, %CrowdsourcedSlur{} = updated} =
               UserContribution.update_crowdsourced_slur(slur, update_attrs)

      assert updated.label == "updated label"
      assert updated.categories == [:caste]
      assert updated.level_of_severity == :high
      refute updated.casual
      refute updated.appropriated
      refute updated.appropriation_context
    end

    test "update_crowdsourced_slur/2 with invalid data returns error changeset" do
      slur = crowdsourced_slur_fixture()

      assert {:error, %Ecto.Changeset{}} =
               UserContribution.update_crowdsourced_slur(slur, @invalid_attrs)

      assert slur == UserContribution.get_crowdsourced_slur!(slur.id)
    end

    test "delete_crowdsourced_slur/1 deletes the crowdsourced_slur" do
      slur = crowdsourced_slur_fixture()
      assert {:ok, %CrowdsourcedSlur{}} = UserContribution.delete_crowdsourced_slur(slur)
      assert_raise Ecto.NoResultsError, fn -> UserContribution.get_crowdsourced_slur!(slur.id) end
    end

    test "change_crowdsourced_slur/1 returns a changeset" do
      slur = crowdsourced_slur_fixture()
      assert %Ecto.Changeset{} = UserContribution.change_crowdsourced_slur(slur)
    end
  end

  # ---------------------------------------------------------------------------
  # FILTER TESTS ------------------------------------------------------------
  # ---------------------------------------------------------------------------
  describe "filter tests" do
    defp create_dummy_slur(attrs \\ %{}) do
      defaults = %{
        categories: [:caste],
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "meaning",
        source: :plugin
      }

      UliCommunity.UserContributionFixtures.crowdsourced_slur_fixture(Map.merge(defaults, attrs))
    end

    setup do
      Repo.delete_all(CrowdsourcedSlur)

      slurs = [
        create_dummy_slur(%{level_of_severity: :high, source: :plugin, categories: [:caste]}),
        create_dummy_slur(%{level_of_severity: :high, source: :plugin, categories: [:gendered]}),
        create_dummy_slur(%{
          level_of_severity: :medium,
          casual: false,
          appropriated: true,
          source: :plugin,
          categories: [:religion]
        }),
        create_dummy_slur(%{
          level_of_severity: :medium,
          source: :experts_2022,
          categories: [:class]
        }),
        create_dummy_slur(%{
          level_of_severity: :low,
          casual: false,
          appropriated: true,
          source: :experts_2022,
          categories: [:body_shaming]
        }),
        create_dummy_slur(%{level_of_severity: :low, source: :experts_2022, categories: [:caste]}),
        create_dummy_slur(%{source: :crowdsourcing_exercise, categories: [:gendered]}),
        create_dummy_slur(%{
          source: :crowdsourcing_exercise,
          categories: [:political_affiliation]
        }),
        create_dummy_slur(%{
          casual: true,
          appropriated: false,
          source: :crowdsourcing_exercise,
          categories: [:ethnicity]
        }),
        create_dummy_slur(%{
          casual: false,
          appropriated: false,
          source: :crowdsourcing_exercise,
          categories: [:sexual_identity]
        })
      ]

      %{slurs: slurs}
    end

    test "filters by level_of_severity", %{slurs: slurs} do
      expected_ids =
        slurs
        |> Enum.filter(&(&1.level_of_severity == :high))
        |> Enum.map(& &1.id)
        |> Enum.sort()

      {_count, filtered} =
        UserContribution.list_crowdsourced_slurs_with_filters(level_of_severity: "high")

      result_ids = Enum.map(filtered, & &1.id) |> Enum.sort()

      assert result_ids == expected_ids
    end

    test "filters by casual + appropriated flags", %{slurs: slurs} do
      expected =
        slurs
        |> Enum.filter(&(&1.casual == true and &1.appropriated == false))
        |> Enum.map(& &1.id)
        |> Enum.sort()

      {_count, filtered} =
        UserContribution.list_crowdsourced_slurs_with_filters(
          casual: "true",
          appropriated: "false"
        )

      result_ids = Enum.map(filtered, & &1.id) |> Enum.sort()

      assert result_ids == expected
    end

    test "filters by source", %{slurs: slurs} do
      expected_ids =
        slurs
        |> Enum.filter(&(&1.source == :plugin))
        |> Enum.map(& &1.id)
        |> Enum.sort()

      {_count, filtered} =
        UserContribution.list_crowdsourced_slurs_with_filters(source: "plugin")

      result_ids = Enum.map(filtered, & &1.id) |> Enum.sort()

      assert result_ids == expected_ids
    end

    test "filters by multiple categories", %{slurs: slurs} do
      target_categories = [:gendered, :caste]
      category_strings = Enum.map(target_categories, &Atom.to_string/1)

      {_count, filtered} =
        UserContribution.list_crowdsourced_slurs_with_filters(categories: category_strings)

      expected_ids =
        slurs
        |> Enum.filter(fn s -> Enum.any?(s.categories, &(&1 in target_categories)) end)
        |> Enum.map(& &1.id)
        |> Enum.sort()

      result_ids = Enum.map(filtered, & &1.id) |> Enum.sort()

      assert result_ids == expected_ids
    end

    test "filters by search term in label", %{slurs: slurs} do
      expected =
        slurs
        |> Enum.find(&(&1.label == "test-slur"))

      {_count, filtered} =
        UserContribution.list_crowdsourced_slurs_with_filters(search_term: "test")

      result_ids = Enum.map(filtered, & &1.id)

      assert expected.id in result_ids
    end
  end
end
