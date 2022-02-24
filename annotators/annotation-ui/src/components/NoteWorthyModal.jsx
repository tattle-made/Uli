import React from "react";
import { Box, Text, Button } from "grommet";

export function NoteworthyModal({ message, setMessage }) {
  return (
    <Box background={"status-warning"} pad={"medium"} fill justify="center">
      <Box gap={"medium"} alignSelf={"center"}>
        <Text>{message.message}</Text>
        {message.payload ? (
          <Text>{JSON.stringify(message.payload, null, 4)}</Text>
        ) : null}

        <Button
          label={"OK"}
          secondary
          focusIndicator={false}
          onClick={() => {
            setMessage(undefined);
          }}
          alignSelf={"start"}
        ></Button>
      </Box>
    </Box>
  );
}
