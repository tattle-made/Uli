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
const { getPreferenceData, setPreferenceData } = repository;
import { ToggleSwitchCustom } from '../atoms/ToggleSwitchCustom';
import { Off } from './Off';

export function App() {
    const [user, setUser] = useState(undefined);
    const [notification, setNotification] = useState(undefined);
    const { t, i18n } = useTranslation();
    const { registerNewUser } = Api;
    const { getUserData, setUserData } = repository;
    let navigate = useNavigate();
    const [, setAccountActivated] = useState(false);
    const [toggleSwitchOn, setToggleSwitchOn] = useState(true);

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
        try {
            const userData = await getUserData();
            const preferenceData = await getPreferenceData();

            if (userData != undefined && Object.keys(userData).length !== 0) {
                setUser(userData);
            }

            if (preferenceData != undefined) {
                const { language, uliEnableToggle } = preferenceData;

                i18n.changeLanguage(langNameMap[language]);

                if (uliEnableToggle) {
                    navigate('/preferences');
                } else {
                    navigate('/off');
                }
                setToggleSwitchOn(uliEnableToggle);
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
        // if (userData != undefined && Object.keys(userData).length != 0) {
        //     setUser(userData);
        // }
        // alert(process.env.API_URL);
    }, []);

    let userBrowser;
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) {
        userBrowser = 'chrome';
    } else if (userAgent.includes('firefox')) {
        userBrowser = 'firefox';
    } else {
        userBrowser = 'unsupported';
    }
    let userBrowserTabs;
    if (userBrowser === 'firefox') {
        userBrowserTabs = browser.tabs;
    } else if (userBrowser === 'chrome') {
        userBrowserTabs = chrome.tabs;
    }

    async function clickActivateAccount() {
        const { data } = await registerNewUser();
        const user = data.user;
        const confirmed = window.confirm(
            'To start Uli, please refresh the page'
        );
        if (confirmed) {
            await setUserData(user);
            setUser(user);
            setAccountActivated(true);
            await setPreferenceData({
                uliEnableToggle: true
            });
            userBrowserTabs.reload();
            navigate('/preferences');
        }
    }

    const handleToggleSwitchChange = async () => {
        try {
            const tabsCurrent = await userBrowserTabs.query({
                active: true,
                currentWindow: true
            });
            const confirmed = window.confirm(
                'Changing the toggle switch setting requires a page reload. Do you want to continue?'
            );
            if (confirmed) {
                setToggleSwitchOn(!toggleSwitchOn);
                const pref = await getPreferenceData();
                await setPreferenceData({
                    ...pref,
                    uliEnableToggle: !toggleSwitchOn
                });
                if (!toggleSwitchOn) {
                    navigate('/preferences');
                } else {
                    navigate('/off');
                }

                const tabId = tabsCurrent[0].id;
                userBrowserTabs.sendMessage(tabId, {
                    type: 'ULI_ENABLE_TOGGLE',
                    payload: toggleSwitchOn
                });
                userBrowserTabs.reload(tabId);
            }
        } catch (error) {
            console.error('Error navigating:', error);
        }
    };

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
                            <Box direction={'row'} gap={'small'}>
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
                            </Box>
                            <Box flex={'grow'}></Box>
                            {user ? (
                                <ToggleSwitchCustom
                                    checked={toggleSwitchOn}
                                    onToggleChange={() =>
                                        handleToggleSwitchChange()
                                    }
                                />
                            ) : null}
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
                                <>
                                    {toggleSwitchOn && (
                                        <Box direction="row" gap={'medium'}>
                                            <Link
                                                id="app_nav_preference"
                                                to="/preferences"
                                            >
                                                {t('navigation_preferences')}
                                            </Link>
                                            <Link
                                                id="app_nav_archive"
                                                to="/archive"
                                            >
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
                                    )}
                                </>

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
                                    <Route path="off" element={<Off />} />
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
