defmodule Scripts.SeedPluginSlurMetadata280125 do
  alias UliCommunity.PublicDataset

  def run do
    [
      %{
        label: "Katwa",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Targets the Muslim population, largely men",
        batch: 1,
        categories: [:religion, :gendered]
      },
      %{
        label: "chakka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It's a homophobic slur but also used in cricket",
        batch: 1,
        categories: [:gendered, :body_shaming, :other]
      },
      %{
        label: "Randi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "ramdi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Randie",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "randya",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "randikhana",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "r&d-khana",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "khanki",
        language: "Unknown",
        level_of_severity: :unknown,
        casual: nil,
        appropriated: nil,
        appropriation_context: nil,
        meaning:
          "It is an anti sex work slur in bengali. It is also the sound made by bangles in hindi. ",
        batch: 1,
        categories: [:sexualized, :other]
      },
      %{
        label: "randi ke beej",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to humilate a person by calling their mothers loose women ",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Lulli",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used against people with a phallus to humilate them basis of their size",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "Gasti",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used against women, to imply 'looseness' and looks at sex work in a negative light",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Meetha",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a queerphobic slur. It is also means sweet in Hindi",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Gud",
        language: "Unknown",
        level_of_severity: :low,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a queerphobic slur. It is also means Jaggery in Hindi",
        batch: 1,
        categories: []
      },
      %{
        label: "Gaandu",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It can be severe for men, in that it can incite fights",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "Gaand",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a queerphobic slur. It is also means  ass in Hindi",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Gandiaal",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Used in Haryana, this word can be said casually by children. Can be interpreted to mean an attack on manhood for men",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Dheela Lun@",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to humilate people with a penis on their sexual performance",
        batch: 1,
        categories: [:gendered, :body_shaming]
      },
      %{
        label: "kutiya",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to associate girls and women with animals ",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "kutti",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to associate girls and women with animals ",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "Chudail",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to associate girls and women with someone who does black magic",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "Battameez",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used to correct behaviour of people or to highlight if they have deviated from social norms ",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "saali",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning:
          "It refers to your brother in law's wife, used to insult a person by making insinuations about the sister-in-law",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "sali",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning:
          "It refers to your brother in law's wife, used to insult a person by making insinuations about the sister-in-law",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "chod",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is the Hindi version of the slur fuck",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "chudai",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a conversational usage of the work fuck and sex in Hindi",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "Bhdsk",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning:
          "It is a slur used to term someone has son of a prositute. An anti sex worker slur",
        batch: 1,
        categories: [:other, :sexualized]
      },
      %{
        label: "2BHK",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Bhosi ke",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bsdk",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhonsdi ke",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhosad",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhosdiwale",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "maa ka bhosra",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word is used during fights to humilate and silence the other person",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bokachoda",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends and also during fights",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Betichod",
        language: "Unknown",
        level_of_severity: :low,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word is used during fights to humilate and silence the other person",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Lodu",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "It is used casually between friends ",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhenchod",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word can incite fights when said even casually",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Madarchod",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word can incite fights when said even casually",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Maderchod",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word can incite fights when said even casually",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "chutiye",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used casually between friends",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "chutiya",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used casually between friends",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "Rakhail",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used for shaming women, shaming women in certain profession, outgoing women, female friends, used for moral policing ",
        batch: 1,
        categories: [:gendered, :sexualized, :other]
      },
      %{
        label: "pagal aurat",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used for mocking someone, meaning they are crazy",
        batch: 1,
        categories: [:ableist, :gendered]
      },
      %{
        label: "Ugly",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to criticise someone's physical appearance",
        batch: 1,
        categories: [:body_shaming]
      },
      %{
        label: "Mujra",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning: "People relate the word to sex work or women who dance for money. ",
        batch: 1,
        categories: [:gendered, :sexualized, :class]
      },
      %{
        label: "mujra",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning: "People relate the word to sex work or women who dance for money. ",
        batch: 1,
        categories: [:gendered, :sexualized, :class]
      },
      %{
        label: "jaahil aurat",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is directed towards people who are not educated enough especially to woman of certain class and caste",
        batch: 1,
        categories: [:gendered, :ethnicity, :caste, :class]
      },
      %{
        label: "Mulli",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is directed towards a sexual and reproductive organ penis and sometimes Muslim people.",
        batch: 1,
        categories: [:gendered, :sexualized, :religion, :ethnicity]
      },
      %{
        label: "hilana",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards action of masturbating",
        batch: 1,
        categories: [:gendered, :sexualized, :other]
      },
      %{
        label: "hilaogi",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards woman to insinuate to give men a hand job",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Mlechcha",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning: "The word is directed towards people of lower caste to degrade them",
        batch: 1,
        categories: [:ethnicity, :caste, :class]
      },
      %{
        label: "harami",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The meaning says one who is born out of a wedlock or from a sex worker or one whose biological father is unknown. But it is also used casually by people in conversations.",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "gadhi",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is directed towards people who takes time to understand something or are not educated enough. Also used casually.",
        batch: 1,
        categories: [:ableist, :caste, :ethnicity]
      },
      %{
        label: "रनडwa",
        language: "Unknown",
        level_of_severity: :low,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Directed towards men whose wife has died or has no wife or also used for men who have multiple sex partners. But it is not that severe as the word Randi as it is used for men.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "🅱️ulli",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is casually used in conversations",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "kalmuhi",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Directed towards women who are considered as badluck especially widows, sex workers or women having multiple sex partners or a woman breaking sexual and gender norms.",
        batch: 1,
        categories: [:gendered, :caste]
      },
      %{
        label: "pichwada",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word means Butt and can be used in multiple situations. ",
        batch: 1,
        categories: [:body_shaming, :sexualized]
      },
      %{
        label: "jhadu",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word means broom. Used in multiple situations to degrade someone to a dirty object. ",
        batch: 1,
        categories: [:class, :caste]
      },
      %{
        label: "kaam wali bai",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is used to belittle someone using class and caste ",
        batch: 1,
        categories: [:class, :caste, :gendered]
      },
      %{
        label: "Ghatiya aurat",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the character of a woman",
        batch: 1,
        categories: [:gendered, :class]
      },
      %{
        label: "behuda aurat",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the character of a woman",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "chalu aurat",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards a modern woman.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "jhuti aurat",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards woman who lie",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "Kaali aurat",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the skin color of a woman",
        batch: 1,
        categories: [:gendered, :ethnicity, :caste, :body_shaming]
      },
      %{
        label: "Kaali bhaand",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the skin color of a woman",
        batch: 1,
        categories: [:gendered, :ethnicity, :caste]
      },
      %{
        label: "marr kyun nahi jaati",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is an insult, asking insinuating someone is better off dead",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "nalli",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards women who don't work as much or are dumb",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "dimaag se paidal",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is directed towards women who are mentally ill or not educated enough or not smart enogh",
        batch: 1,
        categories: [:gendered, :ableist]
      },
      %{
        label: "beti ka baap",
        language: "Unknown",
        level_of_severity: :low,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word in itself is not problematic but when used in a specific contexts, ex: arguments and fights it is problematic",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "bhootni",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is directed towards a person's appearnace and non-adherence to conventional beauty standards",
        batch: 1,
        categories: [:gendered, :body_shaming]
      },
      %{
        label: "bhootni ke",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards someone who is born out of a ghost woman",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "choot ke baal",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is used to degrade someone and tell that they are weak, fragile and sensitive",
        batch: 1,
        categories: [:sexualized]
      },
      %{
        label: "madarjaat",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is an insult used to shaming a person and insinuate that they engaged in sexual acts with their mother.",
        batch: 1,
        categories: [:sexualized, :caste, :other]
      },
      %{
        label: "bhadva",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to shame someone and insinuate that they sell/pimp woman.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhadvi",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to shame someone and insinuate that they sell/pimp woman.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhandve",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to shame someone and insinuate that they sell/pimp woman.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "chuchi",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the breasts of a woman",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming]
      },
      %{
        label: "tatti",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word translates to 'poop', can be used in a derogatory/casteist manner as well.",
        batch: 1,
        categories: [:caste, :class]
      },
      %{
        label: "maa ka boba chusu",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Directly translates to an adult person who breastfeeds as a way of infantalising and demeaning them.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "mooh",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word directly translates to 'mouth' and can be used in a sexualised and derogatory manner.",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "munh mein le",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is usually used by men; it is the Hindi equivalent of asking someone to suck their penis.",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "mutth",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word translates to semen/cum",
        batch: 1,
        categories: [:sexualized]
      },
      %{
        label: "najayaz paidaish",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used to insinuate that someone is born out of a wedlock or whose father is not known, i.e. a bastard",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "najayaz aulaad",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used to insinuate that someone is born out of a wedlock or whose father is not known, i.e. a bastard",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "Gutter ki paidaish",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is used to degrade someone and say they are born at a dirty and impure place.",
        batch: 1,
        categories: [:class, :caste, :religion, :ethnicity]
      },
      %{
        label: "bhikmange",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word translates to begger.",
        batch: 1,
        categories: [:class, :caste, :ethnicity]
      },
      %{
        label: "kata Lund",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "The word is directed towards men having circumcised penis especially muslim people",
        batch: 1,
        categories: [:religion, :ethnicity, :gendered]
      },
      %{
        label: "KLPD",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is used to say a woman cheated while seducing or alluring him usually used by men.",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming]
      },
      %{
        label: "Kala",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards people with darker skin tones.",
        batch: 1,
        categories: [:ethnicity, :caste, :class, :body_shaming]
      },
      %{
        label: "kali kalutti",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a racist word.",
        batch: 1,
        categories: [:body_shaming, :caste, :ethnicity]
      },
      %{
        label: "toxic aunty",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "A common term used to criticise someone, mainly women for being judgemental",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "mad",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used in casual conversations to express that someone is not normal",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "faggot",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used in a dergoatory manner to shame queer and trans people",
        batch: 1,
        categories: [:gendered, :sexual_identity, :sexualized]
      },
      %{
        label: "Sissy",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used in a dergoatory manner to shame queer and trans people",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "whore",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is used to shame women by saying that they have more than one sexual partner or is easy",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "paki",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock and bully muslim people and people from Pakistan",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "paxtani",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock and bully muslim people ",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "chinky",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning: "A racist word used towards people with east asian features",
        batch: 1,
        categories: [:ethnicity]
      },
      %{
        label: "Feminazi",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "The word is used to mock or criticise women or minority genders when they preach feminism ",
        batch: 1,
        categories: [:gendered, :political_affiliation]
      },
      %{
        label: "R@ndi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "A word that demeans a sex-worker; also used against women to insult and insinuate they are a prostitute.",
        batch: 1,
        categories: [:gendered, :sexualized, :class, :caste]
      },
      %{
        label: "pheminist",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a sexist word that targets people who speak about feminism",
        batch: 1,
        categories: [:gendered, :political_affiliation, :sexual_identity]
      },
      %{
        label: "Muzlim",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning: "The word refers to the Muslim community",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "Barbarian",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word may be used in a classist and castiest manner.",
        batch: 1,
        categories: [:ethnicity, :caste, :religion, :class]
      },
      %{
        label: "ugly",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to body shame someone",
        batch: 1,
        categories: [:body_shaming]
      },
      %{
        label: "stupid",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock someone who does something silly.",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "lunatic",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word mocks the mental condition of a person",
        batch: 1,
        categories: [:ableist, :body_shaming, :gendered]
      },
      %{
        label: "illiterate",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word is classist and castiest.",
        batch: 1,
        categories: [:caste, :class, :ethnicity, :religion]
      },
      %{
        label: "Insanity",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word mocks a mental condition and also to talk about somebody's irrational action",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "crazy",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word mocks a mental condition and also to talk about somebody's irrational action",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "camelfuckers",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This is an islamophobic slur",
        batch: 1,
        categories: [:ethnicity]
      },
      %{
        label: "bint",
        language: "Unknown",
        level_of_severity: :unknown,
        casual: nil,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "The word is an offensive way of referring to women",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "boobs",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This is used to objectify the breasts of a woman. ",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "boobies",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This word is used as a less offensive term to refer to the breasts of a woman.",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "Melons",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This is used to objectify the breasts of a woman. ",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "retarded",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock someone who does something silly.",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "r*tarded",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock someone who does something silly.",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "lesbo",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is directed towards the LGBTQIA+ community, especially lesbians.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "nigga",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "It is a racist slur word.",
        batch: 1,
        categories: [:body_shaming, :ethnicity]
      },
      %{
        label: "हिजड़ा",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "The word is used as a transphobic term but also used for and by the Hijra Community.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "रंडीखाना",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This word demeans sex work as a profession.",
        batch: 1,
        categories: [:caste, :caste, :gendered, :sexualized]
      },
      %{
        label: "कुतिया",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word may be casually used between friends, loosely translates to 'bitch'.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "कुल्टा",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a sexist term.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "भंगी",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "It is a casteist term.",
        batch: 1,
        categories: [:caste, :class]
      },
      %{
        label: "मादरचोद",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a sexist term.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "लिब्राण्डू",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "This word is used to insult people who align with the political left ideology.",
        batch: 1,
        categories: [:political_affiliation, :sexualized]
      },
      %{
        label: "बदसूरत",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock the physical appearance of people.",
        batch: 1,
        categories: [:caste, :class, :body_shaming, :ableist]
      },
      %{
        label: "बुरखा धत्त",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to target Muslim women.",
        batch: 1,
        categories: [:gendered, :sexualized, :religion, :body_shaming]
      },
      %{
        label: "गंदी नाली",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to refer to the vagina of a person.",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :class]
      },
      %{
        label: "किन्नर",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning: "The word is used to mock trans people.",
        batch: 1,
        categories: [:gendered, :body_shaming, :sexualized]
      },
      %{
        label: "भीमटा",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is a casteist slur.",
        batch: 1,
        categories: [:class, :caste, :political_affiliation]
      },
      %{
        label: "തടിച്ചി",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock a woman who is fat.",
        batch: 1,
        categories: [:body_shaming, :gendered]
      },
      %{
        label: "തടിയൻ",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to mock a man who is fat.",
        batch: 1,
        categories: [:body_shaming, :gendered]
      },
      %{
        label: "ma ki chui",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards woman, and her family. Honor being placed in one's vagina.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "maa ki chut",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards woman, and her family. Honor being placed in one's vagina.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "naachne waali",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Mocking one's profession (specifically related to dancing and performing) and also gender expression. It is also based on the type of dance one does. ",
        batch: 1,
        categories: [:gendered, :sexualized, :class, :caste]
      },
      %{
        label: "Katwa",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Targetting Islam and Islamic practice",
        batch: 1,
        categories: [:gendered, :sexualized, :religion, :ethnicity]
      },
      %{
        label: "ABLANARI",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: nil,
        meaning: "Its gendered nature; Reinforcing that women are powerless and lack agency",
        batch: 1,
        categories: [:gendered, :ableist]
      },
      %{
        label: "AblaNari",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: nil,
        meaning: "Its gendered nature; Reinforcing that women are powerless and lack agency",
        batch: 1,
        categories: [:gendered, :ableist]
      },
      %{
        label: "ablanari",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: nil,
        meaning: "Its gendered nature; Reinforcing that women are powerless and lack agency",
        batch: 1,
        categories: [:gendered, :ableist]
      },
      %{
        label: "chakka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards Trans folks  especially trans women, gay and queer men. Used to insult and ridicule them.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "Chhakka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards Trans folks  especially trans women, gay and queer men. Used to insult and ridicule them.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "jihidis",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion. ",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "jihadis",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "jihadi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "Jihidis",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "Jihadis",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "jihadi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "zehadi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "jehadan",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "jihadinon",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people to terrorize people based on the religion.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "Chakko",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards Trans folks  especially trans women, gay and queer men. Used to insult and ridicule them.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "chakki",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards Trans folks  especially trans women, gay and queer men. Used to insult and ridicule them.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "chaka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards Trans folks  especially trans women, gay and queer men. Used to insult and ridicule them.",
        batch: 1,
        categories: [:gendered, :sexual_identity]
      },
      %{
        label: "Chinal",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Directed towards sex workers, women falling in love with multiple partners or having sex with multiple people or remarried or divorced. Basically women who is not following orthodox traditional norms. It is also used to insult trans women and bisexual women. ",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :sexual_identity]
      },
      %{
        label: "Randi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards sex workers, women falling in love with multiple partners or having sex with multiple people or remarried or divorced. Basically women who is not following orthodox traditional norms. It is also used to insult trans women and bisexual women. ",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :sexual_identity]
      },
      %{
        label: "ramdi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards sex workers, women falling in love with multiple partners or having sex with multiple people or remarried or divorced. Basically women who is not following orthodox traditional norms. It is also used to insult trans women and bisexual women. ",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :sexual_identity]
      },
      %{
        label: "Randie",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards sex workers, women falling in love with multiple partners or having sex with multiple people or remarried or divorced. Basically women who is not following orthodox traditional norms. It is also used to insult trans women and bisexual women. ",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :sexual_identity]
      },
      %{
        label: "randya",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning:
          "Directed towards sex workers, women falling in love with multiple partners or having sex with multiple people or remarried or divorced. Basically women who is not following orthodox traditional norms. It is also used to insult trans women and bisexual women. ",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :sexual_identity]
      },
      %{
        label: "Gaand",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Sexual conotation to buttocks",
        batch: 1,
        categories: [:sexualized, :sexual_identity]
      },
      %{
        label: "Badchalan",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Targets women who do not follow the cis-hetro-patriarchal norms of the society.  ",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bsdk",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Sexist. Points to a person's vulva and ridiculing someone by saying they are born out of a vagina.",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming]
      },
      %{
        label: "bhosad",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: nil,
        meaning: "Directed towards women's body parts - vulva",
        batch: 1,
        categories: [:gendered, :sexualized, :class]
      },
      %{
        label: "Betichod",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "Stated in anger, directed towards a person's daughter",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "Lodu",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: nil,
        appropriation_context: nil,
        meaning: "Directed towards a man's body parts - penis",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bhenchod",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Stated in anger, directed towards a person's sister, it is said amongst male friend groups as well",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "Madarchod",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Directed towards a person's mother, to say someone who fucks their mother, it is said amongst male friend groups as well",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "bazaru",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Mocks sex work",
        batch: 1,
        categories: [:gendered, :sexualized, :class, :caste]
      },
      %{
        label: "Mulli",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Directed towards Muslim people",
        batch: 1,
        categories: [:gendered, :sexualized, :religion, :ethnicity]
      },
      %{
        label: "sau taka tunch maal",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Sexualises and objectifies a women",
        batch: 1,
        categories: [:gendered, :sexualized, :religion, :ethnicity]
      },
      %{
        label: "Chappri",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is classist and castiest",
        batch: 1,
        categories: [:caste, :class, :body_shaming]
      },
      %{
        label: "aatankwadi",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Used for a lot of Muslim people to say they are terrorists.",
        batch: 1,
        categories: [:religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "Kaali aurat",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Racist",
        batch: 1,
        categories: [:gendered, :ethnicity, :body_shaming, :caste]
      },
      %{
        label: "choot ke baal",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "To say someone is the pubic hair of vulva; it also has disgust associated with it",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming]
      },
      %{
        label: "najayaz paidaish",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Questions the legitimacy of one's blood line",
        batch: 1,
        categories: [:caste, :class, :religion, :ethnicity]
      },
      %{
        label: "ladki kahin ka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Mocks queer and trans people specially towards effeminate men, gay men and trans femme people. ",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "lovejihad",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: true,
        appropriation_context: nil,
        meaning: "Those who are in an inter-faith relationship sometimes use it ",
        batch: 1,
        categories: [:sexualized, :religion, :ethnicity, :political_affiliation]
      },
      %{
        label: "faggot",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Targets queer and trans people",
        batch: 1,
        categories: [:sexual_identity, :sexualized, :gendered]
      },
      %{
        label: "whore",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "The word whore historically referred to a person, typically a woman, who engages in sexual activity for payment. It is now used as a gendered insult primarily used to shame women, though it can be directed at anyone.  ",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming]
      },
      %{
        label: "Chinese Corona",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Racist",
        batch: 1,
        categories: [:ethnicity, :body_shaming]
      },
      %{
        label: "chinky",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "It is a derogatory and racist term used to mock or belittle people of East Asian descent or North east India. In India, using 'chinky' as a slur is a punishable offence. ",
        batch: 1,
        categories: [:ethnicity]
      },
      %{
        label: "Feminazi",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Feminazi is a word often used to mock, silence or disregard a feminist. What it does is undermine the concept of feminism. It is seen almost under every post that talks about women's rights. ",
        batch: 1,
        categories: [:gendered, :political_affiliation]
      },
      %{
        label: "Simp",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "Among teenage boys, ‘Simp’ is used as a slang for a person (typically a man/boy) who is desperate for the attention and affection of someone else (typically a woman). In other words, it is used derogatorily to criticize someone's behavior as overly submissive or weak, reinforcing certain gender stereotypes and expectations about how men should behave with women or in relationships. However it is not a slur in a traditional sense. It is also used playfully or ironically in internet culture. ",
        batch: 1,
        categories: []
      },
      %{
        label: "Characterless woman",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Questions the morals and characters of any women who does not adhere to the cis-het-patriarchal norms",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity, :ethnicity]
      },
      %{
        label: "Drama Queen",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "As a slur, it is a term used to belittle women, to disregard their emotions and truths, by suggesting they are overly dramatic. ",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "fat",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "Body shaming fat people",
        batch: 1,
        categories: [:body_shaming, :ableist]
      },
      %{
        label: "homo",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "Targets queer and trans people specifically gay, lesbian and trans folks.",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "boobs",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: nil,
        appropriation_context: nil,
        meaning:
          "The word is usually used to sexualise female bodies specifically the breasts. We might have come across online comments under women's posts regardless of the age and type of content. For example nice boobs, etc.",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "nasty",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "It is a term used to describe something unpleasant.",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "poop",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "A childish word for faeces and is usually used to make fun of someone. ",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "slave",
        language: "Unknown",
        level_of_severity: :high,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word 'slave' refers to 'a person who is forced to work for and obey another and is considered to be their property; an enslaved person.' The term has deep association with dehumanization, oppression of people, especially African people. It is linked to the transatlantic slave trade and the enslavement of millions of African people and others throughout history.",
        batch: 1,
        categories: [:other, :ethnicity]
      },
      %{
        label: "mothafucka",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "It is an abusive term used same as 'motherfucker'. It is rarely used in a literal way, which, under a standard reading, would mean an incestuous relationship with one's own mother. Mothafucka is also trying to imitate accent of black people and trying to make fun of their accent.",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "nastyho",
        language: "Unknown",
        level_of_severity: :medium,
        casual: nil,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The term nastyho combines the terms 'Nasty' and 'Ho'. The term Ho is a derogatory term (whore) used to refer to a sexworker. ",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "ragheads",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The term ragheads is a derogatory and offensive slang used to insult and demean individuals, typically targeting those who wear turbans or similar headwear. It has been used particularly against Sikh and Muslim communities, among others, where turbans or head coverings are part of religious or cultural attire.",
        batch: 1,
        categories: [:religion, :ethnicity]
      },
      %{
        label: "diaper-heads",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The term diaperheads is a derogatory and offensive slang used to insult and demean individuals, typically targeting those who wear turbans or similar headwear. It has been used particularly against Sikh and Muslim communities, among others, where turbans or head coverings are part of religious or cultural attire.",
        batch: 1,
        categories: [:religion, :ethnicity]
      },
      %{
        label: "wh@re child",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word whore historically referred to a person, typically a woman, who engages in sexual activity for payment. The term whore child is a gendered insult towards someone to shame or ridicule someone and to say they are a child of a sex worker.",
        batch: 1,
        categories: [:sexualized, :gendered, :class, :sexual_identity]
      },
      %{
        label: "nigga",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "A racial slur used against Black People, rooted in a a history of violence, discrimination, and systemic injustice against Black people",
        batch: 1,
        categories: [:ethnicity]
      },
      %{
        label: "niggers",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "A racial slur used against Black People, rooted in a a history of violence, discrimination, and systemic injustice against Black people",
        batch: 1,
        categories: [:ethnicity]
      },
      %{
        label: "हिजड़ा",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning:
          "Hijra is also a cultural identity and the fact that it is used as a slur for trans people makes it problematic",
        batch: 1,
        categories: [:gendered, :sexualized, :body_shaming, :other]
      },
      %{
        label: "नपुंसक",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Makes fun of the fertility of a man",
        batch: 1,
        categories: [:gendered, :sexualized, :ableist]
      },
      %{
        label: "छक्का",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "Mocks queer and trans people",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "भंगी",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "Castiest",
        batch: 1,
        categories: [:caste, :class]
      },
      %{
        label: "बाज़ारू औरत",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Sexualises a woman and questions her morality from a cis-hetero-patriarchal lens. ",
        batch: 1,
        categories: [:gendered, :sexualized]
      },
      %{
        label: "गंदी नाली",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "Derogates a AFAB person's vagina or castist slur directed towards marginalised caste or someone who is engaged with sex work or sex workers in some way or the other.",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :class]
      },
      %{
        label: "हिज़रापंती",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Mocks queer and trans people",
        batch: 1,
        categories: [:gendered, :sexualized, :sexual_identity]
      },
      %{
        label: "तवाइफ़",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Mocks one's gender expression and occupation especially directed towards sex workers or who does dance performances publicly for money.",
        batch: 1,
        categories: [:gendered, :sexualized, :caste, :class]
      },
      %{
        label: "भीमटी",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: true,
        appropriation_context: true,
        meaning: "Castiest. Directed towards Dalit and Bahujan people or ambedkarite people",
        batch: 1,
        categories: [:political_affiliation, :caste]
      },
      %{
        label: "बैल बुद्धि",
        language: "Unknown",
        level_of_severity: :medium,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Mocks people with mental disabilities",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "नाजायज़",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: true,
        appropriation_context: false,
        meaning:
          "Questions the legitimacy in terms of tracing one's blood relation; questions a AFAB person's morality when they become a parent",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "काले तवे",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning: "Racist",
        batch: 1,
        categories: [:ethnicity, :caste]
      },
      %{
        label: "പൊട്ടൻ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word means dumb or deaf but it is usually used to describe someone stupid. Even young kids use it in Kerala. It becomes problematic as it mocks the disability. ",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "വെടി",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is often used by cis men to describe a woman who is attractive or is easy. We hear this often in guys' group chats and as comments under the images of women.",
        batch: 1,
        categories: [:sexualized, :gendered]
      },
      %{
        label: "കഴുത",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The meaning of the word is 'donkey' and is used to mock someone when they do something stupid.",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "കെഴങ്ങൻ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to call a man stupid.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "തടിച്ചി",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The meaning of the word is 'fatty' and it is used to body shame women.",
        batch: 1,
        categories: [:gendered, :body_shaming]
      },
      %{
        label: "തടിയൻ",
        language: "Unknown",
        level_of_severity: :medium,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The meaning of the word is 'fatty' and it is used to body shame men.",
        batch: 1,
        categories: [:gendered, :body_shaming]
      },
      %{
        label: "പട്ടി",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The meaning of the word is 'dog' and it is used to demean someone. It is a pretty casual word, even used by kids in Kerala.",
        batch: 1,
        categories: [:religion]
      },
      %{
        label: "പുല്ല്",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word literally means 'grass' and it is used when something goes wrong.",
        batch: 1,
        categories: [:other]
      },
      %{
        label: "പൊട്ടൻ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word means 'someone retarded'. It is used to demean someone when they act stupid.",
        batch: 1,
        categories: [:ableist]
      },
      %{
        label: "പോടാ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word means 'get lost' and is directed at someone when the other person is anoyed.",
        batch: 1,
        categories: [:gendered, :other]
      },
      %{
        label: "പോടീ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to ask a woman to get lost.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "മണ്ടന്‍",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The meaning of the word is 'stupid person' and it is used to mock someone who does something stupid.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "മരമണ്ടൻ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The meaning of the word is 'stupid person' and it is used to mock someone who does something stupid.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "മൊണ്ണ",
        language: "Unknown",
        level_of_severity: :low,
        casual: true,
        appropriated: false,
        appropriation_context: nil,
        meaning: "The word is used to call someone stupid.",
        batch: 1,
        categories: [:gendered]
      },
      %{
        label: "വെടി",
        language: "Unknown",
        level_of_severity: :high,
        casual: false,
        appropriated: false,
        appropriation_context: nil,
        meaning:
          "The word is used to defame a woman characterless; a woman who sleeps around. It is similar to the word slut.",
        batch: 1,
        categories: [:gendered, :sexualized]
      }
    ]
    |> Enum.map(&PublicDataset.create_plugin_slur_metadata(&1))
  end
end
