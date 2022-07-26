import { useEffect, useState } from 'react';
import { Grommet, Box, Text, Button } from 'grommet';
import { useTranslation } from 'react-i18next';
import Theme from '../atoms/Theme';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
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
    let navigate = useNavigate();

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

        navigate('/preferences');
        // if (userData != undefined && Object.keys(userData).length != 0) {
        //     setUser(userData);
        // }
        // alert(process.env.API_URL);
    }, []);

    async function clickActivateAccount() {
        const { data } = await registerNewUser();
        const user = data.user;
        await setUserData(user);
        setUser(user);
        navigate('/preferences');
    }

    return (
        <Grommet theme={Theme}>
            <UserContext.Provider value={{ user, setUser }}>
                <NotificationContext.Provider
                    value={{ notification, showNotification }}
                >
                    <Box
                        width={{ min: '520px' }}
                        background={'#fdf6ed'}
                        pad={'small'}
                    >
                        <Box direction={'row'} gap={'medium'} align={'center'}>
                            <Box
                                width={'3em'}
                                hoverIndicator={false}
                                focusIndicator={false}
                                margin={{ bottom: 'medium' }}
                            >
                                <img
                                    src={
                                        'https://uli-media.tattle.co.in/assets/uli-logo.png'
                                    }
                                    alt={'Uli Logo'}
                                />
                            </Box>
                            <Text
                                id="app_label_environment"
                                size={'small'}
                                color={'dark-2'}
                            >
                                {process.env.NODE_ENV}
                            </Text>
                            {notification ? (
                                <Box
                                    background="accent-1"
                                    pad={{
                                        top: 'xsmall',
                                        bottom: 'xsmall',
                                        left: 'medium',
                                        right: 'medium'
                                    }}
                                    margin={{ bottom: 'xsmall' }}
                                >
                                    <Text>{notification.message}</Text>
                                </Box>
                            ) : null}
                        </Box>

                        {user ? (
                            <div>
                                <Box direction="row" gap={'medium'}>
                                    <Link
                                        id="app_nav_preference"
                                        to="/preferences"
                                    >
                                        {t('navigation_preferences')}
                                    </Link>
                                    <Link id="app_nav_archive" to="/archive">
                                        {t('navigation_archive')}
                                    </Link>
                                    <Link
                                        id="app_nav_resources"
                                        to="/resources"
                                    >
                                        {t('navigation_resources')}
                                    </Link>
                                    <Link to="/debug">
                                        {t('navigation_debug')}
                                    </Link>
                                </Box>

                                <Box height={'2.0em'} />

                                <Routes>
                                    <Route></Route>
                                    <Route
                                        exact
                                        path="/preferences"
                                        element={<Preferences />}
                                    />
                                    <Route
                                        path="archive"
                                        element={<Archive />}
                                    />
                                    <Route
                                        path="resources"
                                        element={<Resources />}
                                    />
                                    <Route path="debug" element={<Debug />} />
                                </Routes>
                            </div>
                        ) : (
                            <Box>
                                <Button
                                    id="app_btn_activate"
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
