defmodule UliCommunity.Labs.B2P1.Runs do
  @moduledoc """
  One Apify run for one post. `comment_limit`, `scraper` and `sort` are copied from the
  post config when the run starts and never change afterwards.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "b2_p1_runs" do
    field :status, Ecto.Enum,
      values: [:queued, :fetching, :categorizing, :done, :failed],
      default: :queued

    field :comment_limit, :integer
    field :scraper, Ecto.Enum, values: [:basic, :with_replies]
    field :sort, Ecto.Enum, values: [:recent, :popular]
    # (caption and context) Copied from the post when the run starts (both optional).
    field :caption, :string
    field :context, :string
    field :apify_run_id, :string
    field :apify_dataset_id, :string
    # Apify's own run status (SUCCEEDED, FAILED, TIMED-OUT, ...), separate from :status.
    field :apify_status, :string
    # Apify's reported cost (run.usage_total_usd).
    field :cost_usd, :float
    # The full Apify Run object, kept for research and debugging.
    field :apify_run, :map
    field :fetched_count, :integer
    field :error, :string
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime

    belongs_to :post, UliCommunity.Labs.B2P1.Posts
    has_many :comments, UliCommunity.Labs.B2P1.Comments, foreign_key: :run_id
    has_many :llm_requests, UliCommunity.Labs.B2P1.LlmRequests, foreign_key: :run_id

    timestamps(type: :utc_datetime)
  end

  def changeset(run, attrs) do
    run
    |> cast(attrs, [
      :post_id,
      :status,
      :comment_limit,
      :scraper,
      :sort,
      :caption,
      :context,
      :apify_run_id,
      :apify_dataset_id,
      :apify_status,
      :cost_usd,
      :apify_run,
      :fetched_count,
      :error,
      :started_at,
      :finished_at
    ])
    |> validate_required([:post_id, :status, :comment_limit, :scraper])
    |> foreign_key_constraint(:post_id)
  end
end
