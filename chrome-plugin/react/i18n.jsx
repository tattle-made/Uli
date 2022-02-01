import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      app_name: "OGBV Plugin",
      navigation_preferences: "Preferences",
      navigation_archive: "Archive",
      navigation_resources: "Resources",
      navigation_debug: "Debug",
      activate_account: "Activate Account",
      user_guide: "User Guide",
      mental_health: "Mental Health Resources",
      legal_resources: "Legal Resources",
      report_tweet: "Report Tweet",
      enable_plugin: "Enable Plugin",
      store_locally: "Store Tweets On Computer",
      language: "Language",
      your_email_address: "Your Email Address",
      friends: "Friends",
      your_slur_list: "Your Slur List",
      save: "Save",
      reset_account: "Reset Account",
      reset_confirmation: "I am sure I want to reset this account",
      reset_button: "Reset",
      message_no_user: "Can not find a logged in User",
      message_error_local_storage: "Unable to fetch data from Local Storage",
      message_error_config_data: "Unable to fetch data from Config",
      message_error_preference_data_load: "Could not load Data",
      message_ok_saved: "Saved",
      message_error_preference_data_save: "Could not save preference",
      message_archive_empty: "Looks like you haven't started archiving yet.",
      archive: "Archive",
      ask_friends_for_help: "Ask Friends for Help",
    },
  },
  hi: {
    translation: {
      app_name: "ओजीबीवी प्लगइन",
      navigation_preferences: "प्राथमिकताऐं",
      navigation_archive: "संग्रह",
      navigation_resources: "अन्य संसाधन",
      navigation_debug: "डीबग",
      activate_account: "खाते को सक्रिय करें",
      user_guide: "यूजर गाइड",
      mental_health: "मानसिक स्वास्थ्य से जुड़े संसाधन",
      legal_resources: "कानूनी संसाधन",
      report_tweet: "रिपोर्ट ट्वीट",
      enable_plugin: "प्लग-इन को चालू करें",
      store_locally: "कंप्यूटर पर ट्वीट्स स्टोर करें",
      language: "भाषा",
      your_email_address: "आपका ईमेल पता",
      friends: "आपके साथी",
      your_slur_list: "आपकी अभद्र शब्दों की सूची",
      save: "सहेजें",
      reset_account: "खाता रीसेट करें",
      reset_confirmation: "हाँ, इस खाते को रीसेट करें।",
      reset_button: "रीसेट",
      message_no_user: "लॉग इन उपयोगकर्ता नहीं मिल रहा है",
      message_error_local_storage:
        "स्थानीय संग्रहण से डेटा प्राप्त करने में असमर्थ",
      message_error_config_data: "कॉन्फिग से डेटा लाने में असमर्थ",
      message_error_preference_data_load: "डेटा लोड नहीं हो सका",
      message_ok_saved: "प्राथमिकताऐं सहेजी गई",
      message_error_preference_data_save: "प्राथमिकताऐं सहेजी नहीं जा सकी",
      message_archive_empty:
        "ऐसा लगता है कि आपने अभी तक संग्रह करना शुरू नहीं किया है।",
      archive: "संगृहीत करे",
      ask_friends_for_help: "दोस्तों से मदद मांगे",
    },
  },
  ta: {
    translation: {
      app_name: "OGBV Plugin",
      navigation_preferences: "முன்னுரிமைகள்",
      navigation_archive: "சுவடிக்கூடம்",
      navigation_resources: "வழிவகைகள்",
      navigation_debug: "பிழை திருத்து",
      activate_account: "கணக்கை செயல்படுத்தவும்",
      user_guide: "பயனர் கையேடு",
      mental_health: "மனநல வளங்கள்",
      legal_resources: "சட்ட வளங்கள்",
      report_tweet: "ட்வீட் அறிக்கை",
      enable_plugin: "செருகுநிரலை இயக்கு",
      store_locally: "ட்வீட்களை கணினியில் சேமிக்கவும்",
      language: "மொழி",
      your_email_address: "உங்கள் மின்னஞ்சல் முகவரி",
      friends: "நன்பர்கள்",
      your_slur_list: "உங்கள் குழம்பு பட்டியல்",
      save: "சேமி",
      reset_account: "கணக்கு",
      reset_confirmation:
        "இந்தக் கணக்கை அழிக்க விரும்புகிறேன் என்று நான் நம்புகிறேன்",
      reset_button: "மீட்டமை",
      message_no_user: "உள்நுழைந்த பயனரைக் கண்டுபிடிக்க முடியவில்லை",
      message_error_local_storage:
        "உள்ளூர் சேமிப்பகத்திலிருந்து தரவைப் பெற முடியவில்லை",
      message_error_config_data: "கட்டமைப்பிலிருந்து தரவைப் பெற முடியவில்லை",
      message_error_preference_data_load:
        "விருப்பத்திலிருந்து தரவை ஏற்ற முடியவில்லை",
      message_ok_saved: "சேமிக்கப்பட்டது",
      message_error_preference_data_save: "விருப்பத்தை சேமிக்க முடியவில்லை",
      message_archive_empty:
        "நீங்கள் இன்னும் காப்பகத்தை தொடங்கவில்லை போல் தெரிகிறது.",
      archive: "காப்பகப்படுத்தப்பட்டது",
      ask_friends_for_help: "நண்பர்களிடம் உதவி கேளுங்கள்",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "hi", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
