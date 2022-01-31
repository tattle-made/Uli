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

  // GET PREFERENCE FOR THIS USER FROM LS
  useEffect(async () => {
    try {
      const preference = await getPreferenceData();
      setLocalPreferences(preference);
      const { enable, storeLocally } = preference;
      if (enable != undefined) {
        setEnable(enable);
      }
      if (storeLocally != undefined) {
        setStoreLocally(storeLocally);
      }
    } catch (err) {
      showNotification({
        type: "error",
        message: "Could not load Preference",
      });
      alert(err);
    }
  }, [user]);

  async function clickSave(preference) {
    console.log({ user, preference });
    try {
      await savePreference(user.accessToken, preference);
      await setPreferenceData({ ...preference, enable, storeLocally });
      showNotification({ type: "message", message: "Saved" });
    } catch (err) {
      alert(err);
      showNotification({ type: "error", message: "Could not save preference" });
    }
  }
  async function clickTest() {
    console.log(user);
  }
  return (
    <Box width="medium" gap={"small"}>
      <CheckBox
        checked={enable}
        label={"Enable Plugin"}
        onChange={(e) => setEnable(e.target.checked)}
      />
      <CheckBox
        checked={storeLocally}
        label={"Store Tweets Locally"}
        onChange={(e) => setStoreLocally(e.target.checked)}
      />

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
        <FormField
          name="language"
          htmlFor="languageId"
          label={"Language"}
          component={Select}
          options={["English", "Tamil", "Hindi"]}
          disabled={!enable}
        />
        <FormField
          name="email"
          htmlFor="emailId"
          label={"Your Email"}
          type="email"
          disabled={!enable}
          component={TextInput}
        />
        <FormField
          name="friends"
          htmlFor="friendsId"
          label={"Friends"}
          disabled={!enable}
          component={TextArea}
        />
        <FormField
          name="slurList"
          htmlFor="slurListId"
          label={"Your Slur List"}
          disabled={!enable}
          component={TextArea}
        />
        <Box
          margin={{ top: "medium" }}
          direction="row"
          gap={"small"}
          justify="start"
        >
          <Button fill={false} label="Save" type="submit" primary />

          {/* <Button onClick={() => console.log("clicked")} /> */}
        </Box>
      </Form>
    </Box>
  );
}
