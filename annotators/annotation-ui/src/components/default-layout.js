import React from "react";
// import { primaryNav, footerItems } from "../config/options"
import AppShell from "./atoms/AppShell";
import { Grommet, Box, Heading, Text, Button, Header } from "grommet";
import TattleTheme from "../components/atoms/Theme";
import TattleLogo from "../components/atoms/TattleLogo";
import { AppFooter } from "../components/Footer";

/**
 * @author
 * @function DefaultLayout
 **/

const DefaultLayout = ({ children }) => (
  <Grommet full theme={TattleTheme}>
    <Box fill gap={"small"}>
      <Header pad={"small"}>
        <TattleLogo />
      </Header>

      <Box flex={"grow"} gap={"medium"}>
        <Box
          width={"large"}
          direction={"column"}
          gap={"large"}
          alignSelf={"center"}
        >
          {children}
        </Box>
      </Box>

      <AppFooter />
    </Box>
  </Grommet>
);

export default DefaultLayout;
