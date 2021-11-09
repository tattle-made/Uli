import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { Router } from "@reach/router";
import { Trans, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Grommet, Box, Heading, Header, Main } from "grommet";
import TattleTheme from "../components/atoms/Theme";
import TattleLogo from "../components/atoms/TattleLogo";
import AnnotationList from "../components/AllotationList";
import { AppSideNavBar } from "../components/AppSideNavBar";
import { AppContentSection } from "../components/AppContentSection";
import AllocationPage from "../components/private-pages/AllocationPage";
import UserPreference from "../components/private-pages/UserPreference";
import Login from "../components/private-pages/Login";
import PrivateRoute from "../components/atoms/PrivateRoute";
import PostDetailPage from "../components/private-pages/PostDetailPage";

const preference = {
  language: "en",
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

          <Box width={"100%"}>
            <Router basepath="/app">
              <PrivateRoute path="/posts" component={AllocationPage} />
              <PrivateRoute path="/post/:postId" component={PostDetailPage} />
              <PrivateRoute path="/preferences" component={UserPreference} />
              <Login path="/login" />
            </Router>
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
