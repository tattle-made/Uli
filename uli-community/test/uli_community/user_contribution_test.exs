defmodule UliCommunity.UserContributionTest do
  use UliCommunity.DataCase

  alias UliCommunity.UserContribution

  describe "crowdsourced_slurs" do
    alias UliCommunity.UserContribution.CrowdsourcedSlur

    import UliCommunity.UserContributionFixtures

    @invalid_attrs %{label: nil, category: nil, level_of_severity: nil, casual: nil, appropriated: nil, appropriation_context: nil, meaning: nil}

    test "list_crowdsourced_slurs/0 returns all crowdsourced_slurs" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert UserContribution.list_crowdsourced_slurs() == [crowdsourced_slur]
    end

    test "get_crowdsourced_slur!/1 returns the crowdsourced_slur with given id" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert UserContribution.get_crowdsourced_slur!(crowdsourced_slur.id) == crowdsourced_slur
    end

    test "create_crowdsourced_slur/1 with valid data creates a crowdsourced_slur" do
      valid_attrs = %{label: "some label", category: ["option1", "option2"], level_of_severity: "some level_of_severity", casual: true, appropriated: true, appropriation_context: true, meaning: "some meaning"}

      assert {:ok, %CrowdsourcedSlur{} = crowdsourced_slur} = UserContribution.create_crowdsourced_slur(valid_attrs)
      assert crowdsourced_slur.label == "some label"
      assert crowdsourced_slur.category == ["option1", "option2"]
      assert crowdsourced_slur.level_of_severity == "some level_of_severity"
      assert crowdsourced_slur.casual == true
      assert crowdsourced_slur.appropriated == true
      assert crowdsourced_slur.appropriation_context == true
      assert crowdsourced_slur.meaning == "some meaning"
    end

    test "create_crowdsourced_slur/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = UserContribution.create_crowdsourced_slur(@invalid_attrs)
    end

    test "update_crowdsourced_slur/2 with valid data updates the crowdsourced_slur" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      update_attrs = %{label: "some updated label", category: ["option1"], level_of_severity: "some updated level_of_severity", casual: false, appropriated: false, appropriation_context: false, meaning: "some updated meaning"}

      assert {:ok, %CrowdsourcedSlur{} = crowdsourced_slur} = UserContribution.update_crowdsourced_slur(crowdsourced_slur, update_attrs)
      assert crowdsourced_slur.label == "some updated label"
      assert crowdsourced_slur.category == ["option1"]
      assert crowdsourced_slur.level_of_severity == "some updated level_of_severity"
      assert crowdsourced_slur.casual == false
      assert crowdsourced_slur.appropriated == false
      assert crowdsourced_slur.appropriation_context == false
      assert crowdsourced_slur.meaning == "some updated meaning"
    end

    test "update_crowdsourced_slur/2 with invalid data returns error changeset" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert {:error, %Ecto.Changeset{}} = UserContribution.update_crowdsourced_slur(crowdsourced_slur, @invalid_attrs)
      assert crowdsourced_slur == UserContribution.get_crowdsourced_slur!(crowdsourced_slur.id)
    end

    test "delete_crowdsourced_slur/1 deletes the crowdsourced_slur" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert {:ok, %CrowdsourcedSlur{}} = UserContribution.delete_crowdsourced_slur(crowdsourced_slur)
      assert_raise Ecto.NoResultsError, fn -> UserContribution.get_crowdsourced_slur!(crowdsourced_slur.id) end
    end

    test "change_crowdsourced_slur/1 returns a crowdsourced_slur changeset" do
      crowdsourced_slur = crowdsourced_slur_fixture()
      assert %Ecto.Changeset{} = UserContribution.change_crowdsourced_slur(crowdsourced_slur)
    end
  end

    # ---------------------------------------------------------------------------
  # FILTER TESTS ------------------------------------------------------------
  # ---------------------------------------------------------------------------
  describe "filter tests" do
    import UliCommunity.UserContributionFixtures, only: [crowdsourced_slur_fixture: 1]

    # Helper that merges required default attrs with whatever a test overrides.
    defp slur(attrs \\ %{}) do
      defaults = %{
        label: "test‑slur",
        category: ["caste"],
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "meaning",
        source: :plugin
      }

      crowdsourced_slur_fixture(Map.merge(defaults, attrs))
    end

    # ------------------- Severity -------------------------------------------
    test "filters by level_of_severity" do
      high = slur(%{level_of_severity: :high})
      _low = slur(%{level_of_severity: :low})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(level_of_severity: :high)

      assert slurs == [high]
    end

    # ------------------- Casual / Appropriated ------------------------------
    test "filters by casual + appropriated flags" do
      only_casual = slur(%{casual: true, appropriated: false})
      _both_false = slur(%{casual: false, appropriated: false})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(
          casual: true,
          appropriated: false
        )

      assert slurs == [only_casual]
    end

    # ------------------- Source ---------------------------------------------
    test "filters by source" do
      plugin_slur  = slur(%{source: :plugin})
      _experts_slur = slur(%{source: :experts_2022})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(source: :plugin)

      assert slurs == [plugin_slur]
    end

    # ------------------- Date Range -----------------------------------------
    test "filters by from/to dates" do
      ten_days_ago = Date.add(Date.utc_today(), -10)
      old_slur     = slur(%{inserted_at: DateTime.new!(ten_days_ago, ~T[00:00:00Z])})
      _recent_slur = slur(%{})   # now

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(
          from_date: Date.utc_today() |> Date.add(-3),
          to_date: Date.utc_today()
        )

      refute Enum.member?(slurs, old_slur)
    end

    # ------------------- Categories -----------------------------------------
    test "filters by multiple categories" do
      caste_slur = slur(%{category: ["caste"]})
      rel_slur   = slur(%{category: ["religion"]})
      _gender_slur = slur(%{category: ["gendered"]})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(
          category: ["caste", "religion"]
        )

      assert Enum.sort(slurs) == Enum.sort([caste_slur, rel_slur])
    end

    # ------------------- Text Search ----------------------------------------
    test "filters by search term in label" do
      match = slur(%{label: "UniqueKeyword"})
      _other = slur(%{label: "nothing"})

      {_count, slurs} =
        UserContribution.list_crowdsourced_slurs_with_filters(search: "uniquekeyword")

      assert slurs == [match]
    end

    # ------------------- Pagination -----------------------------------------
    test "respects page_num + page_size" do
      for i <- 1..5, do: slur(%{label: "S#{i}"})

      {_total, page1} =
        UserContribution.list_crowdsourced_slurs_with_filters(page_num: 1, page_size: 2)

      {_total, page2} =
        UserContribution.list_crowdsourced_slurs_with_filters(page_num: 2, page_size: 2)

      refute page1 == page2
      assert Enum.count(page1) == 2
      assert Enum.count(page2) == 2
    end

    # ------------------- Sort ------------------------------------------------
    test "sort newest first" do
      old =
        slur()
        |> Ecto.Changeset.change(inserted_at: DateTime.add(DateTime.utc_now(), -86_400 * 5))
        |> UliCommunity.Repo.update!()

      new = slur()

      {_count, [first | _]} =
        UserContribution.list_crowdsourced_slurs_with_filters(sort: :newest)

      assert first == new
      refute first == old
    end
  end
end
