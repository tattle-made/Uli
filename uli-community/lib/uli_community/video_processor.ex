defmodule UliCommunity.VideoProcessor do
  alias UliCommunity.Workers.VideoEmbeddingWorker

  def enqueue_video(file_path) do
    %{file_path: file_path}
    |> VideoEmbeddingWorker.new()
    |> Oban.insert()
  end

  def enqueue_videos(file_paths) when is_list(file_paths) do
    Enum.map(file_paths, &enqueue_video/1)
  end
end
