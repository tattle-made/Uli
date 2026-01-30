import * as React from "react";
import { Grommet, Box } from "grommet";
import { Helmet } from "react-helmet";
import { Theme } from "../atoms/UliCore";
import NavBarNew from "./NavBarNew";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
import { useLocation } from "@reach/router";
import Projects from "./Projects";

export default function AppShellNew({ children }) {
  const { i18n } = useTranslation();
  const location = useLocation();

  /* ---------- Set language from localStorage ---------- */
  React.useEffect(() => {
    const lang = localStorage.getItem("uli-lang");
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  /* ---------- Page title ---------- */
  let fullPath = location.pathname;
  if (fullPath.endsWith("/")) {
    fullPath = fullPath.slice(0, -1);
  }

  let title = fullPath.split("/").at(-1);

  if (["hi", "en", "ta", "ma"].includes(title)) {
    title = "Uli";
  }

  title = title
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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
          <title>{title}</title>
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

        {/* NEW NAVBAR */}
        <NavBarNew />

        {/* PAGE CONTENT */}
        <Box flex="grow">{children}</Box>
        <Projects/>
        {/* FOOTER */}
        <Footer />
      </main>
    </Grommet>
  );
}
