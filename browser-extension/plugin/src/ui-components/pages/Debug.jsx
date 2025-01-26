import { useEffect, useContext, useState } from 'react';
import {
    Box,
    Text,
    Button,
    CheckBox,
    Form,
    FormField,
    TextInput,
    Heading,
    Anchor
} from 'grommet';
import { UserContext, NotificationContext } from '../atoms/AppContext';
import repository from '../../repository';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import Api from './Api';
const { getUserData, getPreferenceData, setUserData, setPreferenceData } =
    repository;
const { resetAccount } = Api;
import { Hide, View } from 'grommet-icons';
import config from '../../config';
import { userLogin } from '../../api/user';

const { API_URL } = config;

export function Debug() {
    const { user, setUser } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);

    const [localStorageData, setLocalStorageData] = useState(undefined);
    const { t, i18n } = useTranslation();
    const [isResetChecked, setIsResetChecked] = useState(false);

    // useEffect(() => {
    //     async function localStorage() {
    //         const userData = await getUserData();
    //         const preferenceData = await getPreferenceData();
    //         if (!ignore) {
    //             setLocalStorageData({
    //                 user: userData,
    //                 preference: preferenceData
    //             });
    //         }
    //     }
    //     let ignore = false;
    //     localStorage();
    //     return () => {
    //         ignore = true;
    //     };
    // }, []);

    return (
        <Box>
            {user ? (
                <Box>
                    <Text>
                        Hello, <b>{user?.email}</b> !
                    </Text>
                    <Box
                        pad={'small'}
                        border={{ color: 'status-critical' }}
                        margin={{ top: 'xsmall' }}
                        fill={'horizontal'}
                        align="start"
                    >
                        <Text color={'status-critical'}>Logout</Text>
                        <Box height={'0.8em'}></Box>
                        <Box gap={'small'}>
                            <CheckBox
                                checked={isResetChecked}
                                label={
                                    'I am sure I want to logout from this account'
                                }
                                onChange={(e) =>
                                    setIsResetChecked(e.target.checked)
                                }
                            />
                            <Button
                                label={'Logout'}
                                disabled={!isResetChecked}
                                secondary
                                onClick={async () => {
                                    await setUserData(null);
                                    setUser(null);
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <LoginForm />
            )}
        </Box>
    );
}

function LoginForm() {
    const [reveal, setReveal] = useState(false);
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const { showNotification } = useContext(NotificationContext);
    const { user, setUser } = useContext(UserContext);

    async function handleSubmit({ value }) {
        console.log('Form Submitted:', value);

        try {
            let data = await userLogin(value);

            console.log('LOGIN SUCCESS: ', data);
            showNotification({
                type: 'info',
                message: 'Login Successful'
            });

            const { email, token } = data;

            let setData = { email, token };

            await setUserData(setData);
            setUser(setData);
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                // console.log('UNAUTHORIZED', error);
                showNotification({
                    type: 'error',
                    message: 'Unauthorized'
                });
            } else if (error?.response?.status >= 500) {
                // console.log('UNAUTHORIZED', error);
                showNotification({
                    type: 'error',
                    message: 'Server Error'
                });
            } else {
                // console.log('SOMETHING WENT WRONG', error);
                showNotification({
                    type: 'error',
                    message: 'Something Went Wrong'
                });
            }
        }
    }

    return (
        <Box>
            <Box>
                <Heading
                    width={'full'}
                    level={2}
                    textAlign="center"
                    margin="none"
                >
                    Login
                </Heading>
                <Form
                    value={formValues}
                    onChange={(nextValue) => setFormValues(nextValue)}
                    onSubmit={handleSubmit}
                >
                    <FormField name="email" label="Email" required>
                        <TextInput
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </FormField>

                    <Box direction="row" align="center">
                        <FormField
                            width={'full'}
                            name="password"
                            label="Password"
                            required
                        >
                            <TextInput
                                name="password"
                                type={reveal ? 'text' : 'password'}
                                placeholder="Enter your password"
                            />
                        </FormField>
                        <Button
                            icon={
                                reveal ? (
                                    <View size="medium" />
                                ) : (
                                    <Hide size="medium" />
                                )
                            }
                            onClick={() => setReveal(!reveal)}
                        />
                    </Box>
                    <Box direction="row" gap="small" margin={{ top: 'medium' }}>
                        <Button
                            label="Reset"
                            onClick={() =>
                                setFormValues({ email: '', password: '' })
                            }
                        />
                        <Button type="submit" label="Login" primary />
                    </Box>
                    <Box margin={{ top: '4px' }}>
                        <Text size="small">
                            Don't have an account?{' '}
                            <Anchor
                                href={`${API_URL}/users/register`}
                                label="Register here"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        </Text>
                    </Box>
                </Form>
            </Box>
        </Box>
    );
}

// import { useEffect, useContext, useState } from 'react';
// import { Box, Text, Button, CheckBox } from 'grommet';
// import { UserContext } from '../atoms/AppContext';
// import repository from '../../repository';
// import config from '../../config';
// import { useTranslation } from 'react-i18next';
// import Api from './Api';
// const { getUserData, getPreferenceData, setUserData, setPreferenceData } =
//     repository;
// const { resetAccount } = Api;

// export function Debug() {
//     const { user, setUser } = useContext(UserContext);
//     const [isResetChecked, setIsResetChecked] = useState(false);
//     const [localStorageData, setLocalStorageData] = useState(undefined);
//     const { t, i18n } = useTranslation();

//     useEffect(() => {
//         async function localStorage() {
//             const userData = await getUserData();
//             const preferenceData = await getPreferenceData();
//             if(!ignore) {
//                 setLocalStorageData({ user: userData, preference: preferenceData });
//             }

//         }
//         let ignore = false;
//         localStorage();
//         return () => {
//             ignore = true;
//         }
//     }, []);

//     async function clickReset() {
//         try {
//             await resetAccount(user.accessToken);
//             await setUserData({});
//             await setPreferenceData({});
//             setUser(undefined);
//         } catch (err) {
//             console.log(err);
//             // alert('Error Resetting User', err);
//         }
//     }

//     return (
//         <Box width="medium" gap={'small'} align={'start'}>
//             {/* {config ? (
//                 <Box>
//                     <Text weight={500}>Config</Text>
//                     <Text>{JSON.stringify(config, null, 2)}</Text>
//                 </Box>
//             ) : (
//                 <Text color={'status-critical'}>
//                     {t('message_error_config_data')}
//                 </Text>
//             )} */}
//             {user ? (
//                 <Box gap={'medium'}>
//                     <Box gap={'small'} direction="column">
//                         {/* <Text weight={500}>Environment : </Text>
//                         <Text>{config.ENVIRONMENT}</Text> */}
//                         <Text weight={500}>User ID : </Text>
//                         <Text>{user.id}</Text>
//                         {/* <Text weight={500}>Access Token : </Text>
//             <Text>{user.accessToken}</Text> */}
//                     </Box>

//                     {/* {localStorageData ? (
//                         <Box>
//                             <Text weight={500}>Local Storage</Text>
//                             <Text>
//                                 {JSON.stringify(localStorageData, null, 2)}
//                             </Text>
//                         </Box>
//                     ) : (
//                         <Text color={'status-critical'}>
//                             {t('message_error_local_storage')}
//                         </Text>
//                     )} */}

//                     <Box
//                         pad={'small'}
//                         border={{ color: 'status-critical' }}
//                         margin={{ top: 'xsmall' }}
//                         fill={'horizontal'}
//                         align="start"
//                     >
//                         <Text color={'status-critical'}>
//                             {t('reset_account')}
//                         </Text>
//                         <Box height={'0.8em'}></Box>
//                         <Box gap={'small'}>
//                             <CheckBox
//                                 checked={isResetChecked}
//                                 label={t('reset_confirmation')}
//                                 onChange={(e) =>
//                                     setIsResetChecked(e.target.checked)
//                                 }
//                             />
//                             <Button
//                                 label={t('reset_button')}
//                                 disabled={!isResetChecked}
//                                 secondary
//                                 onClick={clickReset}
//                             />
//                         </Box>
//                     </Box>
//                 </Box>
//             ) : (
//                 <Text>{t('message_no_user')}</Text>
//             )}
//         </Box>
//     );
// }
