defmodule UliCommunity.Repo.Migrations.CreateB2P1CommentsClassifierTables do
  use Ecto.Migration

  def change do
    create table(:b2_p1_platforms) do
      add :slug, :string, null: false
      add :name, :string, null: false
      add :content_types, {:array, :string}, null: false, default: []

      timestamps(type: :utc_datetime)
    end

    create unique_index(:b2_p1_platforms, [:slug])

    execute(
      """
      INSERT INTO b2_p1_platforms (slug, name, content_types, inserted_at, updated_at)
      VALUES ('instagram', 'Instagram', '{post,reel}', now(), now())
      """,
      "DELETE FROM b2_p1_platforms WHERE slug = 'instagram'"
    )

    create table(:b2_p1_channels) do
      add :platform_id, references(:b2_p1_platforms, on_delete: :restrict), null: false
      add :name, :string
      add :handle, :string, null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:b2_p1_channels, [:platform_id, :handle])

    create table(:b2_p1_posts) do
      add :channel_id, references(:b2_p1_channels, on_delete: :delete_all), null: false
      # Platform's own post ID, e.g. the Instagram shortcode in /p/<code>/.
      add :external_id, :string, null: false
      add :url, :string, null: false
      # Not taken from the URL (/p/ and /reel/ links are interchangeable), so "post" for now.
      add :content_type, :string, null: false, default: "post"
      add :title, :string
      # Optional, filled by the admin for now: the post's caption, and any notes about
      # the creator or post that help classify comments.
      add :caption, :text
      add :context, :text
      add :posted_at, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create unique_index(:b2_p1_posts, [:channel_id, :external_id])

    # Settings the next run of a post will use (one row per post).
    create table(:b2_p1_post_configs) do
      add :post_id, references(:b2_p1_posts, on_delete: :delete_all), null: false
      add :comment_limit, :integer, null: false, default: 100
      add :scraper, :string, null: false, default: "with_replies"
      add :sort, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index(:b2_p1_post_configs, [:post_id])

    # One Apify run per post. Settings are copied from the post config when the run starts.
    create table(:b2_p1_runs) do
      add :post_id, references(:b2_p1_posts, on_delete: :delete_all), null: false
      add :status, :string, null: false, default: "queued"
      add :comment_limit, :integer, null: false
      add :scraper, :string, null: false
      add :sort, :string
      add :apify_run_id, :string
      add :apify_dataset_id, :string
      # Apify's own run status (SUCCEEDED, FAILED, TIMED-OUT, ...), separate from our :status.
      add :apify_status, :string
      # Apify's reported cost (run.usage_total_usd).
      add :cost_usd, :float
      # The full Apify Run object, kept for research and debugging.
      add :apify_run, :map
      add :fetched_count, :integer
      add :error, :text
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create index(:b2_p1_runs, [:post_id])

    create table(:b2_p1_comments) do
      add :run_id, references(:b2_p1_runs, on_delete: :delete_all), null: false
      add :post_id, references(:b2_p1_posts, on_delete: :delete_all), null: false
      add :external_id, :string, null: false
      add :parent_external_id, :string
      # Direct link to the comment (scraper's commentUrl).
      add :url, :string
      add :text, :text
      add :author_username, :string
      # Commenter's platform user ID; unlike the username, it never changes.
      add :author_external_id, :string
      add :author_full_name, :string
      add :author_verified, :boolean, null: false, default: false
      add :commented_at, :utc_datetime
      add :likes, :integer, null: false, default: 0
      add :reply_count, :integer, null: false, default: 0
      # The scraper's original item, unchanged.
      add :raw, :map, null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:b2_p1_comments, [:run_id, :external_id])
    create index(:b2_p1_comments, [:post_id])

    # One row per LLM call (a batch of comments), including failed calls.
    create table(:b2_p1_llm_requests) do
      add :run_id, references(:b2_p1_runs, on_delete: :delete_all), null: false
      add :model, :string, null: false
      add :prompt_version, :string, null: false
      add :status, :string, null: false
      add :error, :text
      add :input_tokens, :integer
      add :output_tokens, :integer
      add :latency_ms, :integer
      add :comments_sent, :integer, null: false
      add :results_returned, :integer
      # Exactly what was sent and what came back.
      add :request, :map
      add :response, :map

      timestamps(type: :utc_datetime)
    end

    create index(:b2_p1_llm_requests, [:run_id])

    create table(:b2_p1_comment_classifications) do
      add :comment_id, references(:b2_p1_comments, on_delete: :delete_all), null: false
      # The LLM call that produced this result (nil for results imported from elsewhere).
      add :llm_request_id, references(:b2_p1_llm_requests, on_delete: :nilify_all)
      add :category, :string, null: false
      add :remark, :text
      add :confidence, :float
      add :model, :string, null: false
      add :prompt_version, :string, null: false

      timestamps(type: :utc_datetime)
    end

    # No unique index: every classification attempt is kept for analysis.
    # The newest row (highest id) is a comment's current result.
    create index(:b2_p1_comment_classifications, [:comment_id, :prompt_version])
    create index(:b2_p1_comment_classifications, [:llm_request_id])
  end
end
