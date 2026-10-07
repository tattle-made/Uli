defmodule UliCommunity.Workers.P1.FetchCommentsWorker do
  @moduledoc """
  Labs P1, step 1 of a run: fetch the post's comments with Apify, save them, then queue
  `ClassifyCommentsWorker`. Run status: queued -> fetching -> categorizing (or failed).
  """
  # No retries: every attempt is a paid Apify run. A failed run can be refetched from the UI.
  use Oban.Worker, queue: :p1_fetch, max_attempts: 1

  alias Ecto.Multi
  alias UliCommunity.Labs.P1
  alias UliCommunity.Labs.P1.{CommentNormalizer, Comments, Python}
  alias UliCommunity.Repo
  alias UliCommunity.Workers.P1.ClassifyCommentsWorker

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"run_id" => run_id}}) do
    run = P1.get_run!(run_id)
    {:ok, run} = P1.update_run(run, %{status: :fetching, started_at: now()})

    case fetch(run) do
      {:ok, %{"status" => "ok", "run" => apify_run, "items" => items}} ->
        save(run, apify_run, items)

      {:ok, %{"status" => "error", "error" => error} = result} ->
        fail(run, error, apify_fields(result["run"]))

      {:error, reason} ->
        fail(run, reason, %{})
    end
  end

  defp fetch(run) do
    case Application.get_env(:uli_community, :apify_token) do
      nil ->
        {:error, "APIFY_TOKEN is not set"}

      token ->
        Python.call("apify_fetch", "fetch_post_comments", [
          token,
          run.post.url,
          run.comment_limit,
          to_string(run.scraper),
          to_string(run.sort)
        ])
    end
  rescue
    e -> {:error, "Python call failed: #{Exception.message(e)}"}
  end

  # Saves the comments, records the Apify details and queues classification, all at once.
  defp save(run, apify_run, items) do
    timestamp = now()

    rows =
      items
      |> Enum.map(&CommentNormalizer.normalize/1)
      |> Enum.uniq_by(& &1.external_id)
      |> Enum.map(
        &Map.merge(&1, %{
          run_id: run.id,
          post_id: run.post_id,
          inserted_at: timestamp,
          updated_at: timestamp
        })
      )

    Multi.new()
    |> Multi.insert_all(:comments, Comments, rows, on_conflict: :nothing)
    |> Multi.update(
      :run,
      P1.Runs.changeset(
        run,
        Map.merge(apify_fields(apify_run), %{status: :categorizing, fetched_count: length(rows)})
      )
    )
    |> Oban.insert(:classify, ClassifyCommentsWorker.new(%{run_id: run.id}))
    |> Repo.transaction()
    |> case do
      {:ok, _} ->
        P1.broadcast()
        :ok

      {:error, step, reason, _} ->
        fail(
          run,
          "Saving comments failed at #{step}: #{inspect(reason)}",
          apify_fields(apify_run)
        )
    end
  rescue
    e -> fail(run, "Saving comments failed: #{Exception.message(e)}", apify_fields(apify_run))
  end

  defp apify_fields(nil), do: %{}

  defp apify_fields(apify_run) do
    %{
      apify_run_id: apify_run["id"],
      apify_dataset_id: apify_run["default_dataset_id"],
      apify_status: apify_run["status"],
      cost_usd: apify_run["usage_total_usd"],
      apify_run: apify_run
    }
  end

  defp fail(run, error, extra) do
    P1.update_run(run, Map.merge(extra, %{status: :failed, error: error, finished_at: now()}))
    {:error, error}
  end

  defp now, do: DateTime.utc_now() |> DateTime.truncate(:second)
end
