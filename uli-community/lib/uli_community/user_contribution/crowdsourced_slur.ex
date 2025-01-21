defmodule UliCommunity.UserContribution.CrowdsourcedSlur do
  use Ecto.Schema
  import Ecto.Changeset

  schema "crowdsourced_slurs" do
    field(:label, :string)
    field(:level_of_severity, Ecto.Enum, values: [:low, :medium, :high])
    field(:casual, :boolean, default: false)
    field(:appropriated, :boolean, default: false)
    field(:appropriation_context, :boolean, default: false)
    field(:meaning, :string)
    field(:category, {:array, Ecto.Enum},
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
  def changeset(crowdsourced_slur, attrs) do
    crowdsourced_slur
    |> cast(attrs, [
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      :appropriation_context,
      :meaning,
      :category
    ])
    |> validate_required([
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      :appropriation_context,
      :meaning,
      :category
    ])
  end
end
