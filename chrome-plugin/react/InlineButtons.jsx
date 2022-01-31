import { useEffect, useState } from "react";
import { Grommet, Box, Text, Button, TextArea, Layer, Spinner } from "grommet";
import { Archive, Users, Activity } from "react-feather";
import config from "./config";
import Api from "./Api";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import Theme from "./Theme";
import repository from "./repository";
const { getUserData, getPreferenceData } = repository;

const { uploadArchivedMedia, invokeNetwork } = Api;

const accessToken = "e3be8fa9-7ec7-11ec-a714-0242ac140002";

const CTAButton = ({ icon, label, onClick }) => {
  return (
    <Box
      round
      pad={{
        top: "xsmall",
        bottom: "xsmall",
        left: "medium",
        right: "medium",
      }}
      hoverIndicator={"neutral-1"}
      focusIndicator={false}
      border={{ color: "neutral-1" }}
      onClick={onClick}
      direction={"row"}
      gap={"medium"}
      align="center"
    >
      {icon}
      <Text size={"medium"} color={"brand"}>
        {label}
      </Text>
    </Box>
  );
};

export function InlineButtons({ node }) {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [progress, showProgress] = useState(false);
  const [notification, setNotification] = useState(undefined);

  const [userLS, setUserLS] = useState(undefined);
  const [preferenceLS, setPreferenceLS] = useState(undefined);

  function showNotification(notification) {
    setNotification(notification);
    setTimeout(() => {
      setNotification(undefined);
    }, 2000);
  }

  useEffect(async () => {
    console.log("setting data for content script");
    const userData = await getUserData();
    const preferenceData = await getPreferenceData();
    console.log({ userData, preferenceData });
    setUserLS(userData);
    setPreferenceLS(preferenceData);
  }, []);

  function clickArchive() {
    console.log("clicked archive");
    try {
      showProgress(true);
      let mainNode = document.getElementsByTagName("main")[0];
      let tweetCount = document.getElementsByTagName("article").length;

      domtoimage
        .toBlob(mainNode)
        .then(async function (blob) {
          if (preferenceLS.storeLocally) {
            saveAs(
              blob,
              `ogbv_plugin_tweet_${new Date()
                .toTimeString()
                .split(" ")
                .join("_")}.png`
            );
          }
          var formData = new FormData();
          formData.append("screenshot", blob);
          formData.append("url", location.href);
          // await uploadArchivedMedia(accessToken, formData);
          await uploadArchivedMedia(userLS.accessToken, formData);
          showProgress(false);
        })
        .catch((err) => {
          showProgress(false);
          showNotification({ message: "Error in archiving post." });
        });
    } catch (err) {
      showProgress(false);
      showNotification({ message: "Error in archiving post." });
    }
  }
  function clickInvokeNetwork() {
    console.log("clicked invoke network");
    setShowPopup(true);
  }

  async function clickSend() {
    try {
      await invokeNetwork(userLS.accessToken, message, location.href);
    } catch {
      console.log("Error invoking network");
    } finally {
      setShowPopup(false);
    }
  }

  function clickTest() {
    console.log("test clicked");
    console.log(chrome);
    // chrome.storage.local.set({ "ogbv-data": "Your data" }, function (result) {
    //   console.log(" Data saved ");
    // });
    console.log("getting value in Content Script");
    chrome.storage.local.get(["ogbv-data"], function (result) {
      console.log("Value currently is " + result.key);
      console.log(result);
    });
  }

  return (
    <Grommet theme={Theme}>
      <Box
        direction={"row"}
        gap={"small"}
        align="center"
        margin={{ bottom: "small" }}
        pad={"xsmall"}
      >
        <CTAButton
          icon={<Archive size={24} color="#ff006e" />}
          label={"Archive"}
          onClick={clickArchive}
        />

        <CTAButton
          icon={<Users size={24} color="#ff006e" />}
          label={"Invoke Network"}
          onClick={clickInvokeNetwork}
        />

        {progress ? <Spinner /> : null}
        {notification ? (
          <Text color={"brand"}>{notification.message}</Text>
        ) : null}

        {showPopup ? (
          <Layer
            onEsc={() => setShowPopup(false)}
            onClickOutside={() => setShowPopup(false)}
          >
            <Box width={"medium"} gap={"medium"} margin={"large"}>
              <TextArea
                placeholder={"hey can you help me report this post?"}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              ></TextArea>
              <Box direction={"row"} gap={"small"}>
                <Button label="Cancel" onClick={() => setShowPopup(false)} />
                <Button
                  label="Send"
                  onClick={() => {
                    clickSend();
                  }}
                  primary
                />
              </Box>
            </Box>
          </Layer>
        ) : null}
      </Box>
    </Grommet>
  );
}
