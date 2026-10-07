defmodule UliCommunityWeb.Labs.P1.ExportController do
  @moduledoc """
  CSV download of a run's selected comments.
  The post page submits the selected comment IDs; everything else is read fresh from
  the database on each request.
  """
  use UliCommunityWeb, :controller

  alias UliCommunity.Authorization
  alias UliCommunity.Labs.P1

  @header ~w(comment_id comment_url text author_username author_id commented_at likes is_reply
             parent_comment_id category remark model prompt_version classified_at channel
             post_url run_number scraper)

  def create(conn, %{"run_id" => run_id} = params) do
    # The /labs admin rule only runs for LiveViews, so check it here too.
    if Authorization.authorized?(conn.assigns.current_user, conn.request_path, "POST") do
      run = P1.get_run!(run_id)

      selected =
        params |> Map.get("comment_ids", "") |> String.split(",", trim: true) |> MapSet.new()

      run_number = P1.run_number(run)

      rows =
        for {c, cl} <- P1.comments_with_classification(run.id),
            MapSet.member?(selected, c.external_id) do
          [
            c.external_id,
            c.url,
            c.text,
            c.author_username,
            c.author_external_id,
            c.commented_at && DateTime.to_iso8601(c.commented_at),
            c.likes,
            not is_nil(c.parent_external_id),
            c.parent_external_id,
            cl && cl.category,
            cl && cl.remark,
            cl && cl.model,
            cl && cl.prompt_version,
            cl && DateTime.to_iso8601(cl.inserted_at),
            "@" <> run.post.channel.handle,
            run.post.url,
            run_number,
            run.scraper
          ]
          |> Enum.map(&cell/1)
        end

      filename = "#{run.post.channel.handle}_#{run.post.external_id}_run#{run_number}.csv"

      send_download(conn, {:binary, NimbleCSV.RFC4180.dump_to_iodata([@header | rows])},
        filename: filename,
        content_type: "text/csv"
      )
    else
      conn |> put_status(:forbidden) |> text("Not authorized")
    end
  end

  defp cell(nil), do: ""
  defp cell(value), do: to_string(value)
end
