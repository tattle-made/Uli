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
             :updated_at,
             :page_url
           ]}

  schema "crowdsourced_slurs" do
    field(:label, :string)
    field(:level_of_severity, Ecto.Enum, values: [:low, :medium, :high])
    field(:casual, :boolean)
    field(:appropriated, :boolean)
    field(:appropriation_context, :boolean, default: nil)
    field(:meaning, :string)
    field(:page_url, :string)

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
      :contributor_user_id,
      :page_url
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
      :contributor_user_id,
      :page_url
    ])
    |> validate_required([
      :label,
      :contributor_user_id,
      :page_url
    ])
  end

  def changeset_seed(crowdsourced_slur, attrs) do
    crowdsourced_slur
    |> cast(attrs, [
      :label,
      :level_of_severity,
      :casual,
      :appropriated,
      :appropriation_context,
      :meaning,
      :categories,
      :contributor_user_id,
      :page_url
    ])
    |> validate_required([
      :label
    ])
  end
end
