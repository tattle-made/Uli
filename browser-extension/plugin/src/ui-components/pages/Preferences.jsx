import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Form,
    FormField,
    TextInput,
    TextArea,
    Text,
    Button,
    Select,
    CheckBox
} from 'grommet';
// import { HelpCircle } from 'react-feather';
import Api from '../pages/Api';
import repository from '../../repository';
import { useTranslation } from 'react-i18next';
import browserUtils from '../../chrome';
import { langNameMap } from '../atoms/language';
const { savePreference } = Api;
import { UserContext, NotificationContext } from '../atoms/AppContext';
import { userBrowserTabs } from '../../browser-compat';
const { setPreferenceData, getPreferenceData } = repository;

const defaultValue = {};

export function Preferences() {
    const [localPreferences, setLocalPreferences] = useState(defaultValue);
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const [enable, setEnable] = useState(true);
    const [enableML, setEnableMLOption] = useState(false);
    const [enableSlurReplacement, setEnableSlurReplacement] = useState(true);
    const [enableSlurMetadata, setEnableSlurMetadata] = useState(false);
    const [storeLocally, setStoreLocally] = useState(true);
    const [language, setLanguage] = useState('English');
    const { t, i18n } = useTranslation();

    // GET PREFERENCE FOR THIS USER FROM LS
    useEffect(() => {
        async function getPrefsLocalStorage() {
            try {
                const preference = await getPreferenceData();
                console.log("preference " , preference)
                if (!ignore) {
                    // console.log({ preference });
                    setLocalPreferences(preference);
                    if (
                        preference != undefined &&
                        Object.keys(preference).length != 0
                    ) {
                        const {
                            enable,
                            enableML,
                            storeLocally,
                            language,
                            enableSlurReplacement,
                            enableSlurMetadata
                        } = preference;
                        if (enable != undefined) {
                            setEnable(enable);
                        }
                        if (enableML != undefined) {
                            setEnableMLOption(enableML);
                        }
                        if (storeLocally != undefined) {
                            setStoreLocally(storeLocally);
                        }
                        if (language != undefined) {
                            setLanguage(language);
                        }
                        if (enableSlurReplacement != undefined) {
                            setEnableSlurReplacement(enableSlurReplacement);
                        }
                        if (enableSlurMetadata != undefined) {
                            setEnableSlurMetadata(enableSlurMetadata);
                        }
                    }
                }
            } catch (err) {
                showNotification({
                    type: 'error',
                    message: t('message_error_preference_data_load')
                });
                // alert(err);
            }
        }

        let ignore = false;
        getPrefsLocalStorage();
        return () => {
            ignore = true;
        };
    }, [user]);

    async function handleSlurReplacementAndSlurMetadata(enableSlurReplacement, enableSlurMetadata) {
        try {
            
            
            const confirmed = window.confirm(
                'This action requires a page reload. Do you want to continue?'
            );
            if (confirmed) {
                const tabsCurrent = await userBrowserTabs.query({
                    active: true,
                    currentWindow: true
                });
                const tabId = tabsCurrent[0].id;

                await setPreferenceData({
                    ...localPreferences,
                    enableSlurReplacement,
                    enableSlurMetadata
                });

                userBrowserTabs.sendMessage(tabId, {
                    type: 'ULI_ENABLE_SLUR_REPLACEMENT',
                    payload: enableSlurReplacement
                });
                userBrowserTabs.reload(tabId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function changeEnableSlurReplacementOption(checked) {
        console.log(checked);
        if(checked === true) setEnableSlurMetadata(false); 
        setEnableSlurReplacement(checked);
    }

    async function changeEnableSlurMetadataOption(checked) {
        console.log(checked);
        if(checked === true) setEnableSlurReplacement(false); 
        setEnableSlurMetadata(checked);
    }

    async function clickSave(preference) {
        const preferenceInLS = await getPreferenceData();
        // alert(JSON.stringify({preferenceInLS, preference}))

        try {
            const preferenceRemote = await savePreference(
                user.accessToken,
                preference
            );

            await setPreferenceData({
                ...preferenceRemote.data,
                enable,
                enableML,
                storeLocally,
                language,
                enableSlurReplacement,
                enableSlurMetadata
            });

            const enableSlurReplacementChanged =
                enableSlurReplacement !== preferenceInLS.enableSlurReplacement;

            const enableSlurMetadataChanged =
                enableSlurMetadata !== preferenceInLS.enableSlurMetadata;

            if (enableSlurReplacementChanged || enableSlurMetadataChanged) {
                console.log('enable val changed', enableSlurReplacementChanged);
                await handleSlurReplacementAndSlurMetadata(enableSlurReplacement, enableSlurMetadata);
            }

            showNotification({
                type: 'message',
                message: t('message_ok_saved')
            });
            browserUtils.sendMessage('updateData', undefined);
        } catch (err) {
            showNotification({
                type: 'error',
                message: t('message_error_preference_data_save')
            });
            console.log(err);
        }
    }

    async function changeLanguage(option) {
        setLanguage(option);
        i18n.changeLanguage(langNameMap[option]);
    }

    async function changeLocalStorageOption(checked) {
        setStoreLocally(checked);
    }

    // async function changeEnableMLOption(checked) {
    //     setEnableMLOption(checked);
    // }

    return (
        <Box fill gap={'medium'}>
            {/* <Anchor
                href={'http://uli.tattle.co.in/user-guide/#conf'}
                target={'_blank'}
            >
                <Box direction={'row'} gap={'small'}>
                    <HelpCircle size={20} color={'#343434'} />
                    <Text>Read Configuration Guide Here</Text>
                </Box>
            </Anchor> */}
            {/* <CheckBox
        checked={enable}
        label={t("enable_plugin")}
        onChange={(e) => setEnable(e.target.checked)}
      /> */}
            <Box direction="column" gap={'small'}>
                <Text>{t('language')}</Text>
                <Select
                    options={['English', 'Tamil', 'Hindi']}
                    value={language}
                    onChange={({ option }) => {
                        changeLanguage(option);
                    }}
                    size={'small'}
                />
            </Box>
            <Box direction="row" gap={'large'} align="center">
                <CheckBox
                    checked={storeLocally}
                    label={t('store_locally')}
                    onChange={(e) => changeLocalStorageOption(e.target.checked)}
                />
            </Box>
            {/* <Box direction="row" gap={'large'} align="center">
                <CheckBox
                    checked={enableML}
                    label={t('enable_ml')}
                    onChange={(e) => changeEnableMLOption(e.target.checked)}
                />
            </Box> */}
            <Box direction="row" gap={'large'} align="center">
                <CheckBox
                    checked={enableSlurReplacement}
                    label="Enable Slur Replacement"
                    onChange={(e) =>
                        changeEnableSlurReplacementOption(e.target.checked)
                    }
                />
            </Box>

            <Box direction="row" gap={'large'} align="center">
                <CheckBox
                    checked={enableSlurMetadata}
                    label="Enable Slur Metadata"
                    onChange={(e) =>
                        changeEnableSlurMetadataOption(e.target.checked)
                    }
                />
            </Box>

            <Box
                height={'2px'}
                background={'dark-4'}
                margin={{ top: '1.2em', bottom: '1.2em' }}
            />
            <Form
                value={localPreferences}
                onChange={(nextValue) => {
                    setLocalPreferences(nextValue);
                }}
                onSubmit={({ value }) => {
                    clickSave(value);
                }}
                onReset={() => setLocalPreferences(defaultValue)}
            >
                {/* <FormField
          name="language"
          htmlFor="languageId"
          label={t("language")}
          component={Select}
          options={["English", "Tamil", "Hindi"]}
          disabled={!enable}
          onChange={()=>{}}
        /> */}

                <FormField
                    id="app_field_email"
                    name="email"
                    htmlFor="emailId"
                    label={
                        <Box direction={'row'} gap={'small'}>
                            <Text>{t('your_email_address')}</Text>
                        </Box>
                    }
                    type="email"
                    disabled={!enable}
                    component={TextInput}
                />

                {/* <FormField
                    name="friends"
                    htmlFor="friendsId"
                    label={
                        <Box direction={'row'} gap={'small'}>
                            <Text>{t('friends')}</Text>
                            <Anchor
                                href={
                                    'http://uli.tattle.co.in/user-guide/#conf'
                                }
                                target={'_blank'}
                            >
                                <HelpCircle size={16} color={'#343434'} />
                            </Anchor>
                        </Box>
                    }
                    disabled={!enable}
                    component={TextArea}
                /> */}

                <FormField
                    name="slurList"
                    htmlFor="slurListId"
                    label={
                        <Box direction={'row'} gap={'small'}>
                            <Text>{t('your_slur_list')}</Text>
                        </Box>
                    }
                    disabled={!enable}
                    component={TextArea}
                />

                <Box
                    margin={{ top: 'medium' }}
                    direction="row"
                    gap={'small'}
                    justify="start"
                >
                    <Button
                        id="app_btn_save"
                        fill={false}
                        label={t('save')}
                        type="submit"
                        primary
                    />

                    {/* <Button onClick={() => console.log("clicked")} /> */}
                </Box>
            </Form>
        </Box>
    );
}
