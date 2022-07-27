import React, { useEffect, useState } from "react";
import { Box, Select, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const LANGUAGES_MAP = {
    English: "en",
    Hindi: "hi",
    Tamil: "ta",
  };
  const [langOption, setLangOption] = useState(undefined);

  useEffect(() => {
    console.log(`pageLoad `);
    console.log({ langOption });
    if (langOption === undefined) {
      const langLS = localStorage.getItem("langCode");
      const lang = langLS ? langLS : "English";
      setLangOption(lang);
      i18n.changeLanguage(LANGUAGES_MAP[lang]);
      console.log(`setting i18n language to ${LANGUAGES_MAP[lang]}`);
    }
  }, []);

  return (
    <Box align="center">
      <Box
        margin={{ top: "small" }}
        width={"large"}
        direction={"row-responsive"}
        align={"center"}
        gap={"medium"}
      >
        <Box
          width={"4em"}
          hoverIndicator
          focusIndicator={false}
          onClick={() => navigate("/")}
        >
          <img src={"/Uli_Logo.png"} alt={"Uli Logo"} />
        </Box>
        <Box width={"small"}>
          <Select
            options={["English", "Tamil", "Hindi"]}
            value={langOption}
            onChange={({ option }) => {
              localStorage.setItem("langCode", option);
              setLangOption(option);
              i18n.changeLanguage(LANGUAGES_MAP[option]);
            }}
          />
        </Box>
        {/* <Text>
          {JSON.stringify({ languages: i18n.languages, lang: i18n.language })}
        </Text> */}

        <Box flex={"grow"} />
        <Box direction="row" gap={"medium"}>
          <NavLink to={"/user-guide"}>User Guide</NavLink>
          {/* <NavLink to={"/blog"}>Blog</NavLink> */}
          <NavLink to={"/privacy-policy"}>Privacy Policy</NavLink>
          <NavLink to={"/about"}>About</NavLink>
        </Box>
      </Box>
    </Box>
  );
}
