defmodule UliCommunity.Languages do
  import Ecto.Changeset

  @codes %{
    "asm" => "Assamese",
    "ben" => "Bengali",
    "brx" => "Bodo",
    "doi" => "Dogri",
    "guj" => "Gujarati",
    "hin" => "Hindi",
    "kan" => "Kannada",
    "kas" => "Kashmiri",
    "kok" => "Konkani",
    "mai" => "Maithili",
    "mal" => "Malayalam",
    "mni" => "Manipuri",
    "mar" => "Marathi",
    "nep" => "Nepali",
    "ori" => "Odiya",
    "pan" => "Punjabi",
    "san" => "Sanskrit",
    "sat" => "Santhali",
    "snd" => "Sindhi",
    "tam" => "Tamil",
    "tel" => "Telugu",
    "urd" => "Urdu"
  }

  def valid_codes, do: Map.keys(@codes)
  def all, do: @codes
  def name(code), do: Map.get(@codes, code)
  def select_options, do: @codes |> Enum.map(fn {code, name} -> {name, code} end) |> Enum.sort()

  def validate_language(changeset, field) do
    validate_inclusion(changeset, field, valid_codes(),
      message: "must be a valid ISO 639-3 language code"
    )
  end
end
