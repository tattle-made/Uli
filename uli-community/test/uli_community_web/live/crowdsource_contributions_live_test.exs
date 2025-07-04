defmodule UliCommunityWeb.CrowdsourceContributionsLiveTest do
  use UliCommunityWeb.ConnCase, async: true
  import Phoenix.LiveViewTest

  # ---------------------------------------------------------------------------
  # Fixtures
  # ---------------------------------------------------------------------------
  import UliCommunity.UserContributionFixtures, only: [crowdsourced_slur_fixture: 1]
  import UliCommunity.AccountsFixtures, only: [user_fixture: 0]

  @live_path "/crowdsource-contributions"
  @valid_meta %{categories: [:other], source: :plugin}

  # ---------------------------------------------------------------------------
  # Before every test: create & log‑in a user
  # ---------------------------------------------------------------------------
  setup %{conn: conn} do
    user = user_fixture()
    # helper from ConnCase
    conn = log_in_user(conn, user)
    {:ok, conn: conn, user: user}
  end

  # ---------------------------------------------------------------------------
  # Helper: insert a valid crowdsourced slur
  # ---------------------------------------------------------------------------
  defp make_slur(user, attrs \\ %{}) do
    attrs
    |> Map.merge(@valid_meta)
    |> Map.put(:contributor_user_id, user.id)
    |> crowdsourced_slur_fixture()
  end

  # ---------------------------------------------------------------------------
  # 1. Page shows a slur that exists in DB
  # ---------------------------------------------------------------------------
  test "renders list with a slur in table", %{conn: conn, user: user} do
    make_slur(user, %{label: "pagal", level_of_severity: :low})

    {:ok, _view, html} = live(conn, @live_path)
    assert html =~ "pagal"
  end

  # ---------------------------------------------------------------------------
  # 2. URL param filters the list
  # ---------------------------------------------------------------------------
  test "URL severity param filters table", %{conn: conn, user: user} do
    make_slur(user, %{label: "gunda", level_of_severity: :high})
    make_slur(user, %{label: "halka", level_of_severity: :low})

    {:ok, view, _} = live(conn, @live_path <> "?level_of_severity=high")

    assert has_element?(view, "td", "gunda")
    refute has_element?(view, "td", "halka")
  end

  # ---------------------------------------------------------------------------
  # 3. Clicking severity radio updates list
  # ---------------------------------------------------------------------------
  test "changing severity radio updates list", %{conn: conn, user: user} do
    make_slur(user, %{label: "low‑one", level_of_severity: :low})
    make_slur(user, %{label: "high‑one", level_of_severity: :high})

    {:ok, view, _} = live(conn, @live_path)

    view
    |> element("input[name='level_of_severity'][value='low']")
    |> render_click()

    # Remount with new query to confirm change
    {:ok, view2, _} = live(conn, @live_path <> "?level_of_severity=low")
    assert has_element?(view2, "td", "low‑one")
    refute has_element?(view2, "td", "high‑one")
  end

  # ---------------------------------------------------------------------------
  # 4. “Next” pagination link moves to page 2
  # ---------------------------------------------------------------------------
  test "Next button paginates to second page", %{conn: conn, user: user} do
    for i <- 1..20, do: make_slur(user, %{label: "S#{i}", level_of_severity: :low})

    {:ok, view, _html} = live(conn, @live_path)

    # Click link containing page_num=2 in the href
    view
    |> element("a[href*='page_num=2']")
    |> render_click()

    #  Check that the URL was patched to include page_num=2
    assert_patch(view, ~r/page_num=2/)

    # Render and check for row that appears only on page 2
    _ = render(view)
    assert has_element?(view, "tbody td", "S11")
  end
end
