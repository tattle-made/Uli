defmodule UliCommunity.MediaProcessing.VidVecRepClip do
  @moduledoc """
  Module for handling video vector representation using CLIP model.
  This module interfaces with Python code through erlport to process videos
  and extract their vector representations.
  """

  use Export.Python
  require Logger

  @python_path Application.compile_env(:uli_community, [:python, :python_path])
  @python_executable Application.compile_env(:uli_community, [:python, :python])

  @doc """
  Gets the embedding vector for a video file.

  ## Parameters
    - file_path: Path to the video file or URL as string

  ## Returns
    - `{:ok, embedding}` on success where embedding is a list of floats
    - `{:error, reason}` on failure
  """
  def get_embedding(file_path) do
    case Python.start(python_path: @python_path, python: @python_executable) do
      {:ok, py} ->
        try do
          embedding = Python.call(py, "video_vec", "get_avg_vec", [file_path])
          {:ok, embedding}
        rescue
          e ->
            Logger.error("Failed to process video: #{inspect(e)}")
            {:error, "Video processing failed: #{inspect(e)}"}
        after
          Python.stop(py)
        end

      {:error, reason} ->
        Logger.error("Failed to start Python process: #{inspect(reason)}")
        {:error, "Failed to initialize Python environment: #{inspect(reason)}"}
    end
  end
end
