alias UliCommunity.PublicDataset

[
  %{label: "temp", language: "en", batch: 1},
  %{label: "and", language: "en", batch: 1},
  %{label: "test", language: "en", batch: 1},
  %{label: "awesome", language: "en", batch: 1},
  %{label: "cool", language: "hi", batch: 1},
  %{label: "offensive_term_6", language: "hi", batch: 1},
  %{label: "offensive_term_7", language: "en", batch: 1},
  %{label: "offensive_term_8", language: "en", batch: 1},
  %{label: "offensive_term_9", language: "ta", batch: 1},
  %{label: "offensive_term_10", language: "ta", batch: 1}
]
|> Enum.map(&PublicDataset.create_plugin_slur(&1))

[
  %{
    label: "crazy",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Describing something unusual or unexpected",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "test",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "A method of assessment or evaluation",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "awesome",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Inspiring admiration or impressive",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "weird",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Strange or unusual",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "cool",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Fashionable or impressive",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "nice",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Pleasant or agreeable",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "great",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Excellent or very good",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "interesting",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Arousing curiosity or attention",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "unique",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Being the only one of its kind",
    batch: 1,
    categories: [:other]
  },
  %{
    label: "random",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Without method or conscious decision",
    batch: 1,
    categories: [:other]
  }
]
|> Enum.map(&PublicDataset.create_plugin_slur_metadata(&1))
