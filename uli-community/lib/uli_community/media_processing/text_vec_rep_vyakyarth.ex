defmodule UliCommunity.MediaProcessing.TextVecRepVyakyarth do
  @moduledoc """
  Module for handling text vector representation using Vyakyarth model.
  This module interfaces with Python code through erlport to process text
  and extract their vector representations.
  """
  use Export.Python
  require Logger

  @python_path Application.compile_env(:uli_community, [:python, :python_path])
  @python_executable Application.compile_env(:uli_community, [:python, :python])

  @doc """
  Gets the embedding vector for a text.

  ## Parameters
    - text: The input text as string

  ## Returns
    - `{:ok, embedding}` on success where embedding is a list of floats
    - `{:error, reason}` on failure
  """
  def get_embedding(text) do
    case Python.start(python_path: @python_path, python: @python_executable) do
      {:ok, py} ->
        try do
          embedding = Python.call(py, "text_vec", "get_embedding", [text])
          {:ok, embedding}
        rescue
          e ->
            Logger.error("Failed to process text: #{inspect(e)}")
            {:error, "Text processing failed: #{inspect(e)}"}
        after
          Python.stop(py)
        end

      {:error, reason} ->
        Logger.error("Failed to start Python process: #{inspect(reason)}")
        {:error, "Failed to initialize Python environment: #{inspect(reason)}"}
    end
  end
end
