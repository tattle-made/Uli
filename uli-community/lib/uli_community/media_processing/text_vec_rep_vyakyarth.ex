defmodule UliCommunity.MediaProcessing.TextVecRepVyakyarth do
  @moduledoc """
  Module for handling text vector representation using Vyakyarth model.
  This module interfaces with Python code through erlport to process text
  and extract their vector representations.
  """
  use GenServer
  use Export.Python
  require Logger

  @python_path Application.compile_env(:uli_community, [:python, :python_path])
  @python_executable Application.compile_env(:uli_community, [:python, :python])
  @server_name __MODULE__

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: @server_name)
  end

  def get_embedding(text) do
    GenServer.call(@server_name, {:get_embedding, text})
  end

  def get_embeddings(items) do
    GenServer.call(@server_name, {:get_embeddings, items})
  end

  @impl true
  def init(_opts) do
    case Python.start(python_path: @python_path, python: @python_executable) do
      {:ok, py} ->
        try do
          text_vec_instance = Python.call(py, "text_vec", "initialize", [])
          {:ok, %{py_process: py, text_vec_instance: text_vec_instance}}
        rescue
          e ->
            Logger.error("Failed to initialize Python code: #{inspect(e)}")
            {:stop, "Failed to initialize Python code"}
        end

      {:error, reason} ->
        Logger.error("Failed to start Python process: #{inspect(reason)}")
        {:stop, "Failed to initialize Python environment"}
    end
  end

  @impl true
  def handle_call({:get_embedding, text}, _from, state) do
    try do
      embedding =
        Python.call(state.py_process, "text_vec", "get_embedding", [text])

      {:reply, {:ok, embedding}, state}
    rescue
      e ->
        Logger.error("Failed to process text: #{inspect(e)}")
        {:reply, {:error, "Text processing failed"}, state}
    end
  end

  @impl true
  def handle_call({:get_embeddings, items}, _from, state) do
    try do
      embeddings =
        Python.call(state.py_process, "text_vec", "get_embeddings", [items])

      {:reply, {:ok, embeddings}, state}
    rescue
      e ->
        Logger.error("Failed to process batch: #{inspect(e)}")
        {:reply, {:error, "Batch processing failed"}, state}
    end
  end

  @impl true
  def terminate(_reason, state) do
    Python.stop(state.py_process)
    :ok
  end
end
