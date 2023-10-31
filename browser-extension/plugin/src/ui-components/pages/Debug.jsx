import { useEffect, useContext, useState } from 'react';
import { Box, Text, Button, CheckBox } from 'grommet';
import { UserContext } from '../atoms/AppContext';
import repository from '../../repository';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import Api from './Api';
const { getUserData, getPreferenceData, setUserData, setPreferenceData } =
    repository;
const { resetAccount } = Api;

export function Debug() {
    const { user, setUser } = useContext(UserContext);
    const [isResetChecked, setIsResetChecked] = useState(false);
    const [localStorageData, setLocalStorageData] = useState(undefined);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        async function localStorage() {
            const userData = await getUserData();
            const preferenceData = await getPreferenceData();
            if(!ignore) {
                setLocalStorageData({ user: userData, preference: preferenceData });
            }
    
        }
        let ignore = false;
        localStorage();
        return () => {
            ignore = true;
        }
    }, []);

    async function clickReset() {
        try {
            await resetAccount(user.accessToken);
            await setUserData({});
            await setPreferenceData({});
            setUser(undefined);
        } catch (err) {
            console.log(err);
            // alert('Error Resetting User', err);
        }
    }

    return (
        <Box width="medium" gap={'small'} align={'start'}>
            {/* {config ? (
                <Box>
                    <Text weight={500}>Config</Text>
                    <Text>{JSON.stringify(config, null, 2)}</Text>
                </Box>
            ) : (
                <Text color={'status-critical'}>
                    {t('message_error_config_data')}
                </Text>
            )} */}
            {user ? (
                <Box gap={'medium'}>
                    <Box gap={'small'} direction="column">
                        {/* <Text weight={500}>Environment : </Text>
                        <Text>{config.ENVIRONMENT}</Text> */}
                        <Text weight={500}>User ID : </Text>
                        <Text>{user.id}</Text>
                        {/* <Text weight={500}>Access Token : </Text>
            <Text>{user.accessToken}</Text> */}
                    </Box>

                    {/* {localStorageData ? (
                        <Box>
                            <Text weight={500}>Local Storage</Text>
                            <Text>
                                {JSON.stringify(localStorageData, null, 2)}
                            </Text>
                        </Box>
                    ) : (
                        <Text color={'status-critical'}>
                            {t('message_error_local_storage')}
                        </Text>
                    )} */}

                    <Box
                        pad={'small'}
                        border={{ color: 'status-critical' }}
                        margin={{ top: 'xsmall' }}
                        fill={'horizontal'}
                        align="start"
                    >
                        <Text color={'status-critical'}>
                            {t('reset_account')}
                        </Text>
                        <Box height={'0.8em'}></Box>
                        <Box gap={'small'}>
                            <CheckBox
                                checked={isResetChecked}
                                label={t('reset_confirmation')}
                                onChange={(e) =>
                                    setIsResetChecked(e.target.checked)
                                }
                            />
                            <Button
                                label={t('reset_button')}
                                disabled={!isResetChecked}
                                secondary
                                onClick={clickReset}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Text>{t('message_no_user')}</Text>
            )}
        </Box>
    );
}
