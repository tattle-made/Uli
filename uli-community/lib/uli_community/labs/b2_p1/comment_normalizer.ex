defmodule UliCommunity.Labs.B2P1.CommentNormalizer do
  @moduledoc """
  Turns one raw Apify comment item into `b2_p1_comments` attributes. The two scrapers return
  the same data under different keys; the format is detected from the item itself.

  | field              | basic (scrapesmith)   | with replies (apify)        |
  |--------------------|-----------------------|-----------------------------|
  | external_id        | commentId             | id                          |
  | parent_external_id | -                     | from parentCommentUrl       |
  | url                | commentUrl            | commentUrl                  |
  | text               | text                  | text                        |
  | author_username    | ownerUsername         | ownerUsername               |
  | author_external_id | userId                | owner.id                    |
  | author_full_name   | userFullName          | owner.full_name             |
  | author_verified    | isVerified            | owner.is_verified           |
  | commented_at       | timestamp (unix secs) | timestamp (ISO 8601)        |
  | likes              | likesCount            | likesCount                  |
  | reply_count        | childCommentCount     | repliesCount                |
  | raw                | the whole item        | the whole item              |
  """

  def normalize(%{"commentId" => _} = item), do: basic(item)
  def normalize(item), do: with_replies(item)

  defp basic(item) do
    %{
      external_id: to_string(item["commentId"]),
      parent_external_id: nil,
      url: item["commentUrl"],
      text: item["text"],
      author_username: item["ownerUsername"],
      author_external_id: string_or_nil(item["userId"]),
      author_full_name: item["userFullName"],
      author_verified: item["isVerified"] == true,
      commented_at: from_unix(item["timestamp"]),
      likes: item["likesCount"] || 0,
      reply_count: item["childCommentCount"] || 0,
      raw: item
    }
  end

  defp with_replies(item) do
    owner = item["owner"] || %{}

    %{
      external_id: to_string(item["id"]),
      parent_external_id: parent_id(item["parentCommentUrl"]),
      url: item["commentUrl"],
      text: item["text"],
      author_username: item["ownerUsername"],
      author_external_id: string_or_nil(owner["id"]),
      author_full_name: owner["full_name"],
      author_verified: owner["is_verified"] == true,
      commented_at: from_iso(item["timestamp"]),
      likes: item["likesCount"] || 0,
      reply_count: item["repliesCount"] || 0,
      raw: item
    }
  end

  # ".../p/<post>/c/<parent_id>/" -> "<parent_id>"
  defp parent_id(nil), do: nil

  defp parent_id(url) do
    case Regex.run(~r{/c/(\d+)}, url) do
      [_, id] -> id
      _ -> nil
    end
  end

  defp from_unix(ts) when is_integer(ts), do: DateTime.from_unix!(ts)
  defp from_unix(_), do: nil

  defp from_iso(ts) when is_binary(ts) do
    case DateTime.from_iso8601(ts) do
      {:ok, dt, _} -> DateTime.truncate(dt, :second)
      _ -> nil
    end
  end

  defp from_iso(_), do: nil

  defp string_or_nil(nil), do: nil
  defp string_or_nil(value), do: to_string(value)
end
