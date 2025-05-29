# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     UliCommunity.Repo.insert!(%UliCommunity.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias UliCommunity.UserContribution

UserContribution.create_crowdsourced_slur_seed(%{label: "slur1", page_url: "https://example.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur2", page_url: "https://test.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur1", page_url: "https://again.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur3", page_url: "https://third.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur2", page_url: "https://repeat.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur4", page_url: "https://more.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur5", page_url: "https://fifth.com"})
UserContribution.create_crowdsourced_slur_seed(%{label: "slur1", page_url: "https://againagain.com"})
