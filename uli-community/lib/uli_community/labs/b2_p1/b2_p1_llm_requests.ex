defmodule UliCommunity.Labs.B2P1.LlmRequests do
  @moduledoc """
  One LLM call: a batch of a run's comments sent for classification. Failed calls are
  logged too. Keeps the exact request and response for cost tracking and prompt research.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "b2_p1_llm_requests" do
    field :model, :string
    field :prompt_version, :string
    field :status, Ecto.Enum, values: [:completed, :error]
    field :error, :string
    field :input_tokens, :integer
    field :output_tokens, :integer
    field :latency_ms, :integer
    field :comments_sent, :integer
    field :results_returned, :integer
    field :request, :map
    field :response, :map

    belongs_to :run, UliCommunity.Labs.B2P1.Runs

    has_many :classifications, UliCommunity.Labs.B2P1.CommentClassifications,
      foreign_key: :llm_request_id

    timestamps(type: :utc_datetime)
  end

  def changeset(request, attrs) do
    request
    |> cast(attrs, [
      :run_id,
      :model,
      :prompt_version,
      :status,
      :error,
      :input_tokens,
      :output_tokens,
      :latency_ms,
      :comments_sent,
      :results_returned,
      :request,
      :response
    ])
    |> validate_required([:run_id, :model, :prompt_version, :status, :comments_sent])
    |> foreign_key_constraint(:run_id)
  end
end
