defmodule UliCommunity.Workers.B2P1.ClassifyCommentsWorker do
  @moduledoc """
  Labs B2_P1, step 2 of a run: classify the run's comments with OpenAI in batches. Every call
  is logged to b2_p1_llm_requests (failed ones too) and every result is kept in
  b2_p1_comment_classifications. Run status: categorizing -> done (or failed).

  Only comments without a result for the current prompt version are sent, so a retry
  picks up where the last attempt stopped and never re-classifies finished comments.
  """
  use Oban.Worker, queue: :b2_p1_classify, max_attempts: 3

  alias Ecto.Multi
  alias UliCommunity.Labs.B2P1
  alias UliCommunity.Labs.B2P1.{CommentClassifications, LlmRequests, Python}
  alias UliCommunity.Repo

  # Every LLM request and classification row records the model, so results from different
  # models stay comparable if this changes.
  @model "gpt-6.1-sol"
  # Bump this (and add priv/prompts/b2_p1/classify_<version>.txt) whenever the prompt changes.
  @prompt_version "v1"
  @batch_size 50

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"run_id" => run_id}, attempt: attempt, max_attempts: max}) do
    run = B2P1.get_run!(run_id)

    errors =
      if System.get_env("OPENAI_API_KEY") in [nil, ""] do
        ["OPENAI_API_KEY is not set"]
      else
        prompt = File.read!(prompt_path())

        run.id
        |> B2P1.comments_to_classify(@prompt_version)
        |> Enum.chunk_every(@batch_size)
        |> Enum.flat_map(&classify_batch(run, prompt, &1))
      end

    cond do
      errors == [] ->
        B2P1.update_run(run, %{status: :done, finished_at: now()})
        :ok

      # Out of attempts: keep whatever was classified; the rest shows as not categorized.
      attempt >= max ->
        B2P1.update_run(run, %{
          status: :failed,
          error: "Classification failed: #{Enum.join(errors, "; ")}",
          finished_at: now()
        })

        {:error, Enum.join(errors, "; ")}

      true ->
        {:error, Enum.join(errors, "; ")}
    end
  end

  # Classifies one batch and stores the call and its results. Returns a list of errors
  # (empty when every comment in the batch got a result).
  defp classify_batch(run, prompt, comments) do
    payload = Jason.encode!(Enum.map(comments, &%{id: &1.id, text: &1.text}))
    # The caption and context this run copied from its post (either can be empty).
    post = Jason.encode!(%{caption: run.caption, context: run.context})

    result =
      try do
        Python.call("comment_classify", "classify_batch", [@model, prompt, payload, post])
      rescue
        e -> {:error, "Python call failed: #{Exception.message(e)}"}
      end

    case result do
      {:ok, %{"status" => status} = res} ->
        store(run, comments, res)

        missing = length(comments) - length(res["results"])

        cond do
          status != "ok" -> [res["error"]]
          missing > 0 -> ["#{missing} comments got no result"]
          true -> []
        end

      {:error, reason} ->
        store(run, comments, %{"status" => "error", "error" => to_string(reason), "results" => []})

        [to_string(reason)]
    end
  end

  defp store(run, comments, res) do
    timestamp = now()

    Multi.new()
    |> Multi.insert(
      :request,
      LlmRequests.changeset(%LlmRequests{}, %{
        run_id: run.id,
        model: @model,
        prompt_version: @prompt_version,
        status: if(res["status"] == "ok", do: :completed, else: :error),
        error: res["error"],
        input_tokens: res["input_tokens"],
        output_tokens: res["output_tokens"],
        latency_ms: res["latency_ms"],
        comments_sent: length(comments),
        results_returned: length(res["results"]),
        request: res["request"],
        response: res["response"]
      })
    )
    |> Multi.insert_all(:classifications, CommentClassifications, fn %{request: request} ->
      Enum.map(res["results"], fn r ->
        %{
          comment_id: r["comment_id"],
          llm_request_id: request.id,
          category: String.to_existing_atom(r["category"]),
          remark: r["remark"],
          model: @model,
          prompt_version: @prompt_version,
          inserted_at: timestamp,
          updated_at: timestamp
        }
      end)
    end)
    |> Repo.transaction()
  end

  defp prompt_path,
    do: Application.app_dir(:uli_community, "priv/prompts/b2_p1/classify_#{@prompt_version}.txt")

  defp now, do: DateTime.utc_now() |> DateTime.truncate(:second)
end
