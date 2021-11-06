import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { Trans, useTranslation, useI18next } from "gatsby-plugin-react-i18next";

const preference = {
  language: "en",
};

const IndexPage = () => {
  const { t } = useTranslation();
  const { languages, changeLanguage } = useI18next();

  useEffect(() => {
    changeLanguage(preference.language);
  }, []);

  return (
    <div>
      <h1>{t("Tattle Annotator")}</h1>
      <p>{t("Welcome")}</p>
    </div>
  );
};

export default IndexPage;

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
