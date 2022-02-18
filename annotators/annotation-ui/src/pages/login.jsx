import React, { useEffect } from "react";
import { graphql } from "gatsby";
import {
  Grommet,
  Box,
  Heading,
  Card,
  CardBody,
  Form,
  FormField,
  Button,
  TextInput,
  Text,
} from "grommet";
import TattleTheme from "../components/atoms/Theme";
import { PlainLink } from "../components/atoms/TattleLinks";
import {
  login,
  saveUserInLocalStorage,
  saveUserPreferenceInLocalStorage,
  saveUserSessionInLocalStorage,
} from "../controller/login";
import { navigate } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { isLoggedIn } from "../repository/user";

const IndexPage = ({ data }) => {
  const { t } = useTranslation();
  const { languages, changeLanguage } = useI18next();

  useEffect(() => {
    // async function setupLanguage() {
    // 	if (!(await isLoggedIn())) {
    // 		changeLanguage("en");
    // 	}
    // }
    // setupLanguage();
  }, []);

  async function tryLoggingIn(value) {
    try {
      const res = await login(value.username, value.password);
      const { user, session, preference } = res.data;
      if (user != undefined) {
        console.log({ user, session, preference });
        await saveUserInLocalStorage(user);
        await saveUserPreferenceInLocalStorage(preference);
        await saveUserSessionInLocalStorage(session);
        navigate(`/posts`);
      }
    } catch (err) {
      console.log("Error logging in User");
      console.log(err);
    }
  }

  return (
    <Grommet theme={TattleTheme} full>
      <Box fill justify={"center"}>
        <Box alignSelf={"center"} pad={"medium"}>
          <Box direction={"row-responsive"} gap={"medium"} align={"baseline"}>
            <Heading level={2}>{t("app_name")}</Heading>
            <Box direction={"row"} gap={"small"}>
              <Box onClick={() => changeLanguage("en")}>
                <Text size={"small"} color={"accent-1"}>
                  {" "}
                  English{" "}
                </Text>
              </Box>

              <Box onClick={() => changeLanguage("hi")}>
                <Text size={"small"} color={"accent-1"}>
                  {" "}
                  हिंदी
                </Text>
              </Box>
              <Box onClick={() => changeLanguage("ta")}>
                <Text size={"small"} color={"accent-1"}>
                  {" "}
                  தமிழ்{" "}
                </Text>
              </Box>
            </Box>
          </Box>
          <Text size={"small"} color={"dark-2"}>
            {"version : " + data.gitCommit.hash.slice(0, 6)}
          </Text>
          <Card width={"medium"} background={"light-1"}>
            <CardBody pad={"medium"}>
              <Form onSubmit={({ value }) => tryLoggingIn(value)}>
                <FormField
                  name={"username"}
                  htmlFor={"textinput-username"}
                  label={t("username")}
                >
                  <TextInput
                    id={"textinput-username"}
                    name={"username"}
                  ></TextInput>
                </FormField>
                <FormField
                  name={"password"}
                  htmlFor={"textinput-password"}
                  label={t("password")}
                >
                  <TextInput
                    id={"textinput-password"}
                    name={"password"}
                    type={"password"}
                  ></TextInput>
                </FormField>
                <Button type={"submit"} primary label={"Login"} />
              </Form>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Grommet>
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
    gitCommit(latest: { eq: true }) {
      hash
      date
    }
  }
`;
