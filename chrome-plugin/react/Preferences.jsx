/*global chrome*/
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Form,
  FormField,
  TextInput,
  TextArea,
  Text,
  Button,
  Select,
  CheckBox,
} from "grommet";
import config from "./config";
import Api from "./Api";
import repository from "./repository";
import { useTranslation } from "react-i18next";
import chrome from "./chrome";
import { langNameMap } from "./language";

const { getPreferenceForUser, savePreference } = Api;
import { UserContext, NotificationContext } from "./AppContext";
const { setPreferenceData, getPreferenceData } = repository;

const defaultValue = {};

export function Preferences() {
  const [localPreferences, setLocalPreferences] = useState(defaultValue);
  const { user, setUser } = useContext(UserContext);
  const { notification, showNotification } = useContext(NotificationContext);
  const [enable, setEnable] = useState(true);
  const [storeLocally, setStoreLocally] = useState(false);
  const [language, setLanguage] = useState("English");
  const { t, i18n } = useTranslation();

  // GET PREFERENCE FOR THIS USER FROM LS
  useEffect(async () => {
    try {
      const preference = await getPreferenceData();
      setLocalPreferences(preference);
      const { enable, storeLocally, language } = preference;
      if (enable != undefined) {
        setEnable(enable);
      }
      if (storeLocally != undefined) {
        setStoreLocally(storeLocally);
      }
      if (language != undefined) {
        setLanguage(language);
      }
    } catch (err) {
      showNotification({
        type: "error",
        message: t("message_error_preference_data_load"),
      });
      alert(err);
    }
  }, [user]);

  async function clickSave(preference) {
    console.log({ user, preference });
    try {
      await savePreference(user.accessToken, preference);
      await setPreferenceData({
        ...preference,
        enable,
        storeLocally,
        language,
      });
      showNotification({ type: "message", message: t("message_ok_saved") });
      chrome.sendMessage("updateData", undefined);
    } catch (err) {
      alert(err);
      showNotification({
        type: "error",
        message: t("message_error_preference_data_save"),
      });
    }
  }
  async function clickTest() {
    console.log(user);
  }

  async function changeLanguage(option) {
    setLanguage(option);
    i18n.changeLanguage(langNameMap[option]);
  }

  async function changeLocalStorageOption(checked) {
    setStoreLocally(checked);
  }

  return (
    <Box width="medium" gap={"small"}>
      {/* <CheckBox
        checked={enable}
        label={t("enable_plugin")}
        onChange={(e) => setEnable(e.target.checked)}
      /> */}
      <CheckBox
        checked={storeLocally}
        label={t("store_locally")}
        onChange={(e) => changeLocalStorageOption(e.target.checked)}
      />

      <Box width={"small"} direction="row" gap={"medium"} align="center">
        <Text>{t("language")}</Text>
        <Select
          options={["English", "Tamil", "Hindi"]}
          value={language}
          onChange={({ option }) => {
            changeLanguage(option);
          }}
          size={"small"}
        />
      </Box>

      <Box
        height={"2px"}
        background={"dark-4"}
        margin={{ top: "1em", bottom: "2em" }}
      />
      <Form
        value={localPreferences}
        onChange={(nextValue, { touched }) => {
          setLocalPreferences(nextValue);
        }}
        onSubmit={({ value }) => {
          clickSave(value);
        }}
        onReset={() => setLocalPreferences(defaultValue)}
      >
        {/* <FormField
          name="language"
          htmlFor="languageId"
          label={t("language")}
          component={Select}
          options={["English", "Tamil", "Hindi"]}
          disabled={!enable}
          onChange={()=>{}}
        /> */}
        <FormField
          name="email"
          htmlFor="emailId"
          label={t("your_email_address")}
          type="email"
          disabled={!enable}
          component={TextInput}
        />
        <FormField
          name="friends"
          htmlFor="friendsId"
          label={t("friends")}
          disabled={!enable}
          component={TextArea}
        />
        <FormField
          name="slurList"
          htmlFor="slurListId"
          label={t("your_slur_list")}
          disabled={!enable}
          component={TextArea}
        />
        <Box
          margin={{ top: "medium" }}
          direction="row"
          gap={"small"}
          justify="start"
        >
          <Button fill={false} label={t("save")} type="submit" primary />

          {/* <Button onClick={() => console.log("clicked")} /> */}
        </Box>
      </Form>
    </Box>
  );
}
