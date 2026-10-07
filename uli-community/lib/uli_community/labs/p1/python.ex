defmodule UliCommunity.Labs.P1.Python do
  @moduledoc """
  Runs one call into the Labs P1 Python scripts (lib/python/p1) in a Python process of
  its own, which is stopped afterwards. Each Oban job gets its own process, so a long
  Apify run never blocks other jobs. The scripts return JSON, which is decoded here.
  """
  use Export.Python

  @python_path Application.compile_env(:uli_community, [:python, :python_path])
  @python_executable Application.compile_env(:uli_community, [:python, :python])

  @doc "Calls `module.function(args)` in lib/python/p1 and decodes its JSON result."
  def call(module, function, args) do
    {:ok, py} =
      Python.start(python_path: Path.join(@python_path, "p1"), python: @python_executable)

    try do
      case py |> Python.call(module, function, args) |> to_string() |> Jason.decode() do
        {:ok, result} -> {:ok, result}
        {:error, e} -> {:error, "Invalid JSON from Python: #{Exception.message(e)}"}
      end
    after
      Python.stop(py)
    end
  end
end
