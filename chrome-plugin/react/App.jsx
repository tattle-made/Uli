import { useEffect, useState } from "react";
import { Grommet, Box, Heading, Text, Paragraph, Button } from "grommet";
import { useTranslation } from "react-i18next";
import Theme from "./Theme";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { Debug } from "./Debug";
import { Preferences } from "./Preferences";
import { Resources } from "./Resources";
import { Archive } from "./Archive";
import "./i18n";
import { UserContext, NotificationContext } from "./AppContext";
import Api from "./Api";
import repository from "./repository";
import { langNameMap } from "./language";
const { registerNewUser } = Api;
const {
  initialize,
  getUserData,
  getPreferenceData,
  setUserData,
  setPreferenceData,
} = repository;

export function App() {
  const [user, setUser] = useState(undefined);
  const { t, i18n } = useTranslation();

  const [notification, setNotification] = useState(undefined);

  function showNotification(notification) {
    setNotification(notification);
    setTimeout(() => {
      setNotification(undefined);
    }, 1500);
  }

  /**
   * This loads an existing user into the UserContext at startup.
   */
  useEffect(async () => {
    const userData = await getUserData();
    const preferenceData = await getPreferenceData();
    if (userData != undefined && Object.keys(userData).length != 0) {
      setUser(userData);
    }
    if (preferenceData != undefined) {
      const { language } = preferenceData;
      i18n.changeLanguage(langNameMap[language]);
    }
  }, []);

  async function clickActivateAccount() {
    const { data } = await registerNewUser();
    const user = data.user;
    await setUserData(user);
    setUser(user);
  }

  return (
    <Grommet theme={Theme}>
      <UserContext.Provider value={{ user, setUser }}>
        <NotificationContext.Provider
          value={{ notification, showNotification }}
        >
          <Box width={{ min: "520px" }}>
            {notification ? (
              <Box background="accent-1" pad={"xsmall"}>
                <Text>{notification.message}</Text>
              </Box>
            ) : null}
            {user ? (
              <BrowserRouter>
                <nav>
                  <Box direction="row" gap={"medium"}>
                    <Link to="/">{t("navigation_preferences")}</Link>
                    <Link to="/archive">{t("navigation_archive")}</Link>
                    <Link to="/resources">{t("navigation_resources")}</Link>
                    <Link to="/debug">{t("navigation_debug")}</Link>
                  </Box>
                </nav>
                <Box height={"2.0em"} />
                <Routes>
                  <Route path={`/`} element={<Preferences />} />
                  <Route path={`/archive`} element={<Archive />} />
                  <Route path={`/resources`} element={<Resources />} />
                  <Route path={`/debug`} element={<Debug />} />
                </Routes>
              </BrowserRouter>
            ) : (
              <Box>
                <Button
                  label={t("activate_account")}
                  onClick={clickActivateAccount}
                ></Button>
              </Box>
            )}
          </Box>
        </NotificationContext.Provider>
      </UserContext.Provider>
    </Grommet>
  );
}
