import React, { useEffect, useState } from "react";
import { Annotator } from "../controller/annotator";
import {
  Grommet,
  Header,
  Box,
  Text,
  Button,
  RadioButtonGroup,
  TextArea,
} from "grommet";
import ReactJson from "react-json-view";
import TattleLogo from "../components/atoms/TattleLogo";
import TattleTheme from "../components/atoms/Theme";
import { LinkNext, LinkPrevious } from "grommet-icons";
import ReactRadioButtonGroup from "react-radio-button-group";
import { SimplePost } from "../components/atoms/SimplePost";

const annotator = new Annotator(
  { id: "f32fbcfe-2351-4264-bafe-040274f469db" },
  undefined
);

export default function PostAnnotator() {
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

  return (
    <Grommet full theme={TattleTheme}>
      <Box fill background={"light-1"} gap={"small"}>
        <Header background={"light-2"} pad={"small"}>
          <TattleLogo />
        </Header>

        <Box width={"1020px"} height={{ min: "100vh" }} flex={"grow"}>
          <Box width={"520px"} direction={"column"} gap={"large"}>
            <Box flex={"grow"} gap={"medium"} pad={"medium"}>
              <Box direction={"row"} align={"center"} gap={"medium"}>
                <Text size={"large"}>Post Annotation</Text>
                <Box direction={"row"} gap={"xsmall"}>
                  <Button
                    default
                    icon={<LinkPrevious size={"medium"} />}
                    onClick={async () => {
                      await annotator.previous();
                      await refresh();
                    }}
                  />
                  <Button
                    secondary
                    icon={<LinkNext size={"medium"} />}
                    onClick={async () => {
                      await annotator.saveAnnotations(annotations);
                      await annotator.next();
                      await refresh();
                    }}
                  />
                </Box>
              </Box>
              {post && <SimplePost post={post} annotationStatus={"pending"} />}
              <Box>
                <Box direction={"row"} gap={"large"}>
                  <Text> Is this post OGBV</Text>

                  <ReactRadioButtonGroup
                    name="ogbv"
                    options={[
                      { label: "yes", value: "1" },
                      { label: "no", value: "0" },
                    ]}
                    value={annotations.ogbv}
                    onChange={(val) => changeAnnotation("ogbv", val)}
                  />
                </Box>
                <Box direction={"row"} gap={"large"}>
                  <Text> Is this post explicit</Text>
                  <ReactRadioButtonGroup
                    name="explicit"
                    options={[
                      { label: "yes", value: "1" },
                      { label: "no", value: "0" },
                    ]}
                    value={annotations.explicit}
                    onChange={(val) => changeAnnotation("explicit", val)}
                  />
                </Box>
                <Box direction={"row"} gap={"large"}>
                  <Text> Is this post Hateful</Text>
                  <ReactRadioButtonGroup
                    name="hate"
                    options={[
                      { label: "yes", value: "1" },
                      { label: "no", value: "0" },
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
              <Text>Annotator </Text>
              <ReactJson collapsed={true} src={debugMessage} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
}
function AnnotationForm({ data }) {
  const [notes, setNotes] = useState("");
  const [annotations, setAnnotations] = useState(data);
  return (
    <Box gap={"small"}>
      <Box>
        <TextArea
          placeholder="Additional Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </Box>
    </Box>
  );
}
