import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { Trans, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import {
  Grommet,
  ResponsiveContext,
  Box,
  Heading,
  Text,
  Header,
  Sidebar,
  Tabs,
  Tab,
  Main,
  Anchor,
} from "grommet";
import TattleTheme from "../components/atoms/Theme";
import TattleLogo from "../components/atoms/TattleLogo";
import { PlainLink } from "../components/atoms/TattleLinks";

const preference = {
  language: "en",
};

const AppSideNavBar = () => {
  const size = React.useContext(ResponsiveContext);
  const options = [
    { label: "Annotations", route: "/annotations" },
    { label: "Users", route: "/users" },
    { label: "Posts", route: "/posts" },
  ];
  function onTabChanged(e) {
    console.log(e);
  }
  return size === "small" ? (
    <Box width={"100%"} responsive={true}>
      <Tabs alignControls={"start"} onActive={onTabChanged}>
        <Tab title="tab 1">
          <Box pad="medium">One</Box>
        </Tab>
        <Tab title="tab 2">
          <Box pad="medium">Two</Box>
        </Tab>
      </Tabs>
    </Box>
  ) : (
    <Box width={"small"} responsive={true}>
      <Sidebar>
        <Anchor href={"/"} color={"accent-2"}>
          Annotations
        </Anchor>
        <PlainLink to={"/home"}>
          <Text size={"large"} color={"accent-2"} weight={"600"}>
            Users
          </Text>
        </PlainLink>
        <Text size={"large"}>Users</Text>
        <Text size={"large"}>Posts</Text>
        <Text size={"large"}>{size}</Text>
      </Sidebar>
    </Box>
  );
};

const AppContentSection = ({ children }) => {
  const size = React.useContext(ResponsiveContext);

  return size === "small" ? (
    <Box direction={"column"} pad={"small"} responsive>
      {children.map((child) => (
        <Box>{child}</Box>
      ))}
    </Box>
  ) : (
    <Box fill direction={"row"} pad={"small"} responsive>
      {children.map((child, ix) => child)}
    </Box>
  );
};

const AppPage = () => {
  const { t } = useTranslation();
  const { languages, changeLanguage } = useI18next();

  useEffect(() => {
    changeLanguage(preference.language);
  }, []);

  return (
    <Grommet full theme={TattleTheme}>
      <Box fill background={"light-1"} gap={"small"}>
        <Header background={"light-2"} pad={"small"}>
          <TattleLogo />
        </Header>

        <AppContentSection>
          <AppSideNavBar />
          <Box flex={{ grow: 6 }} height={"small"}>
            Annotation
          </Box>
          <Box
            flex={{ grow: 1 }}
            height={"small"}
            round={"small"}
            responsive
            background={"visuals-1"}
            pad={"small"}
          >
            Sidebar
          </Box>
        </AppContentSection>
      </Box>
    </Grommet>
  );
};

export default AppPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
