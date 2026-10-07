defmodule UliCommunity.Labs.P1.CommentClassifications do
  @moduledoc """
  One LLM classification attempt for a comment. All attempts are kept (re-runs add rows),
  so results can be compared across prompts and retries; the newest (highest id) is current.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "p1_comment_classifications" do
    field :category, Ecto.Enum, values: [:abusive, :neutral_spam, :worth_engaging]
    field :remark, :string
    field :confidence, :float
    field :model, :string
    field :prompt_version, :string

    belongs_to :comment, UliCommunity.Labs.P1.Comments
    # The LLM call that produced this result (nil for results imported from elsewhere).
    belongs_to :llm_request, UliCommunity.Labs.P1.LlmRequests

    timestamps(type: :utc_datetime)
  end

  def changeset(classification, attrs) do
    classification
    |> cast(attrs, [
      :comment_id,
      :llm_request_id,
      :category,
      :remark,
      :confidence,
      :model,
      :prompt_version
    ])
    |> validate_required([:comment_id, :category, :model, :prompt_version])
    |> foreign_key_constraint(:comment_id)
    |> foreign_key_constraint(:llm_request_id)
  end
end
