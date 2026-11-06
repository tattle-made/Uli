defmodule UliCommunityWeb.TokenGenerationLiveTest do
  use UliCommunityWeb.ConnCase, async: true

  setup :register_and_log_in_user

  test "we generate a token", %{conn: conn} do
    expiry = Date.add(Date.utc_today(), 30)

    conn
    |> visit(~p"/gentoken")
    # Before state: Nothing to display
    |> assert_has("p", text: "No Tokens to Display")
    |> within("#token-form", fn session ->
      session
      |> fill_in("Token Name", with: "Phoenix Test Token")
      |> fill_in("Set Expiry", with: expiry)
      |> select("Access Level", option: "User")
      |> click_button("Save")
    end)
    # Model is visible
    |> assert_has("#example-modal.block")
    |> assert_has("#generated-token", text: "SFMyNTY")
    |> click_button("Close")
    # Model is hidden
    |> assert_has("#example-modal.hidden")
    |> assert_has("#tokens-table")
    # Make sure the generated token is not shown now that the model is hidden
    |> refute_has("#generated-token", text: "SFMyNTY")
    # Check if the token is shows on the table
    |> assert_has("#tokens-table tr", text: "Phoenix Test Token", count: 1)
    |> assert_has("#tokens-table tr", text: Date.to_iso8601(expiry))
    |> assert_has("#tokens-table tr", text: "Active")
  end
end
