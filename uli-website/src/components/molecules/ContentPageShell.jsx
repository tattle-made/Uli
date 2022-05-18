import React from "react";
import AppShell from "./AppShell";
import { Box } from "grommet";

const ContentPageShell = ({ children }) => {
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        {children}
      </Box>
    </AppShell>
  );
};

export default ContentPageShell;
