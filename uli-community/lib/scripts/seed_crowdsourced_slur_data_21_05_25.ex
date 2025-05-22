defmodule Scripts.SeedCrowdsourcedSlurData210525 do
  alias UliCommunity.UserContribution

  def run do
    path =
      :uli_community
      |> :code.priv_dir()
      |> Path.join("crowdsourced-21-14-2025/slur_metadata.json")

    case File.read(path) do
      {:ok, json_string} ->
        case Jason.decode(json_string) do
          {:ok, data_list} when is_list(data_list) ->
            Enum.each(data_list, fn entry ->
              case UserContribution.create_crowdsourced_slur_seed(entry) do
                {:ok, _record} ->
                  :ok

                {:error, changeset} ->
                  IO.inspect(changeset.errors, label: "Failed to insert #{entry["label"]}")
              end
            end)

          {:error, decode_error} ->
            IO.inspect(decode_error, label: "Failed to parse JSON")
        end

      {:error, reason} ->
        IO.inspect(reason, label: "Failed to read file")
    end
  end
end
