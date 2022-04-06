import React, { useState, useEffect } from "react";
import { Box, Text } from "grommet";
import { Camera, Wifi, Eye, Activity } from "react-feather";
import { saveScreenshot } from "../service-screenshot";
import axios from "axios";

function UnfocussedButton({ onClick, children }) {
  return (
    <Box onClick={onClick} focusIndicator={false}>
      {children}
    </Box>
  );
}

export function TweetControl({ id, slursToBlur }) {
  const [category, setCategory] = useState("Uncategorized");
  const removeBanner = useState([]);
  function clickActivity() {
    console.log(id);
  }

  useEffect(async () => {
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        text: "This restaurant is disgusting",
      });
      const { data } = response;

      if (data.confidence > 0.5) {
        setCategory(data.sentiment);
      }
    } catch (err) {
      console.log(`Error : server could not classify tweet`, err);
    }
  }, []);

  async function clickCamera() {
    const node = document.getElementById(id);
    console.log(node);
    await saveScreenshot(node);
  }

  return (
    <Box direction="row">
      <Box flex="grow"></Box>
      <Box direction="row" gap={"small"} padding={"medium"}>
        <Text size="'small">{category}</Text>
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
