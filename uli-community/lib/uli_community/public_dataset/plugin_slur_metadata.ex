defmodule UliCommunity.PublicDataset.PluginSlurMetadata do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: [
             :id,
             :label,
             :level_of_severity,
             :casual,
             :appropriated,
             :appropriation_context,
             :meaning,
             :batch,
             :language,
             :categories,
             :inserted_at,
             :updated_at
           ]}

  schema "plugin_slur_metadata" do
    field(:label, :string)
    field(:language, :string)
    field(:level_of_severity, Ecto.Enum, values: [:low, :medium, :high])
    field(:casual, :boolean)
    field(:appropriated, :boolean, default: false)
    field(:appropriation_context, :boolean, default: nil)
    field(:meaning, :string)
    field(:batch, :integer)

    field(:categories, {:array, Ecto.Enum},
      values: [
        :gendered,
        :sexualized,
        :religion,
        :ethnicity,
        :political_affiliation,
        :caste,
        :class,
        :body_shaming,
        :ableist,
        :sexual_identity,
        :other
      ]
    )

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(plugin_slur_metadata, attrs) do
    plugin_slur_metadata
    |> cast(attrs, [
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      :appropriation_context,
      :meaning,
      :language,
      :batch,
      :categories
    ])
    |> validate_required([
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      :meaning,
      :language,
      :batch,
      :categories
    ])
  end
end
