defmodule UliCommunity.MediaProcessing.VidVecRepClip do
  use Export.Python

  @python_path Path.expand("lib/python")

  def get_embedding(file_path) do
    {:ok, py} = Python.start(python_path: @python_path)

    try do
      embedding = Python.call(py, "video_vec", "get_avg_vec", [file_path])
      Python.stop(py)
      {:ok, embedding}
    rescue
      e ->
        Python.stop(py)
        {:error, e}
    end
  end
end
