import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Paragraph,
  Anchor,
  CheckBoxGroup,
  Button,
  TextArea,
} from "grommet";
import AppShell from "../components/molecules/AppShell";
import slurHindi from "../slurs/hindi.json";
import slurHinglish from "../slurs/hinglish.json";
import slurTamil from "../slurs/tamil.json";
import { CTALinkPlainPrimary } from "../components/atoms/UliCore";

const options = {
  hindi: {
    label: "Hindi",
    slurs: slurHindi,
  },
  tamil: {
    label: "Tamil",
    slurs: slurTamil,
  },
  hinglish: {
    label: "Hinglish",
    slurs: slurHinglish,
  },
};

const HiddenWordsForInstagram = () => {
  const selectOptions = Object.keys(options).map((option) => {
    return { label: options[option].label, value: option };
  });
  const defaultOptions = selectOptions.map((option) => option.value);
  const [choices, setChoices] = useState(defaultOptions);

  function clickCopyToClipboard() {
    navigator.clipboard.writeText(
      choices.map((choice) => options[choice].slurs.join(", ")).join(", ")
    );
  }

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Heading level={1}>Hidden Words for Instagram</Heading>
          <Paragraph fill>
            Instagram now allows you to filter out words that you don't want to
            see on your feed. Uli's slur list can assist you in adding a list of
            slurs in Indian languages. If you are being targetted or abused on
            social media in Indian languages, consider adding these words to
            your list of "hidden words" on Instagram
          </Paragraph>

          <Box direction="row-responsive" gap={"medium"} align="center">
            <Text> Choose Languages</Text>
            <CheckBoxGroup
              direction={"row-responsive"}
              gap="small"
              options={selectOptions}
              value={choices}
              onChange={({ value, option }) => {
                setChoices(value);
              }}
            ></CheckBoxGroup>
            <Box flex={"grow"}></Box>
            <Button onClick={clickCopyToClipboard}>
              <CTALinkPlainPrimary>
                <Text>Copy to Clipboard</Text>
              </CTALinkPlainPrimary>
            </Button>
          </Box>
          <Box height={"1.2em"} />
          <Box height={"50vh"}>
            <TextArea
              fill
              value={choices
                .map((choice) => options[choice].slurs.join(", "))
                .join(", ")}
            />
          </Box>
          <Heading level={2}>Contribute</Heading>
          <Paragraph fill margin={"none"}>
            These slurs were crowdsourced from social media users in India who
            are on the receiving end of abuse. If you would like to share your
            list of words with us and grow this list, reach out to us at
            uli_support@tattle.co.in
          </Paragraph>
        </Box>
      </Box>
    </AppShell>
  );
};

export default HiddenWordsForInstagram;
