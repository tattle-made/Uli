import { Grommet, Box } from "grommet";
import * as React from "react";
import { Helmet } from "react-helmet";
import { Theme } from "../atoms/UliCore";
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
        </Helmet>

        <NavBar />
        {children}
      </main>
    </Grommet>
  );
}
