import React from "react";
import { ResponsiveContext, Box } from "grommet";

export const AppContentSection = ({ children }) => {
  const size = React.useContext(ResponsiveContext);

  return size === "small" ? (
    <Box direction={"column"} pad={"small"} gap={"small"} responsive>
      {children.map((child) => (
        <Box>{child}</Box>
      ))}
    </Box>
  ) : (
    <Box fill direction={"row"} pad={"small"} gap={"small"} responsive>
      {children.map((child, ix) => child)}
    </Box>
  );
};
