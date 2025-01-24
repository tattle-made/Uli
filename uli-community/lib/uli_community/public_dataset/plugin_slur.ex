defmodule UliCommunity.PublicDataset.PluginSlur do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: [
             :id,
             :label,
             :batch,
             :language,
             :inserted_at,
             :updated_at
           ]}

  schema "plugin_slurs" do
    field(:label, :string)
    field(:language, :string)
    field(:batch, :integer)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(plugin_slur, attrs) do
    plugin_slur
    |> cast(attrs, [:label, :language, :batch])
    |> validate_required([:label, :language, :batch])
  end
end
