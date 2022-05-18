import React from "react";
import { Box } from "grommet";

export default function NavBar() {
  return (
    <Box align="center">
      <Box width={"large"} direction={"row-responsive"} align={"center"}>
        <Box width={"4em"}>
          <img src={"/Uli_Logo.png"} alt={"Uli Logo"} />
        </Box>
        <Box flex={"grow"} />
        <Box direction="row" gap={"medium"}>
          <p>About</p>
          <p>User Guide</p>
          <p>Team</p>
        </Box>
      </Box>
    </Box>
  );
}
