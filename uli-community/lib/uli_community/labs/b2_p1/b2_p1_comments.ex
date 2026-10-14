defmodule UliCommunity.Labs.B2P1.Comments do
  @moduledoc "A comment (or reply) fetched in a run, normalized from either scraper, plus its raw item."
  use Ecto.Schema
  import Ecto.Changeset

  schema "b2_p1_comments" do
    field :external_id, :string
    # Set for replies: the external_id of the comment being replied to.
    field :parent_external_id, :string
    # Direct link to the comment (scraper's commentUrl).
    field :url, :string
    field :text, :string
    field :author_username, :string
    # Commenter's platform user ID; unlike the username, it never changes.
    field :author_external_id, :string
    field :author_full_name, :string
    field :author_verified, :boolean, default: false
    field :commented_at, :utc_datetime
    field :likes, :integer, default: 0
    field :reply_count, :integer, default: 0
    field :raw, :map

    belongs_to :run, UliCommunity.Labs.B2P1.Runs
    belongs_to :post, UliCommunity.Labs.B2P1.Posts

    has_many :classifications, UliCommunity.Labs.B2P1.CommentClassifications,
      foreign_key: :comment_id

    timestamps(type: :utc_datetime)
  end

  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [
      :run_id,
      :post_id,
      :external_id,
      :parent_external_id,
      :url,
      :text,
      :author_username,
      :author_external_id,
      :author_full_name,
      :author_verified,
      :commented_at,
      :likes,
      :reply_count,
      :raw
    ])
    |> validate_required([:run_id, :post_id, :external_id, :raw])
    |> foreign_key_constraint(:run_id)
    |> foreign_key_constraint(:post_id)
    |> unique_constraint([:run_id, :external_id])
  end
end
