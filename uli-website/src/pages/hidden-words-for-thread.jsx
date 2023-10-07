import React, { useState, useEffect } from "react";
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

const HiddenWordsForThread = () => {
  const selectOptions = Object.keys(options).map((option) => {
    return { label: options[option].label, value: option };
  });
  const defaultOptions = selectOptions.map((option) => option.value);
  const [choices, setChoices] = useState(defaultOptions);
  const [text, setText] = useState("");

  useEffect(() => {
    // Compute the text value based on choices and update the state
    const computedText = choices
      .map((choice) => options[choice].slurs.join(", "))
      .join(", ");
    setText(computedText);
  }, [choices]);

  function handleTextAreaChange(event) {
    const currentValue = event.target.value;

    if (event.nativeEvent.inputType === "deleteContentBackward") {
      setText((prevText) => prevText.slice(0, -1));
    } else {
      setText(currentValue);
    }
  }

  function clickCopyToClipboard() {
    navigator.clipboard.writeText(text); // Use the computed text
  }

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Heading level={1}>Hidden Words for Thread</Heading>
          <Paragraph fill>
            Meta's Thread now allows you to filter out words that you don't want
            to see on your feed. Uli's slur list can assist you in adding a list
            of slurs in Indian languages. If you are being targeted or abused
            on social media in Indian languages, consider adding these words to
            your list of "hidden words" on Thread
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
              value={text}
              onChange={handleTextAreaChange}/>
          </Box>
          <Heading level={2}>Contribute</Heading>
          <Paragraph fill>
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

export default HiddenWordsForThread;
