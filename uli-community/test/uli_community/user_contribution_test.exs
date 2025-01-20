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
end
