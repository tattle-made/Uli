import React, { useState } from "react";
import { Box, Text, Button } from "grommet";
import { Clipboard, Close } from "grommet-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function NotificationFeed({ items, onClose }) {
  const [copyConfirmation, setCopyConfirmation] = useState(undefined);
  function showCopyConfirmation() {
    console.log("1");
    setCopyConfirmation("Copied to Clipboard");
    setTimeout(() => {
      setCopyConfirmation(undefined);
    }, 1000);
  }

  return (
    <Box
      fill
      alignSelf={"center"}
      background={"white"}
      gap={"medium"}
      pad={"medium"}
      overflow={"scroll"}
    >
      <Box direction={"row"} align={"center"} gap={"small"}>
        <Text size={"large"}>Updates</Text>
        <CopyToClipboard
          text={JSON.stringify(items)}
          onCopy={showCopyConfirmation}
        >
          <Button icon={<Clipboard size={"medium"} />} />
        </CopyToClipboard>
        {copyConfirmation ? <Text>Copied</Text> : null}
        <Box flex={"grow"}></Box>
        <Button
          icon={<Close size={"medium"} />}
          onClick={() => onClose()}
        ></Button>
      </Box>
      <Box gap={"medium"}>
        {items && items.length !== 0
          ? items.map((item) => (
              <Box
                flex={"grow"}
                alignSelf={"start"}
                border
                round={"xsmall"}
                pad={"small"}
              >
                <Text>{item.message}</Text>
                {item.payload ? (
                  <Text>{JSON.stringify(item.payload, null, 4)}</Text>
                ) : null}
              </Box>
            ))
          : null}
      </Box>
    </Box>
  );
}
