defmodule UliCommunity.Labs.P1.PostConfigs do
  @moduledoc "Settings the next run of a post will use. One row per post."
  use Ecto.Schema
  import Ecto.Changeset

  schema "p1_post_configs" do
    field :comment_limit, :integer, default: 100
    field :scraper, Ecto.Enum, values: [:basic, :with_replies], default: :with_replies
    # Only the basic scraper supports sorting.
    field :sort, Ecto.Enum, values: [:recent, :popular]

    belongs_to :post, UliCommunity.Labs.P1.Posts

    timestamps(type: :utc_datetime)
  end

  def changeset(config, attrs) do
    config
    |> cast(attrs, [:post_id, :comment_limit, :scraper, :sort])
    |> validate_required([:post_id, :comment_limit, :scraper])
    |> validate_number(:comment_limit, greater_than: 0, less_than_or_equal_to: 1000)
    |> put_sort()
    |> foreign_key_constraint(:post_id)
    |> unique_constraint(:post_id)
  end

  # Basic scraper defaults to :recent; the replies scraper has no sort.
  defp put_sort(changeset) do
    case get_field(changeset, :scraper) do
      :with_replies ->
        put_change(changeset, :sort, nil)

      _ ->
        if get_field(changeset, :sort), do: changeset, else: put_change(changeset, :sort, :recent)
    end
  end
end
