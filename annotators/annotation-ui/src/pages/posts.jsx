import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { Annotator } from "../controller/annotator";
import {
  Grommet,
  Header,
  Box,
  Text,
  Button,
  RadioButtonGroup,
  TextArea,
  Keyboard,
} from "grommet";
import ReactJson from "react-json-view";
import TattleLogo from "../components/atoms/TattleLogo";
import TattleTheme from "../components/atoms/Theme";
import { LinkNext, LinkPrevious } from "grommet-icons";
import ReactRadioButtonGroup from "react-radio-button-group";
import { SimplePost } from "../components/atoms/SimplePost";
import { useTranslation } from "gatsby-plugin-react-i18next";

const annotator = new Annotator(
  { id: "f32fbcfe-2351-4264-bafe-040274f469db" },
  undefined
);

export default function PostAnnotator() {
  const { t } = useTranslation();
  const [debugMessage, setDebugMessage] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [pageStatus, setPageStatus] = useState("");
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    async function setupAnnotator() {
      await annotator.setup();
      await refresh();
    }
    setupAnnotator();
  }, []);

  function changeAnnotation(key, value) {
    setAnnotations({
      ...annotations,
      [key]: value,
    });
  }

  async function refresh() {
    const data = await annotator.makePageData(annotator.session.postId);
    if (data != undefined) {
      const { annotations, pageStatus, post } = data;
      setAnnotations(annotations);
      setPageStatus(pageStatus);
      setDebugMessage(annotator.state);
      setPost(post);
    }
  }

  async function goToNextPage() {
    await annotator.saveAnnotations(annotations);
    await annotator.next();
    await refresh();
  }

  async function goToPreviousPage() {
    await annotator.saveAnnotations(annotations);
    await annotator.previous();
    await refresh();
  }

  return (
    <Grommet full theme={TattleTheme}>
      <Keyboard
        target="document"
        onRight={goToNextPage}
        onLeft={goToPreviousPage}
      >
        <Box fill background={"light-1"} gap={"small"}>
          <Header background={"light-2"} pad={"small"}>
            <TattleLogo />
          </Header>

          <Box width={"1020px"} height={{ min: "100vh" }} flex={"grow"}>
            <Box width={"520px"} direction={"column"} gap={"large"}>
              <Box flex={"grow"} gap={"medium"} pad={"medium"}>
                <Box direction={"row"} align={"center"} gap={"medium"}>
                  <Text size={"large"}>{t("post_annotation")}</Text>
                  <Box direction={"row"} gap={"xsmall"}>
                    <Button
                      default
                      icon={<LinkPrevious size={"medium"} />}
                      onClick={goToPreviousPage}
                    />
                    <Button
                      secondary
                      icon={<LinkNext size={"medium"} />}
                      onClick={goToNextPage}
                    />
                  </Box>
                </Box>
                {post && (
                  <SimplePost post={post} annotationStatus={"pending"} />
                )}
                <Box>
                  <Box direction={"row"} gap={"large"}>
                    <Text> {t("annotation_form_ogbv")}</Text>

                    <ReactRadioButtonGroup
                      name="ogbv"
                      options={[
                        { label: t("yes"), value: "1" },
                        { label: t("no"), value: "0" },
                      ]}
                      value={annotations.ogbv}
                      onChange={(val) => changeAnnotation("ogbv", val)}
                    />
                  </Box>
                  <Box direction={"row"} gap={"large"}>
                    <Text> {t("annotation_form_explicit")}</Text>
                    <ReactRadioButtonGroup
                      name="explicit"
                      options={[
                        { label: t("yes"), value: "1" },
                        { label: t("no"), value: "0" },
                      ]}
                      value={annotations.explicit}
                      onChange={(val) => changeAnnotation("explicit", val)}
                    />
                  </Box>
                  <Box direction={"row"} gap={"large"}>
                    <Text> {t("annotation_form_hateful")}</Text>
                    <ReactRadioButtonGroup
                      name="hate"
                      options={[
                        { label: t("yes"), value: "1" },
                        { label: t("no"), value: "0" },
                      ]}
                      value={annotations.hate}
                      onChange={(val) => changeAnnotation("hate", val)}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                width={"100%"}
                round={"small"}
                responsive
                background={"visuals-1"}
                pad={"medium"}
              >
                <Text>{pageStatus}</Text>
                <ReactJson collapsed={true} src={debugMessage} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Keyboard>
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
