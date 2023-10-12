import React, { useEffect, useState, useContext } from "react";
import { Box, Select, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { useTranslation } from "react-i18next";
import { useLocation } from "@reach/router";

const NavBarByLang = {
  en: (
    <Box direction="row" gap={"medium"}>
      <NavLink to={"/user-guide"}>User Guide</NavLink>
      <NavLink to={"/about"}>About</NavLink>
      <NavLink to={"/blog"}>Blog</NavLink>
      <NavLink to={"/faq"}>FAQ</NavLink>
      <NavLink to={"/research"}>Research</NavLink>
    </Box>
  ),
  hi: (
    <Box direction="row" gap={"medium"}>
      <NavLink to={"/hi/about"}>About</NavLink>
      <NavLink to={"/hi/faq"}>FAQ</NavLink>
    </Box>
  ),
  ta: (
    <Box direction="row" gap={"medium"}>
      <NavLink to={"/ta/about"}>About</NavLink>
      <NavLink to={"/ta/faq"}>FAQ</NavLink>
    </Box>
  ),
};

export default function NavBar() {
  const [langOption, setLangOption] = useState(undefined);
  const location = useLocation();
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    console.log(`pageLoad `);
    let lang;
    switch (location.pathname.slice(0, 3)) {
      case "/hi":
        lang = "hi";
        break;
      case "/en":
        lang = "en";
        break;
      case "/ta":
        lang = "ta";
        break;
      default:
        lang = "en";
    }
    setLangOption(lang);
  }, [location.pathname]);

  return (
    <Box align="center" pad={"medium"}>
      <Box
        width={"large"}
        direction={"row-responsive"}
        gap={"small"}
        style={
          size === "small"
            ? {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }
            : {}
        }
      >
        <Text>
          <NavLink to={"/"}>
            <Text size={"small"}>English</Text>
          </NavLink>{" "}
          <NavLink to={"/ta/"}>
            <Text size={"small"}>Tamil</Text>
          </NavLink>{" "}
          <NavLink to={"/hi/"}>
            <Text size={"small"}>Hindi</Text>
          </NavLink>
        </Text>
      </Box>
      <Box
        margin={{ top: "small" }}
        width={"large"}
        direction={"row-responsive"}
        align={"center"}
        gap={"medium"}
        style={
          size === "small"
            ? {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }
            : {}
        }
      >
        <Box
          width={"4em"}
          hoverIndicator
          focusIndicator={false}
          onClick={() => navigate("/")}
        >
          <img src={"/Uli_Logo.png"} alt={"Uli Logo"} />
        </Box>

        <Box flex={"grow"} />
        {NavBarByLang[langOption]}
      </Box>
    </Box>
  );
}
