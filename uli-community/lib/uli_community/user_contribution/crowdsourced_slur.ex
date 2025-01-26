defmodule UliCommunity.UserContribution.CrowdsourcedSlur do
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
             :categories,
             :contributor_user_id,
             :inserted_at,
             :updated_at
           ]}

  schema "crowdsourced_slurs" do
    field(:label, :string)
    field(:level_of_severity, Ecto.Enum, values: [:low, :medium, :high])
    field(:casual, :boolean)
    field(:appropriated, :boolean)
    field(:appropriation_context, :boolean, default: nil)
    field(:meaning, :string)

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

    belongs_to(:user, UliCommunity.Accounts.User, foreign_key: :contributor_user_id)

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
      :categories,
      :contributor_user_id
    ])
    |> validate_required([
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      # :appropriation_context,
      # :meaning,
      :categories,
      :contributor_user_id
    ])
  end

  def changeset_only_label(crowdsourced_slur, attrs) do
    crowdsourced_slur
    |> cast(attrs, [
      :label,
      :contributor_user_id
    ])
    |> validate_required([
      :label,
      :contributor_user_id
    ])
  end
end
