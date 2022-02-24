import React, { useEffect, useState } from "react";
import { graphql, navigate } from "gatsby";
import { Annotator, ANNOTATOR_STATUS } from "../controller/annotator";
import { Grommet, Header, Box, Text, Button, TextArea, Stack } from "grommet";
// import ReactJson from "react-json-view";
import TattleLogo from "../components/atoms/TattleLogo";
import TattleTheme from "../components/atoms/Theme";
import { LinkNext, LinkPrevious, Notification } from "grommet-icons";
import ReactRadioButtonGroup from "react-radio-button-group";
import { SimplePost } from "../components/atoms/SimplePost";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import {
  getUserFromLS,
  getUserSessionFromLS,
  isLoggedIn,
  logoutUser,
} from "../repository/user";
import { NoteworthyModal } from "../components/NoteWorthyModal";
import { NotificationFeed } from "../components/NotificationFeed";
import { AppFooter } from "../components/Footer";

var annotator;

/**
 * Notification is undefined or {type : info|error, text : ""}
 */

export default function PostAnnotator() {
  const { t } = useTranslation();
  const { languages, changeLanguage } = useI18next();
  const [debugMessage, setDebugMessage] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [pageStatus, setPageStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [post, setPost] = useState(undefined);
  const [notification, setNotification] = useState(undefined);
  const [status, setStatus] = useState(ANNOTATOR_STATUS.LOADING_PAGE);
  const [noteworthyMessage, setNoteworthyMessage] = useState(undefined);
  const [notificationFeed, setNotificationFeed] = useState([]);
  const [notificationFeedVisibility, setNotificationFeedVisibility] =
    useState(false);

  useEffect(() => {
    async function setupAnnotator() {
      if (await isLoggedIn()) {
        const user = await getUserFromLS();
        let session = await getUserSessionFromLS();
        session = session ? session : undefined;
        console.log({ SESSION: session });
        const lang = user.lang;
        console.log({ lang });
        changeLanguage(lang);
        annotator = new Annotator({ id: user.id }, session);
        await annotator.setup();
        await refresh();
      } else {
        navigate("/login");
      }
    }
    // check if user is logged in

    setupAnnotator();
  }, []);

  function changeAnnotation(key, value) {
    setAnnotations({
      ...annotations,
      [key]: {
        id: annotations[key] ? annotations[key].id : undefined,
        value,
        key,
      },
    });
  }

  async function refresh() {
    setStatus(ANNOTATOR_STATUS.LOADING_PAGE);
    const { data, error } = await annotator.makePageData(
      annotator.session.postId
    );
    if (error) {
      showNotification("error", error.message);
      setStatus(ANNOTATOR_STATUS.ERROR_MAKE_PAGE_DATA);
    } else {
      if (data != undefined) {
        const { annotations, pageStatus, post, userStatus } = data;
        // console.log("----");
        // console.log(annotations);
        // console.log("----");
        setAnnotations(annotations);
        setPageStatus(pageStatus);
        setDebugMessage(annotator.state);
        setPost(post);
        setUserStatus(userStatus);
        setStatus(ANNOTATOR_STATUS.OK);
      }
    }
  }

  function showNotification(type, text) {
    setNotification({
      type,
      text,
    });
    setTimeout(
      () => {
        setNotification(undefined);
      },
      type === "info" ? 750 : 2500
    );
  }

  async function goToNextPage() {
    setNoteworthyMessage(undefined); // This is to reset any unacknowledged messages
    if (!annotator.isFormFilled(annotations)) {
      setNoteworthyMessage(
        ANNOTATOR_STATUS.makeMessage(ANNOTATOR_STATUS.OK_INCOMPLETE_FORM, {
          "Post ID": debugMessage.session.postId,
        })
      );
    }
    try {
      let diff = annotator.haveAnnotationsChanged(annotations);
      console.log({ diff });
      if (diff) {
        setStatus(ANNOTATOR_STATUS.LOADING_SAVE_ANNOTATIONS);
        const response = await annotator.saveAnnotations(diff);
        console.log({ ANNOTATION_RESPONSE: response.data });

        if (response.status === 200) {
          const { updateFlag, MESSAGE } =
            ANNOTATOR_STATUS.getHumanReadableUpdateSummary(response.data);
          if (updateFlag) {
            setNoteworthyMessage(MESSAGE);
          }
          setNotificationFeed([
            ...notificationFeed,
            ANNOTATOR_STATUS.makeMessage(
              ANNOTATOR_STATUS.OK_ANNOTATIONS_SAVED,
              response.data
            ),
          ]);
        } else {
          throw "Error saving Annotations";
        }
      }
      setStatus(ANNOTATOR_STATUS.LOADING_PAGE);
      await annotator.next();
      await refresh();
      await annotator.saveSession();
    } catch (err) {
      console.log(err);
      showNotification("info", "Could not go to the next page");
    }
  }

  async function goToPreviousPage() {
    setNoteworthyMessage(undefined); // This is to reset any unacknowledged messages
    if (!annotator.isFormFilled(annotations)) {
      setNoteworthyMessage(
        ANNOTATOR_STATUS.makeMessage(ANNOTATOR_STATUS.OK_INCOMPLETE_FORM, {
          "Post ID": debugMessage.session.postId,
        })
      );
    }
    try {
      let diff = annotator.haveAnnotationsChanged(annotations);
      if (diff) {
        const response = await annotator.saveAnnotations(diff);
        if (response.status === 200) {
          const { updateFlag, MESSAGE } =
            ANNOTATOR_STATUS.getHumanReadableUpdateSummary(response.data);
          if (updateFlag) {
            setNoteworthyMessage(MESSAGE);
          }
          setNotificationFeed([
            ...notificationFeed,
            ANNOTATOR_STATUS.makeMessage(
              ANNOTATOR_STATUS.OK_ANNOTATIONS_SAVED,
              response.data
            ),
          ]);
        } else {
          throw "Error saving Annotations";
        }
      }
      await annotator.previous();
      await refresh();
      await annotator.saveSession();
    } catch (err) {
      console.log(err);
      showNotification("info", "Could not go to the previous page");
    }
  }

  async function logout() {
    await logoutUser();
    navigate("/login");
  }

  return (
    <Grommet full theme={TattleTheme}>
      <Stack>
        <Box fill gap={"small"} dir="column">
          <Header pad={"small"}>
            <TattleLogo brandName={t("app_name")} />
            <Box flex direction={"row"} gap={"medium"}>
              <Box
                width={"fit-content"}
                round={"small"}
                responsive
                background={"visuals-3"}
                pad={"small"}
                align={"center"}
              >
                <Text id="annotation_status">{`pending : ${userStatus.pending}`}</Text>
              </Box>
              {notification ? (
                <Box
                  id={"notification_bar"}
                  background={
                    notification.type == "info" ? "visuals-9" : "status-error"
                  }
                  pad={"small"}
                  round={"small"}
                >
                  <Text>{notification.text}</Text>
                </Box>
              ) : null}
              {status.type !== "ok" ? (
                <Box
                  id={"notification_bar"}
                  background={
                    status.type == "loading" ? "visuals-9" : "status-error"
                  }
                  pad={"small"}
                  round={"small"}
                >
                  <Text>{status.message}</Text>
                </Box>
              ) : null}
            </Box>
            {/* <Button
							label={"state"}
							onClick={() => console.log(annotator.state)}
						/> */}
            <Button
              onClick={() => {
                setNotificationFeedVisibility(!notificationFeedVisibility);
              }}
              icon={<Notification size={"medium"} />}
            />
            <Button plain label={"Logout"} onClick={logout} />
          </Header>

          <Box flex={"grow"} gap={"medium"}>
            <Box
              width={"large"}
              border
              direction={"column"}
              gap={"large"}
              alignSelf={"center"}
            >
              <Stack>
                <Box flex={"grow"} gap={"medium"} pad={"medium"}>
                  <Box
                    direction={"row-responsive"}
                    align={"center"}
                    gap={"medium"}
                  >
                    <Text size={"large"}>{t("post_annotation")}</Text>
                    <Box
                      width={"fit-content"}
                      round={"small"}
                      responsive
                      pad={"small"}
                      alignSelf={"start"}
                    >
                      <Text id={"page_status"}>{pageStatus}</Text>
                    </Box>
                    <Box direction={"row"} gap={"xsmall"}>
                      <Button
                        default
                        icon={<LinkPrevious size={"medium"} />}
                        onClick={goToPreviousPage}
                        focusIndicator={false}
                      />
                      <Button
                        secondary
                        icon={<LinkNext size={"medium"} />}
                        onClick={goToNextPage}
                        focusIndicator={false}
                      />
                    </Box>
                  </Box>

                  {post && (
                    <SimplePost post={post} annotationStatus={"pending"} />
                  )}

                  <Box gap={"medium"}>
                    <Box direction={"column"}>
                      <Text> {t("annotation_form_question_1")}</Text>

                      <ReactRadioButtonGroup
                        id="question_1"
                        name="question_1"
                        options={[
                          { label: t("yes"), value: "1" },
                          { label: t("no"), value: "0" },
                        ]}
                        value={
                          annotations.question_1
                            ? annotations.question_1.value
                            : ""
                        }
                        onChange={(val) => changeAnnotation("question_1", val)}
                      />
                    </Box>
                    <Box direction={"column"}>
                      <Text> {t("annotation_form_question_2")}</Text>
                      <ReactRadioButtonGroup
                        name="question_2"
                        options={[
                          { label: t("yes"), value: "1" },
                          { label: t("no"), value: "0" },
                        ]}
                        value={
                          annotations.question_2
                            ? annotations.question_2.value
                            : ""
                        }
                        onChange={(val) => changeAnnotation("question_2", val)}
                      />
                    </Box>
                    <Box direction={"column"}>
                      <Text> {t("annotation_form_question_3")}</Text>
                      <ReactRadioButtonGroup
                        name="question_3"
                        options={[
                          { label: t("yes"), value: "1" },
                          { label: t("no"), value: "0" },
                        ]}
                        value={
                          annotations.question_3
                            ? annotations.question_3.value
                            : ""
                        }
                        onChange={(val) => changeAnnotation("question_3", val)}
                      />
                    </Box>

                    <TextArea
                      placeholder="Additional notes"
                      value={annotations.notes ? annotations.notes.value : ""}
                      onChange={(event) =>
                        changeAnnotation("notes", event.target.value)
                      }
                    />
                  </Box>
                </Box>

                {status.type !== "ok" ? (
                  <Box
                    flex={"grow"}
                    pad={"medium"}
                    background={status.type === "error" ? "#e56d67cc" : "none"}
                    fill={"vertical"}
                  ></Box>
                ) : null}
                {noteworthyMessage ? (
                  <NoteworthyModal
                    message={noteworthyMessage}
                    setMessage={setNoteworthyMessage}
                  />
                ) : null}

                {notificationFeedVisibility ? (
                  <NotificationFeed
                    items={notificationFeed}
                    onClose={() => setNotificationFeedVisibility(false)}
                  />
                ) : null}
              </Stack>
            </Box>
            {/* <Box width={"medium"} height={"95vh"} overflow={"scroll"}>
              <ReactJson collapsed={false} src={debugMessage} />
              <ReactJson
                collapsed={false}
                src={{ annotationsUI: annotations }}
              />
            </Box> */}
          </Box>

          <AppFooter />
        </Box>
      </Stack>
    </Grommet>
  );
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
