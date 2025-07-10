defmodule UliCommunity.UserContributionTest do
  use UliCommunity.DataCase

  alias UliCommunity.UserContribution

  describe "crowdsourced_slurs" do
    alias UliCommunity.UserContribution.CrowdsourcedSlur

    import UliCommunity.UserContributionFixtures
    import UliCommunity.AccountsFixtures, only: [user_fixture: 0]

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
    import UliCommunity.UserContributionFixtures, only: [crowdsourced_slur_fixture: 1]
    import UliCommunity.AccountsFixtures, only: [user_fixture: 0]

    defp slur(attrs \\ %{}) do
      user = user_fixture()

      defaults = %{
        label: "test‑slur",
        categories: [:caste],
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "meaning",
        source: :plugin,
        contributor_user_id: user.id
      }

      crowdsourced_slur_fixture(Map.merge(defaults, attrs))
    end

    test "filters by level_of_severity" do
      # Ensure test isolation
      Repo.delete_all(CrowdsourcedSlur)

      high = slur(%{level_of_severity: :high})
      _low = slur(%{level_of_severity: :low})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(level_of_severity: :high)

      assert slurs == [high]
    end

    test "filters by casual + appropriated flags" do
      only_casual = slur(%{casual: true, appropriated: false})
      _other = slur(%{casual: false, appropriated: false})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(casual: true, appropriated: false)

      assert slurs == [only_casual]
    end

    test "filters by source" do
      plugin = slur(%{source: :plugin})
      _expert = slur(%{source: :experts_2022})

      {_count, slurs} = UserContribution.list_crowdsourced_slurs_with_filters(source: :plugin)
      assert slurs == [plugin]
    end

    test "filters by from/to dates" do
      ten_days_ago = Date.add(Date.utc_today(), -10)

      old =
        slur(%{
          inserted_at: DateTime.new!(ten_days_ago, ~T[00:00:00Z]) |> DateTime.truncate(:second)
        })

      _recent = slur()

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(
          from_date: Date.utc_today() |> Date.add(-3),
          to_date: Date.utc_today()
        )

      refute Enum.member?(slurs, old)
    end

    test "filters by multiple categories" do
      caste = slur(%{categories: [:caste]})
      religion = slur(%{categories: [:religion]})
      _gender = slur(%{categories: [:gendered]})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(category: [:caste, :religion])

      assert Enum.sort(slurs) == Enum.sort([caste, religion])
    end

    test "filters by search term in label" do
      match = slur(%{label: "UniqueKeyword"})
      _other = slur(%{label: "something"})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(search: "uniquekeyword")

      assert slurs == [match]
    end

    test "respects page_num + page_size" do
      for i <- 1..5, do: slur(%{label: "S#{i}"})

      {_total, page1} =
        UserContribution.list_crowdsourced_slurs_with_filters(page_num: 1, page_size: 2)

      {_total, page2} =
        UserContribution.list_crowdsourced_slurs_with_filters(page_num: 2, page_size: 2)

      refute page1 == page2
      assert length(page1) == 2
      assert length(page2) == 2
    end

    test "sort newest first" do
      old =
        slur()
        |> Ecto.Changeset.change(
          inserted_at: DateTime.add(DateTime.utc_now(), -86_400 * 5) |> DateTime.truncate(:second)
        )
        |> UliCommunity.Repo.update!()

      new = slur()

      {_count, [first | _]} = UserContribution.list_crowdsourced_slurs_with_filters(sort: :newest)
      assert first == new
      refute first == old
    end
  end
end
