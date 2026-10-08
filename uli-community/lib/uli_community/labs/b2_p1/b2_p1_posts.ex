defmodule UliCommunity.Labs.B2P1.Posts do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  alias UliCommunity.Repo

  schema "b2_p1_posts" do
    # Platform's own post ID, e.g. the Instagram shortcode in /p/<code>/.
    field :external_id, :string
    field :url, :string
    # Not taken from the URL (/p/ and /reel/ links are interchangeable), so "post" for now.
    field :content_type, :string, default: "post"
    field :title, :string

    # Optional caption and context, filled by the admin for now: the post's caption, and any notes about
    # the creator or post that help classify comments.
    field :caption, :string
    field :context, :string
    field :posted_at, :utc_datetime

    belongs_to :channel, UliCommunity.Labs.B2P1.Channels
    has_one :config, UliCommunity.Labs.B2P1.PostConfigs, foreign_key: :post_id
    has_many :runs, UliCommunity.Labs.B2P1.Runs, foreign_key: :post_id
    has_many :comments, UliCommunity.Labs.B2P1.Comments, foreign_key: :post_id

    timestamps(type: :utc_datetime)
  end

  def changeset(post, attrs) do
    post
    |> cast(attrs, [
      :channel_id,
      :external_id,
      :url,
      :content_type,
      :title,
      :caption,
      :context,
      :posted_at
    ])
    |> validate_required([:channel_id, :external_id, :url, :content_type])
    |> validate_content_type()
    |> foreign_key_constraint(:channel_id)
    |> unique_constraint([:channel_id, :external_id], message: "post already added")
  end

  # The content type must be one the channel's platform supports (b2_p1_platforms.content_types).
  defp validate_content_type(changeset) do
    channel_id = get_field(changeset, :channel_id)

    allowed =
      channel_id &&
        Repo.one(
          from c in UliCommunity.Labs.B2P1.Channels,
            join: p in assoc(c, :platform),
            where: c.id == ^channel_id,
            select: p.content_types
        )

    # A missing channel is reported by foreign_key_constraint instead.
    if allowed,
      do:
        validate_inclusion(changeset, :content_type, allowed,
          message: "isn't supported by this platform"
        ),
      else: changeset
  end
end
