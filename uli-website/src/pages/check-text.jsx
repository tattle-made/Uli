import React from "react";
import { Box, Text, Button, TextArea, Heading } from "grommet";
import AppShell from "../components/molecules/AppShell";
import { useState } from "react";
import styled from "styled-components";
import slurMetadata from "../slurs/slurs-metadata.json";

const CustomTextArea = styled(TextArea)`
  &:focus {
    box-shadow: 0 0 0 4px #ffde2155;
  }
`;

export default function Story() {
  const [hoveredSlur, setHoveredSlur] = useState(null);
  const [input, setInput] = useState(null);
  const [displayText, setDisplayText] = useState("");

  const slurs = slurMetadata;

  const getHighlightedText = (text, words) => {
    if (!text) return "";

    const regex = new RegExp(
      `\\b(${words.map((w) => w.label).join("|")})\\b`,
      "gi"
    );

    return text.split(regex).map((part, index) => {
      const wordData = words.find(
        (w) => w.label.toLowerCase() === part.toLowerCase()
      );

      return wordData ? (
        <span
          key={index}
          style={{
            backgroundColor: "#ffde2155",
            boxShadow: "0px 0px 5px #ffde21",
            cursor: "pointer",

            display: "inline",
            whiteSpace: "pre-wrap",
          }}
          onMouseEnter={(e) => {
            setHoveredSlur({
              metadata: wordData,
              position: { x: "-9999px", y: "-9999px" },
            });

            const rect = e.currentTarget.getBoundingClientRect();
            // Settimeout to wait for the re-render.
            setTimeout(() => {
              let tooltipContainer =
                document.getElementById("metadata-tooltip");

              let position = {
                x: rect.left + window.scrollX,
                y: rect.bottom + 10 + window.scrollY,
              };

              const screenHeight = window.innerHeight;
              const screenWidth = window.innerWidth;

              const tooltipHeight = tooltipContainer.offsetHeight;

              const spaceBelow = screenHeight - rect.bottom;

              if (spaceBelow < tooltipHeight + 10) {
                position.y = rect.top - tooltipHeight - 10 + window.scrollY;
              }

              if (position.x + 290 > screenWidth) {
                position.x = screenWidth - 320 + window.scrollX;
              }

              setHoveredSlur({ metadata: wordData, position });
            }, 0);
          }}
          onMouseLeave={() => setHoveredSlur(null)}
        >
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  function onCheck() {
    setDisplayText(getHighlightedText(input, slurs));
  }

  return (
    <AppShell>
      <Box align="center">
          <Heading margin={{horizontal:"large"}} level={3}>Check Text for Slur Metadata</Heading>
        <Box width={"large"} height={"full"}>
          <CustomTextArea
            value={input}
            resize={"vertical"}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text here to check... "
            style={{
              width: "full",
              minHeight: "12em",
              fontWeight: "400",
              padding: "0.5em",
            }}
          />
          <Box flex width={"full"} direction="row" gap="1em">
            <Button
              color={"lightGrey"}
              primary
              onClick={() => {
                setDisplayText("");
                setInput("");
              }}
              label={"Reset"}
              style={{ width: "fit-content" }}
              margin={{ top: "0.5em" }}
            />
            <Button
              color={"#ede09f"}
              primary
              onClick={onCheck}
              label={"Check"}
              style={{ width: "fit-content" }}
              margin={{ top: "0.5em" }}
            />
          </Box>
          <Text size="large" margin={{ top: "1em" }}>
            Output:
          </Text>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {displayText
              ? displayText
              : "Check a Text to Display Result Here. . ."}
          </p>
          {hoveredSlur && (
            <div
              id="metadata-tooltip"
              className="absolute"
              style={{
                position: "absolute",
                left: hoveredSlur.position.x,
                top: hoveredSlur.position.y,
              }}
            >
              <HoverSlurMetadata slurDetails={hoveredSlur.metadata} />
            </div>
          )}
        </Box>
      </Box>
    </AppShell>
  );
}

const HoverCategoryBubble = ({ data }) => {
  return (
    <Box>
      <Box
        round="small"
        background="#FADA5E"
        pad="xsmall"
        width="fit-content"
        wrap={true}
        style={{
          fontFamily: "Raleway",
          fontSize: "9px",
          color: "black",
        }}
      >
        <Text size="small">{data}</Text>
      </Box>
    </Box>
  );
};

const HoverSlurMetadata = ({ slurDetails }) => {
  return (
    <Box
      pad="small"
      background="antiquewhite"
      border={{ color: "black", size: "xsmall" }}
      round="small"
      width="18rem"
      justify="start"
      align="start"
      elevation="small"
      style={{
        fontFamily: "Raleway",
        fontSize: "9px",
        color: "black",
        textAlign: "left",
        lineHeight: "1.5",
        minWidth: "288px",
      }}
    >
      {slurDetails["level_of_severity"] && (
        <Text>
          <b>Level of Severity:</b> {slurDetails["level_of_severity"]}
        </Text>
      )}
      {slurDetails["casual"] && (
        <Text>
          <b>Casual:</b> {slurDetails["casual"]}
        </Text>
      )}
      {slurDetails["appropriated"] && (
        <Text>
          <b>Appropriated:</b> {slurDetails["appropriated"]}
        </Text>
      )}
      {slurDetails["appropriation_context"] && (
        <Text>
          <b>If, Appropriated, Is it by Community or Others?:</b>{" "}
          {slurDetails["appropriation_context"]}
        </Text>
      )}
      {slurDetails["meaning"] && (
        <Text>
          <b>What Makes it Problematic?:</b> {slurDetails["meaning"]}
        </Text>
      )}

      {slurDetails["categories"] && slurDetails["categories"].length > 0 && (
        <Box>
          <Text>
            <b>Categories:</b>
          </Text>
          <Box direction="row" gap="xsmall" cssGap wrap>
            {slurDetails["categories"].map((category, index) => (
              <HoverCategoryBubble
                key={index}
                data={category.replace(/_/g, " ")}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
