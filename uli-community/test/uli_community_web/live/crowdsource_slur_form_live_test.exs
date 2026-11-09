defmodule UliCommunityWeb.CrowdsourceSlurFormLiveTest do
  use UliCommunityWeb.ConnCase, async: true

  import UliCommunity.AccountsFixtures
  import UliCommunity.UserContributionFixtures

  alias UliCommunity.Repo
  alias UliCommunity.UserContribution.CrowdsourcedSlur

  setup :register_and_log_in_user

  describe "adding a slur" do
    test "successfully adds a slur", %{conn: conn} do
      conn
      |> visit(~p"/contribute-slur")
      |> assert_has("h1", text: "Add Slur")
      |> create_slur("Slur")
      |> assert_path(~p"/crowdsource-contributions")
      |> assert_has("#flash-info", "Success!")
      |> assert_has("#crowdsource-slur-metadata-table tr", text: "Slur", count: 1)
      |> assert_has("#crowdsource-slur-metadata-table tr", text: "nep", count: 1)
    end

    test "shows errors when the slur text is missing", %{conn: conn} do
      conn
      |> visit(~p"/contribute-slur")
      |> assert_has("h1", text: "Add Slur")
      |> choose("Low", exact: false)
      |> choose("input[name='crowdsourced_slur[casual]']", "Yes")
      |> choose("input[name='crowdsourced_slur[appropriated]']", "No")
      |> check("Caste")
      |> click_button("Save & Submit Slur")
      |> assert_path(~p"/contribute-slur")
      |> assert_has("#flash-error", text: "Failed to save slur")
      |> assert_has("p", text: "can't be blank")
    end
  end

  describe "editing a slur" do
    setup %{user: user} do
      %{slur: crowdsourced_slur_fixture(%{contributor_user_id: user.id})}
    end

    test "starts with the saved answers selected", %{conn: conn, slur: slur} do
      conn
      |> visit(~p"/contribute-slur/#{slur.id}")
      |> assert_has("h1", text: "Edit Slur")
      |> assert_has("input[name='crowdsourced_slur[level_of_severity]']:checked",
        label: "Medium",
        exact: false
      )
      |> assert_has("input[name='crowdsourced_slur[casual]']:checked", label: "Yes")
      |> assert_has("input[name='crowdsourced_slur[categories][]']:checked", label: "Other")
    end

    test "saves changed answers", %{conn: conn, slur: slur} do
      conn
      |> visit(~p"/contribute-slur/#{slur.id}")
      |> choose("High", exact: false)
      |> choose("input[name='crowdsourced_slur[casual]']", "No")
      |> check("Religion")
      |> click_button("Save & Submit Slur")
      |> assert_path(~p"/crowdsource-contributions")
      |> assert_has("#flash-info", text: "Slur updated successfully")

      saved = Repo.get!(CrowdsourcedSlur, slur.id)
      assert saved.level_of_severity == :high
      assert saved.casual == false
      assert Enum.sort(saved.categories) == [:other, :religion]
    end

    test "deletes the slur", %{conn: conn, slur: slur} do
      conn
      |> visit(~p"/contribute-slur/#{slur.id}")
      |> click_button("Delete")
      |> assert_path(~p"/crowdsource-contributions")
      |> assert_has("#flash-info", text: "Slur deleted successfully")

      refute Repo.get(CrowdsourcedSlur, slur.id)
    end

    test "sends the user away from someone else's slur", %{conn: conn} do
      other_slur = crowdsourced_slur_fixture(%{contributor_user_id: user_fixture().id})

      conn
      |> visit(~p"/contribute-slur/#{other_slur.id}")
      |> assert_path(~p"/crowdsource-contributions")
    end
  end

  defp create_slur(session, slur) do
    within(session, "#slur-submission-form", fn form ->
      form
      |> fill_in("input[name='crowdsourced_slur[label]']", "", with: slur)
      |> choose("input[name='crowdsourced_slur[level_of_severity]']", "Low", exact: false)
      |> choose("input[name='crowdsourced_slur[casual]']", "Yes")
      |> choose("input[name='crowdsourced_slur[appropriated]']", "No")
      |> check("Caste")
      |> choose("Nepali", exact: false)
      |> submit()
    end)
  end
end
