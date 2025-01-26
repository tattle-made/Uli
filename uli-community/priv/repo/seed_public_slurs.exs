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
    label: "fuck",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning:
      "A casual slur used to convey dislike, disrespect or lack of care. Sometimes also used aggressively or intensely",
    batch: 1,
    categories: [:sexualized]
  },
  %{
    label: "cunt",
    language: "English",
    level_of_severity: :high,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Slang for women's genitalia",
    batch: 1,
    categories: [:sexualized]
  },
  %{
    label: "slut",
    language: "English",
    level_of_severity: :high,
    casual: false,
    appropriated: true,
    appropriation_context: true,
    meaning: "Derogatory term for sexual behavior",
    batch: 1,
    categories: [:gendered, :sexualized, :body_shaming]
  },
  %{
    label: "whore",
    language: "English",
    level_of_severity: :low,
    casual: true,
    appropriated: true,
    appropriation_context: true,
    meaning: "Derogatory term for sexual behavior",
    batch: 1,
    categories: [:gendered, :sexualized]
  },
  %{
    label: "Randi",
    language: "Hindi",
    level_of_severity: :high,
    casual: false,
    appropriated: false,
    appropriation_context: false,
    meaning: "Offensive term for sex worker",
    batch: 1,
    categories: [:gendered, :sexualized]
  },
  %{
    label: "chutiya",
    language: "Hindi",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Vulgar term implying stupidity",
    batch: 1,
    categories: []
  },
  %{
    label: "bsdk",
    language: "Hindi",
    level_of_severity: :low,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Offensive abbreviation",
    batch: 1,
    categories: [:sexualized]
  },
  %{
    label: "jihadi",
    language: "Hindi",
    level_of_severity: :high,
    casual: false,
    appropriated: false,
    appropriation_context: false,
    meaning: "Derogatory term related to religious and political ideology",
    batch: 1,
    categories: [:religion, :ethnicity, :political_affiliation]
  },
  %{
    label: "Madarchod",
    language: "Hindi",
    level_of_severity: :medium,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Offensive term involving sexual act and incest",
    batch: 1,
    categories: [:gendered, :sexualized]
  },
  %{
    label: "bhenchod",
    language: "Hindi",
    level_of_severity: :medium,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Offensive term involving sexual act and incest",
    batch: 1,
    categories: [:gendered, :sexualized]
  },
  %{
    label: "motherfucker",
    language: "English",
    level_of_severity: :medium,
    casual: true,
    appropriated: false,
    appropriation_context: false,
    meaning: "Slur based on incest, implying immorality through sexual taboo",
    batch: 1,
    categories: [:sexualized, :gendered]
  },
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
  }
]
|> Enum.map(&PublicDataset.create_plugin_slur_metadata(&1))
