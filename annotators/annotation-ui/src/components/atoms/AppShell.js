import React from "react";
import { Grommet, ResponsiveContext, Box, Text, Heading } from "grommet";
import TattleTheme from "./Theme";
import SEO from "./SEO";
import { PlainLink } from "./TattleLinks";
import TattleLogo from "./TattleLogo";
import { useLocation } from "@reach/router";

/**
 * @author
 * @function ContentPageLayout
 **/

const AppShell = ({
  children,
  footerItems,
  headerTarget,
  primaryNav,
  expandCenter,
  contentWidth,
  isMDXPage,
}) => {
  const size = React.useContext(ResponsiveContext);
  const location = useLocation();

  return (
    <Grommet theme={TattleTheme} full>
      <SEO title={`Tattle Search Documentation`} />
      <Box
        fill
        direction={"row"}
        height={{ min: "90vh", height: "fit-content" }}
        pad={"small"}
      >
        <Box width={"100%"}>{children}</Box>
      </Box>
    </Grommet>
  );
};

export default AppShell;
