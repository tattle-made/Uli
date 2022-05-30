import { useEffect, useState } from 'react';
import { Grommet, Box, Text, Button } from 'grommet';
import { useTranslation } from 'react-i18next';
import Theme from '../atoms/Theme';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Debug } from './Debug';
import { Preferences } from './Preferences';
import { Resources } from './Resources';
import { Archive } from './Archive';
import '../atoms/i18n';
import { UserContext, NotificationContext } from '../atoms/AppContext';
import Api from './Api';
import repository from '../../repository';
import { langNameMap } from '../atoms/language';
const { getPreferenceData } = repository;

export function App() {
    const [user, setUser] = useState(undefined);
    const [notification, setNotification] = useState(undefined);
    const { t, i18n } = useTranslation();
    const { registerNewUser } = Api;
    const { getUserData, setUserData } = repository;

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
        if (userData != undefined && Object.keys(userData).length != 0) {
            setUser(userData);
        }
        // alert(process.env.API_URL);
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
                    <Box width={{ min: '520px' }} background={'#fdf6ed'}>
                        {notification ? (
                            <Box background="accent-1" pad={'xsmall'}>
                                <Text>{notification.message}</Text>
                            </Box>
                        ) : null}
                        <Box direction={'row'} gap={'medium'} align={'center'}>
                            <Box
                                width={'3em'}
                                hoverIndicator={false}
                                focusIndicator={false}
                                margin={{ bottom: 'medium' }}
                            >
                                <img
                                    src={'http://uli.tattle.co.in/Uli_Logo.png'}
                                    alt={'Uli Logo'}
                                />
                            </Box>
                            <Text size={'small'} color={'dark-2'}>
                                {process.env.NODE_ENV}
                            </Text>
                        </Box>
                        {user ? (
                            <BrowserRouter>
                                <nav>
                                    <Box direction="row" gap={'medium'}>
                                        <Link to="/">
                                            {t('navigation_preferences')}
                                        </Link>
                                        <Link to="/archive">
                                            {t('navigation_archive')}
                                        </Link>
                                        <Link to="/resources">
                                            {t('navigation_resources')}
                                        </Link>
                                        <Link to="/debug">
                                            {t('navigation_debug')}
                                        </Link>
                                    </Box>
                                </nav>
                                <Box height={'2.0em'} />
                                <Routes>
                                    <Route
                                        path={`/`}
                                        element={<Preferences />}
                                    />
                                    <Route
                                        path={`/archive`}
                                        element={<Archive />}
                                    />
                                    <Route
                                        path={`/resources`}
                                        element={<Resources />}
                                    />
                                    <Route
                                        path={`/debug`}
                                        element={<Debug />}
                                    />
                                </Routes>
                            </BrowserRouter>
                        ) : (
                            <Box>
                                <Button
                                    label={t('activate_account')}
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
