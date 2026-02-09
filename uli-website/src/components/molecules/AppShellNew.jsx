import { Grommet, Box } from "grommet";
import * as React from "react";
import { Helmet } from "react-helmet";
import { Colors, NavLink, Theme } from "../atoms/UliCore";
import NavBarNew from "./NavBarNew";
import i18n from "../atoms/i18n";
import { useTranslation } from "react-i18next";
import { useLocation } from "@reach/router";
import FooterNew from "./FooterNew";

export default function AppShellNew({ children }) {
  const { t, i18n } = useTranslation();
  React.useEffect(() => {
    const lang = localStorage.getItem("uli-lang");
    i18n.changeLanguage(lang);
  }, []);
  const location = useLocation();

  let fullPath = location.pathname;
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  let title = fullPath.split("/").at(-1);

  if (["hi", "en", "ta", "ma"].includes(title)) {
    title = "Uli";
  }

  title = formatTitle(title);

  function formatTitle(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return (
    <Grommet theme={Theme}>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>Uli</title>
          <link rel="stylesheet" href="/layout.css" />
          <link rel="stylesheet" href="https://use.typekit.net/twt1ywc.css" />
          <meta property="og:title" content={title} />
          <meta name="icon" href="images/favicon-32x32.png" />

          <script
            defer
            data-domain="uli.tattle.co.in"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Helmet>

        <NavBarNew />
        <Box flex="grow">{children}</Box>
        <FooterNew />
      </main>
    </Grommet>
  );
}
