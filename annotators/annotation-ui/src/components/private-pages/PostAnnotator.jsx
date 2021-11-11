import React, { useEffect, useState } from "react";
import { Annotator } from "../../controller/annotator";
import { Box, Heading, Text, Button, RadioButtonGroup } from "grommet";
import ReactJson from "react-json-view";

const annotator = new Annotator(
  { id: "f32fbcfe-2351-4264-bafe-040274f469db" },
  undefined
);

export default function PostAnnotator() {
  const [debugMessage, setDebugMessage] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [pageStatus, setPageStatus] = useState("");

  useEffect(async () => {
    await annotator.setup();

    const data = await annotator.makePageData(annotator.session.postId);

    const { annotations, pageStatus } = data;
    console.log("=>");
    console.log(annotations);
    setAnnotations(annotations);
    setPageStatus(pageStatus);

    setDebugMessage(annotator.state);
  }, []);

  return (
    <Box>
      <Box>
        <Heading>Post Annotation</Heading>
        <AnnotationForm annotations={annotations} />
        <Box direction={"row"} gap={"medium"}>
          <Button
            default
            label={"P"}
            onClick={async () => {
              const data = await annotator.previous();
              if (data != undefined) {
                const { annotations, pageStatus } = data;
                setAnnotations(annotations);
                setPageStatus(pageStatus);
              }
              setDebugMessage(annotator.state);
            }}
          ></Button>
          <Button
            secondary
            label="N"
            onClick={async () => {
              const data = await annotator.next();
              if (data != undefined) {
                const { annotations, pageStatus } = data;
                console.log(annotations);
                setAnnotations(annotations);
                setPageStatus(pageStatus);
              }
              setDebugMessage(annotator.state);
            }}
          ></Button>
        </Box>
      </Box>
      <Box round={"small"} responsive background={"visuals-1"} pad={"small"}>
        <Text>Annotator </Text>
        <ReactJson collapsed={true} src={debugMessage} />
      </Box>
    </Box>
  );
}
function AnnotationForm({ annotations }) {
  const [ogbv, setOGBV] = useState(undefined);
  const [explicit, setExplicit] = useState(undefined);
  const [hate, setHate] = useState(undefined);
  console.log("rerender annotation form");
  console.log(annotations);
  console.log({ hate, explicit, ogbv });

  return (
    <Box>
      <Box gap={"xsmall"} direction={"row-responsive"} gap={"medium"}>
        <Text> Is this post OGBV</Text>
        <RadioButtonGroup
          direction={"row"}
          name="ogbv"
          options={[
            { label: "yes", value: "1" },
            { label: "no", value: "0" },
          ]}
          value={ogbv}
          onChange={(event) => setOGBV(event.target.value)}
        />
      </Box>
      <Box gap={"xsmall"} direction={"row-responsive"} gap={"medium"}>
        <Text> Is this post explicit</Text>
        <RadioButtonGroup
          direction={"row"}
          name="explicit"
          options={[
            { label: "yes", value: "1" },
            { label: "no", value: "0" },
          ]}
          value={explicit}
          onChange={(event) => setExplicit(event.target.value)}
        />
      </Box>
      <Box gap={"xsmall"} direction={"row-responsive"} gap={"medium"}>
        <Text> Is this post Hateful</Text>
        <RadioButtonGroup
          direction={"row"}
          name="hate"
          options={[
            { label: "yes", value: "1" },
            { label: "no", value: "0" },
          ]}
          value={hate}
          onChange={(event) => setHate(event.target.value)}
        />
      </Box>
    </Box>
  );
}
