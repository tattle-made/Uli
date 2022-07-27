import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      app_name: "Uli",
      section_hero_head: "Moderate Your Twitter Feed",
      section_hero_subhead:
        "Uli lets you take control over your Twitter timeline by redacting slurs, allowing you to archive problematic tweets and coordinating actions with your friends.",
      section_hero_cta: "Add to Browser",
      section_hero_cta_subhead: "supported on Chrome and Brave",
      section_feature_head: "Features",
      section_feature_1_label: "ARCHIVE TWEETS",
      section_feature_1_head:
        "Archive tweets as evidence, to build a discourse or mobilise.",
      section_feature_1_description:
        "Uli provides an easy mechanism to take screenshots of offending tweets. These tweets can be stored locally or sent as an email to yourself.",
      section_feature_1_follow_up:
        "This crowdsourced list of offensive phrases is dynamic and each user can gather around with Uli and help build a longer list.",
      section_feature_2_label: "SLUR REPLACEMENT",
      section_feature_2_head:
        "Automatic blurring of slurs in Hindi, English and Tamil",
      section_feature_2_description:
        "Uli uses a crowdsourced list of slurs in Indian languages and detects them in your tweet and hides them in real-time.",
      section_feature_2_follow_up:
        " This crowdsourced list of offensive phrases is dynamic and each user can gather around with Uli and help build a longer list.",
      section_feature_3_label: "INVOKE NETWORK",
      section_feature_3_head: "You are not alone in this.",
      section_feature_3_description:
        "Involve your friends and community to act on problematic tweets and combat online hate speech.",
      section_feature_3_follow_up:
        "This feature will invite people to support each other, share stories, initiate conversations around intermediary responsibility and interpersonal relationships and what it means to be online.",
      section_resources_label: "RESOURCES",
      section_resources_description:
        "We will also add a few resources such as Twitter's community guidelines, a digital safety guidelines as well as a legal resource document that builds critical legal literacy to help tackle instances of hate speech and harassment. All these resources will be made available in Hindi, Tamil and English.",
      section_cta_head: "is now available on Chrome Store to try out.",
      section_cta_primary: "INSTALL NOW",
      section_cta_secondary: "LEARN HOW TO USE",
    },
  },
  hi: {
    translation: {
      app_name: "Uli2",
      section_hero_head: "अपने ट्विटर फ़ीड का नियंत्रण खुद करें ",
      section_hero_subhead:
        " उली के साथ  आप अपनी  ट्विटर टाइमलाइन का नियंत्रण खुद कर सकते हैं,  समस्याग्रस्त ट्वीट्स को संग्रहित कर सकते हैं और अपने दोस्तों से मदद माँग सकते हैं। ",
      section_hero_cta: "Add to Browser",
      section_hero_cta_subhead: "supported on Chrome and Brave",
      section_feature_head: "उली की विशेषताएं",
      section_feature_1_label: "भद्दे ट्वीट संग्रहित करें:",
      section_feature_1_head:
        "सबूत एकत्रित करने के लिए या दुसरो के साथ साझा करके नफरत और हिंसा फ़ैलाने वाले पोस्ट्स के खिलाफ बातचीत शुरू करने  के लिए आप उली की मदद से पोस्ट संगृहीत कर सकते हैं। ",
      section_feature_1_description:
        "उली आपत्तिजनक ट्वीट्स के स्क्रीनशॉट आसानी से ले सकता है । इन ट्वीट्स को स्थानीय रूप से संग्रहीत किया जा सकता है या आप खुद को ईमेल के रूप में भेज सकतें हैं।",
      section_feature_1_follow_up:
        "This crowdsourced list of offensive phrases is dynamic and each user can gather around with Uli and help build a longer list.",
      section_feature_2_label: "भद्दे शब्दों या वाक्यांशों को छिपाना",
      section_feature_2_head:
        "उली भद्दे शब्दों की एक सूची के उपयोग से आपकी ट्विटर टाइमलाइन से उन शब्दों को वास्तविक समय में छिपा सकता है । यह फीचर आपके डायरेक्ट मैसेज पर भी काम करता है। ",
      section_feature_2_description:
        "आपत्तिजनक वाक्यांशों की यह सूची और भी बड़ी हो सकती है और प्रत्येक यूज़र उली के साथ मिलकर एक लंबी सूची बुनने में मदद कर सकतें है। सूचि में और शब्द जोड़ने के  लिए या इस सूचि के बारे में और जानकारी के लिए यहाँ क्लिक करें।",
      section_feature_2_follow_up: "",
      section_feature_3_label: "अपने साथियों को एलर्ट करें",
      section_feature_3_head: "इसमें आप अकेले नहीं हैं",
      section_feature_3_description:
        "समस्याग्रस्त ट्वीट्स पर कार्रवाई करने और ऑनलाइन अभद्र भाषा का मुकाबला करने के लिए अपने मित्रों और समुदाय को शामिल करें।",
      section_feature_3_follow_up:
        "हमारी उम्मीद है की यह फीचर लोगों को इकट्ठा होने, एक-दूसरे का समर्थन करने, सोशल मीडिया कंपनियों और पारस्परिक संबंधों की जिम्मेदारी, और ऑनलाइन हमारे अनुभवों के बारे में बातचीत शुरू करने में मदद कर सकेगा।",
      section_resources_label: "RESOURCES",
      section_resources_description:
        "We will also add a few resources such as Twitter's community guidelines, a digital safety guidelines as well as a legal resource document that builds critical legal literacy to help tackle instances of hate speech and harassment. All these resources will be made available in Hindi, Tamil and English.",
      section_cta_head: "Chrome स्टोर पर उपलब्ध है।",
      section_cta_primary: "अभी इनस्टॉल करें",
      section_cta_secondary: "उपयोग करना सीखें",
    },
  },
  ta: {
    translation: {
      app_name: "Uli tamil",
      section_hero_head: "உங்கள் ட்விட்டர் ஃபீடை மதிப்பாய்வு செய்யவும்",
      section_hero_subhead:
        "அவமதிப்பான / தெளிவில்லாத பேச்சு/சொற்களை திருத்துவதன் மூலமும், சிக்கலான ட்வீட்களைக் ஆர்க்கைவ் செய்வதன்மூலமும், உங்கள் நண்பர்களுடன் செயல்களை ஒருங்கிணைப்பதன் மூலமும், உளி உங்கள் ட்விட்டர் டைம்லைனை கட்டுப்படுத்த உதவுகிறது.",
      section_hero_cta: "ப்ரௌசரில் சேர்க்கவும்",
      section_hero_cta_subhead: "Chrome மற்றும் Brave இல் ஆதரிக்கப்படுகிறது",
      section_feature_head: "Features",
      section_feature_1_label: "ஆர்க்கைவ் டிவீட்ஸ்",
      section_feature_1_head:
        "ஒரு விவாதத்தை உருவாக்க அல்லது அணிதிரட்ட, ட்வீட்களை ஆதாரமாக ஆர்க்கைவ் செய்யவும்",
      section_feature_1_description:
        "புண்படுத்தும் ட்வீட்களின் ஸ்கிரீன்ஷாட்களை எடுக்க உளி எளிதான வழிமுறையை வழங்குகிறது. இந்த ட்வீட்களை உள்நாட்டில் சேமிக்கலாம் அல்லது உங்களுக்கே மின்னஞ்சலாக அனுப்பலாம்.",
      section_feature_1_follow_up:
        "எதிர்காலத்தில், பயனர்களால் ஆர்க்கைவ் செய்யப்பட்ட ட்வீட்களின் அடையாளமற்ற பொது களஞ்சியத்தை உருவாக்குவோம் என்று நம்புகிறோம். இந்தக் காப்பகம் எங்கள் டிஜிட்டல் அறையாக இருக்கும், அங்கு நாங்கள் சமூக ஊடகங்களில் இருந்த அனுபவத்தைச் சேகரித்து விவரிக்கிறோம்.",
      section_feature_2_label: "அவமதிப்பான",
      section_feature_2_head:
        "ஹிந்தி, ஆங்கிலம்/இங்கிலீஷ் மற்றும் தமிழில் அவமதிப்பான ",
      section_feature_2_description:
        "உளி , இந்திய மொழிகளில் குழு அமைப்பு செய்யப்பட்ட அவமதிப்பான / தெளிவில்லாத பேச்சு/சொற்களின் பட்டியலைப் பயன்படுத்துகிறது மற்றும் அவற்றை உங்கள் ட்வீட்டில் கண்டறிந்து அவற்றை ரியல் -டைம் அடிப்படையில் மறைக்கிறது.",
      section_feature_2_follow_up:
        "தெளிவில்லாத பேச்சு/சொற்களின் பட்டியல் மிகவும் பெரிது மற்றும் ஒவ்வொரு பயனரும் உளியுடன் ஒன்றுகூடி அந்த பட்டியலை இன்னும் பெரிதாக்க உதவலாம்.",
      section_feature_3_label: "நெட்வொர்க்கை அழைக்கவும்",
      section_feature_3_head: "இதில் நீங்கள் தனியாக இல்லை",
      section_feature_3_description:
        "பிரச்சனைக்குரிய ட்வீட்களில் செயல்பட உங்கள் நண்பர்களையும் சமூகத்தையும் ஈடுபடுத்துங்கள் மற்றும் ஆன்லைன் வெறுப்பூட்டும் பேச்சை எதிர்த்துப் போராடுங்கள்.",
      section_feature_3_follow_up:
        "இந்த அம்சம் மக்களை ஒருவரையொருவர் ஆதரிக்கவும், கதைகளைப் பகிரவும், இடைத்தரகர் பொறுப்பு மற்றும் தனிப்பட்ட உறவுகளைப் பற்றிய உரையாடல்களைத் தொடங்கவும், ஆன்லைனில் இருப்பதன் அர்த்தம் என்ன என்பதை உணர்த்தும் வகையில் மக்களை அழைக்கும்.",
      section_resources_label: "வளங்கள்",
      section_resources_description:
        "ட்விட்டரின் சமூக வழிகாட்டுதல்கள், டிஜிட்டல் பாதுகாப்பு வழிகாட்டுதல்கள் மற்றும் வெறுக்கத்தக்க பேச்சு மற்றும் துன்புறுத்தல் போன்ற நிகழ்வுகளைச் சமாளிக்க முக்கியமான சட்டக் கல்வியறிவை உருவாக்கும் சட்ட ஆதார ஆவணம் போன்ற சில ஆதாரங்களையும் நாங்கள் சேர்ப்போம். இந்த ஆதாரங்கள் அனைத்தும் இந்தி, தமிழ் மற்றும் ஆங்கிலத்தில் கிடைக்கும்.",
      section_cta_head: "இப்போது க்ரோம் ஸ்டோரில் சரிபார்க்க",
      section_cta_primary: "இப்போது இன்ஸ்டால்",
      section_cta_secondary: "LEARN HOW TO USE",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
