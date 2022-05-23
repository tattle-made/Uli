import { Grommet, Box } from "grommet";
import * as React from "react";
import { Helmet } from "react-helmet";
import { Colors, NavLink, Theme } from "../atoms/UliCore";
import NavBar from "./NavBar";

export default function AppShell({ children }) {
  return (
    <Grommet theme={Theme}>
      <main>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Uli</title>
          <link rel="stylesheet" href="layout.css" />
          <link rel="stylesheet" href="https://use.typekit.net/twt1ywc.css" />
          <script
            defer
            data-domain="uli.tattle.co.in"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Helmet>

        <NavBar />
        {children}
        <Box align="center" pad={"medium"}>
          <Box direction="row" gap={"medium"}>
            <NavLink to={"/privacy-policy"}>Privacy Policy</NavLink>
            <NavLink to={"/blog"}>Blog</NavLink>
            <NavLink to={"/about"}>About</NavLink>
          </Box>
        </Box>
      </main>
    </Grommet>
  );
}
