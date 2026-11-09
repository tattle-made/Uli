defmodule UliCommunityWeb.TokenGenerationLiveTest do
  use UliCommunityWeb.ConnCase, async: true

  # every test runs as a freshly registered, logged in user with the default :user role
  setup :register_and_log_in_user

  describe "generating a token" do
    test "shows the token once and lists it in the table", %{conn: conn} do
      expiry = Date.add(Date.utc_today(), 30)

      conn
      |> visit(~p"/gentoken")
      # a new user starts with no tokens
      |> assert_has("p", text: "No Tokens to Display")
      |> generate_token("Phoenix Test Token", expiry)
      # the modal is always in the DOM, the "block" class means it is actually visible
      |> assert_has("#example-modal.block")
      # signed Phoenix tokens start with "SFMyNTY", so this proves a real token is shown
      |> assert_has("#generated-token", text: "SFMyNTY")
      # find the element on the table, exactly one row for the new token
      |> assert_has("#tokens-table tr", text: "Phoenix Test Token", count: 1)
      # the row shows the expiry date we picked
      |> assert_has("#tokens-table tr", text: Date.to_iso8601(expiry))
      # an expiry in the future means the token is active
      |> assert_has("#tokens-table tr", text: "Active")
      |> click_button("Close")
      # closing hides the modal again
      |> assert_has("#example-modal.hidden")
      # the token is only displayed once, it is cleared after closing
      |> refute_has("#generated-token", text: "SFMyNTY")
    end

    test "shows an error and adds no row when expiry is blank", %{conn: conn} do
      conn
      |> visit(~p"/gentoken")
      |> within("#token-form", fn form ->
        form
        |> fill_in("Token Name", with: "Phoenix Test Token")
        |> click_button("Save")
      end)
      # the save fails and the user sees the error flash
      |> assert_has("#flash-error", text: "Something Went Wrong!")
      # no token was generated, so the modal stays hidden
      |> assert_has("#example-modal.hidden")
      # and nothing was added to the table
      |> refute_has("#tokens-table tr", text: "Phoenix Test Token")
    end
  end

  describe "deleting a token" do
    test "removes the row from the table", %{conn: conn} do
      conn
      |> visit(~p"/gentoken")
      |> generate_token("Phoenix Test Token", Date.utc_today())
      |> click_button("Close")
      |> click_button("Delete")
      # the user is told the delete worked
      |> assert_has("#flash-info", text: "Token deleted successfully.")
      # the row is gone from the table
      |> refute_has("#tokens-table tr", text: "Phoenix Test Token")
      # with no tokens left, the empty message is back
      |> assert_has("p", text: "No Tokens to Display")
    end
  end

  describe "access levels" do
    test "a user can only pick the User level", %{conn: conn} do
      conn
      |> visit(~p"/gentoken")
      # the access level dropdown offers User...
      |> assert_has("#token_access_level option", text: "User")
      # ...but not Admin, because the logged in user has the :user role
      |> refute_has("#token_access_level option", text: "Admin")
    end

    test "an admin can also pick the Admin level", %{conn: conn, user: user} do
      user |> Ecto.Changeset.change(role: :admin) |> UliCommunity.Repo.update!()

      conn
      |> visit(~p"/gentoken")
      # admins get the Admin option in the dropdown
      |> assert_has("#token_access_level option", text: "Admin")
    end
  end

  # fills and submits the token form, scoped with within/3 so labels only match inside the form
  defp generate_token(session, name, expiry) do
    within(session, "#token-form", fn form ->
      form
      |> fill_in("Token Name", with: name)
      |> fill_in("Set Expiry", with: expiry)
      |> select("Access Level", option: "User")
      |> click_button("Save")
    end)
  end
end
