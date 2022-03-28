import React, { useState } from "react";
import { Box, Text } from "grommet";
import { Camera, Wifi, Eye, Activity } from "react-feather";
import { saveScreenshot } from "../service-screenshot";

function UnfocussedButton({ onClick, children }) {
  return (
    <Box onClick={onClick} focusIndicator={false}>
      {children}
    </Box>
  );
}

export function TweetControl({ id, slursToBlur }) {
  const removeBanner = useState([]);
  function clickActivity() {
    console.log(id);
  }

  async function clickCamera() {
    const node = document.getElementById(id);
    console.log(node);
    await saveScreenshot(node);
  }

  return (
    <Box direction="row">
      <Box flex="grow"></Box>
      <Box direction="row" gap={"small"} padding={"medium"}>
        <UnfocussedButton onClick={clickCamera}>
          <Camera size={16} />
        </UnfocussedButton>
        <Wifi size={16} />
        <Eye size={16} />
        <UnfocussedButton onClick={clickActivity}>
          <Activity size={16} />
        </UnfocussedButton>
      </Box>
    </Box>
  );
}
