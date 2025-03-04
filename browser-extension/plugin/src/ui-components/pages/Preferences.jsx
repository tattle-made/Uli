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
    CheckBox,
    RadioButtonGroup,
    Tip,
    Spinner
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
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FormClose, FormPreviousLink, LinkPrevious, Sync } from 'grommet-icons';
const { setPreferenceData, getPreferenceData } = repository;

const defaultValue = {};

export function Preferences() {
    return <Outlet />;
}

export function PreferencesHome() {
    const [localPreferences, setLocalPreferences] = useState(defaultValue);
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const [enable, setEnable] = useState(true);
    const [enableSlurReplacement, setEnableSlurReplacement] = useState(true);
    const [enableSlurMetadata, setEnableSlurMetadata] = useState(false);
    const [language, setLanguage] = useState('English');
    const { t, i18n } = useTranslation();
    const [syncSlurs, setsyncSlurs] = useState(false);
    const radioOptions = [
        {
            value: 'replace',
            id: 'radio-replace',
            label: 'Enable Slur Replacement'
        },
        {
            value: 'metadata',
            id: 'radio-metadata',
            label: 'Enable Slur Metadata'
        },
        {
            value: 'off',
            id: 'radio-off',
            label: 'Turn off'
        }
    ];
    const [selectedOption, setSelectedOption] = useState(undefined);

    // GET PREFERENCE FOR THIS USER FROM LS

    useEffect(() => {
        async function getPrefsLocalStorage() {
            try {
                const preference = await getPreferenceData();
                console.log('preference ', preference);

                const { enableSlurMetadata, enableSlurReplacement, language } =
                    preference;
                if (!ignore) {
                    // console.log({ preference });
                    setLocalPreferences(preference);
                    if (
                        preference != undefined &&
                        Object.keys(preference).length != 0
                    ) {
                        if (language) {
                            setLanguage(language);
                        }
                        if (enableSlurReplacement) {
                            setEnableSlurReplacement(enableSlurReplacement);
                            if (enableSlurReplacement) {
                                console.log('HEREE');
                                setSelectedOption('replace');
                            }
                        }
                        if (enableSlurMetadata) {
                            setEnableSlurMetadata(enableSlurMetadata);
                            if (enableSlurMetadata) {
                                console.log('HEREE META');
                                setSelectedOption('metadata');
                            }
                        }
                        if (!enableSlurMetadata && !enableSlurReplacement) {
                            setSelectedOption('off');
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

    useEffect(() => {
        console.log('SELECTED OPTION: ', selectedOption);

        if (selectedOption == 'replace') {
            setEnableSlurReplacement(true);
            setEnableSlurMetadata(false);
        } else if (selectedOption == 'metadata') {
            setEnableSlurReplacement(false);
            setEnableSlurMetadata(true);
        } else if (selectedOption == 'off') {
            setEnableSlurReplacement(false);
            setEnableSlurMetadata(false);
        }
    }, [selectedOption]);

    async function handleSlurReplacementAndSlurMetadata(
        enableSlurReplacement,
        enableSlurMetadata
    ) {
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

                // userBrowserTabs.sendMessage(tabId, {
                //     type: 'ULI_ENABLE_SLUR_REPLACEMENT',
                //     payload: enableSlurReplacement
                // });
                userBrowserTabs.reload(tabId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function changeEnableSlurReplacementOption(checked) {
        console.log(checked);
        if (checked === true) setEnableSlurMetadata(false);
        setEnableSlurReplacement(checked);
    }

    async function changeEnableSlurMetadataOption(checked) {
        console.log(checked);
        if (checked === true) setEnableSlurReplacement(false);
        setEnableSlurMetadata(checked);
    }

    async function clickSave(preference) {
        // console.log("PREFERENCES ARE: ", preference)
        const preferenceInLS = await getPreferenceData();
        // alert(JSON.stringify({preferenceInLS, preference}))

        try {
            await setPreferenceData({
                language,
                enableSlurReplacement,
                enableSlurMetadata
            });
            // if (user) {
            //     const preferenceRemote = await savePreference(
            //         user.accessToken,
            //         preference
            //     );

            //     await setPreferenceData({
            //         ...preferenceRemote.data,
            //         language,
            //         enableSlurReplacement,
            //         enableSlurMetadata
            //     });
            // } else {
            //     await setPreferenceData({
            //         language,
            //         enableSlurReplacement,
            //         enableSlurMetadata
            //     });
            // }

            const enableSlurReplacementChanged =
                enableSlurReplacement !== preferenceInLS.enableSlurReplacement;

            const enableSlurMetadataChanged =
                enableSlurMetadata !== preferenceInLS.enableSlurMetadata;

            if (enableSlurReplacementChanged || enableSlurMetadataChanged) {
                console.log('enable val changed', enableSlurReplacementChanged);
                await handleSlurReplacementAndSlurMetadata(
                    enableSlurReplacement,
                    enableSlurMetadata
                );
            }

            showNotification({
                type: 'message',
                message: t('message_ok_saved')
            });
            // browserUtils.sendMessage('updateData', undefined);
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

    async function handleSyncApprovedSlurs() {
        try {
            setsyncSlurs(true);
            const res = await browserUtils.sendMessageSW(
                "syncApprovedCrowdsourcedSlursToBG",
                undefined
            );
            // console.log("RESS in sync", res);
            if (res.status == 200) {
                console.log('Sync message sent to background.js');
                showNotification({
                    type: 'message',
                    message: 'Synced!'
                });
            } else if (res.status == 400) {
                showNotification({
                    type: 'error',
                    message: 'Unable to Sync'
                });
            }
        } catch (error) {
            console.error('Error syncing approved slurs:', error);
            showNotification({
                type: 'error',
                message: 'Unable to Sync'
            });
        } 
        finally {
            setsyncSlurs(false);
        }
    }

    return (
        <Box fill gap={'medium'}>
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

            <Box height={'0.8em'}>
            </Box>
            <RadioButtonGroup
                name="plugin-options"
                options={radioOptions}
                value={selectedOption}
                onChange={(event) => setSelectedOption(event.target.value)}
            />
            
            <Box height={'0.8em'}>
            </Box>
            <Link to={'/preferences/slur-list'}>
                <Button label="Add to your personal block list" />
            </Link>

            <Box height={'0.8em'}>
            </Box>

            <Box>
                <Box direction='row' align='center' gap='small'>
                <Button
                        icon={syncSlurs? <Spinner />:<Sync />}
                        onClick={handleSyncApprovedSlurs}
                        // title="Add Approved Crowdsourced Slurs"
                        
                        disabled={syncSlurs}
                        label='Download New Crowdsourced Slurs'
                        // style={{
                        //     border: '1px solid black',
                        //     borderRadius: '4px',
                        //     padding: '4px'
                        // }}
                        />
                </Box>
            </Box>

            {/* <Box
                height={'2px'}
                // background={'dark-4'}
                margin={{ top: '1.2em', bottom: '1.2em' }}
            /> */}
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
                    name="slurList"
                    htmlFor="slurListId"
                    label={
                        <Box direction={'row'} gap={'small'}>
                            <Text>{t('your_slur_list')}</Text>
                        </Box>
                    }
                    disabled={!enable}
                    component={TextArea}
                /> */}

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

export function PreferencesSlurList() {
    const navigate = useNavigate();
    const [resetSlurs, setResetSlurs] = useState([]);
    const [slurs, setSlurs] = useState([]);
    const [displaySlurs, setDisplaySlurs] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();
    // const [localPreferences, setLocalPreferences] = useState(defaultValue);
    const { user } = useContext(UserContext);
    const [success, setSuccess] = useState('');
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        async function getPrefsLocalStorage() {
            console.log('brow util', browserUtils);
            try {
                const response =
                    await browserUtils.sendMessageSW('fetchPersonalSlursToBG');
                console.log('personal data from Service Worker', response);
                if (response) {
                    const slurArr = response;
                    setSlurs(slurArr);
                    setDisplaySlurs(slurArr);
                    setResetSlurs(slurArr);
                } else {
                    console.error('Error fetching slurs:', response);
                    showNotification({
                        type: 'error',
                        message: t('message_error_preference_data_load')
                    });
                }
            } catch (err) {
                console.error('Error loading personal slurs:', err);
                showNotification({
                    type: 'error',
                    message: t('message_error_preference_data_load')
                });
            }
        }

        let ignore = false;
        getPrefsLocalStorage();
        setResetSlurs(slurs);
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        setError('');
        setSuccess('');

        if (input.trim() == '') {
            setDisplaySlurs(slurs);
        } else {
            searchSlur(input);
        }
    }, [input]);

    function searchSlur(input) {
        filterSlur = slurs.filter((s) => s.includes(input));
        setDisplaySlurs(filterSlur);
    }

    function addSlur(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (input.trim().length > 45) {
            setError('Character limit exceeded. Please add a shorter word.');
            return;
        }
        if (slurs.includes(input.trim())) {
            setError('Slur already exists');
            return;
        }
        console.log('Added Slur: ', input);
        if (input) {
            if (input.includes(',')) {
                let slursArr = input
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => !slurs.includes(s));
                setSlurs([...slurs, ...slursArr]);
            } else {
                setSlurs([...slurs, input.trim()]);
            }
        }
        setInput('');
    }

    async function deleteSlurUI(slur) {
        // Remove from UI
        setSlurs((prevSlurs) => prevSlurs.filter((s) => s !== slur));
        setDisplaySlurs((prevSlurs) => prevSlurs.filter((s) => s !== slur));
    }

    function resetAllSlurs() {
        setError('');
        setSuccess('');

        if (slurs == resetSlurs) {
            setError('No new slurs were added.');
            return;
        }

        setSlurs(resetSlurs);
        setDisplaySlurs(resetSlurs);
    }

    async function saveSlurs() {
        setError('');
        setSuccess('');

        if (slurs == resetSlurs) {
            setError('No new slurs were added.');
            return;
        }

        try {
            browserUtils.sendMessageSW('updateDataMsgToBG', slurs);

            setResetSlurs(slurs);
            // setSuccess("Saved Successfully!")
            showNotification({
                type: 'message',
                message: t('message_ok_saved')
            });
        } catch (error) {
            console.error(error);
            setError('Something went wrong while saving.');
        }
    }
    return (
        <Box>
            <Box direction="row" align="center" justify="start">
                <Button
                    icon={<FormPreviousLink color="plain" size="medium" />}
                    fill={false}
                    onClick={() => navigate('/preferences')}
                />
                <Text>Add to your personal block list</Text>
            </Box>

            <Box margin={{ top: '1em' }}>
                <Text size="small">Add slurs</Text>
                <Form onSubmit={addSlur}>
                    <Box direction="row" gap="small">
                        <TextInput
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button label="add" type="submit" />
                    </Box>
                </Form>
                <Text
                    margin={{ top: '0.2em' }}
                    size="xsmall"
                    color={error ? 'red' : 'green'}
                >
                    {error} {success}
                </Text>

                <Box
                    cssGap={true}
                    margin={{ top: '0.5em' }}
                    direction="row"
                    style={{
                        gap: '0.2em 0.2em',
                        maxHeight: window.innerHeight / 1.5
                    }}
                    overflow={{ vertical: 'auto' }}
                    // height={{max:"5em"}}
                    wrap
                >
                    {displaySlurs && displaySlurs.length > 0 ? (
                        displaySlurs.map((slur, key) => {
                            return (
                                <SlurChip
                                    key={key}
                                    slur={slur}
                                    deleteSlur={() => deleteSlurUI(slur)}
                                />
                            );
                        })
                    ) : slurs && slurs.length > 0 ? (
                        <Text size="small" margin={{ horizontal: 'auto' }}>
                            Add "{input}" to your personal block list
                        </Text>
                    ) : (
                        <Text size="small" margin={{ horizontal: 'auto' }}>
                            Add slurs to your personal block list
                        </Text>
                    )}
                </Box>

                <Box direction="row" gap="small" margin={{ top: '1em' }}>
                    <Button label="Reset" onClick={resetAllSlurs} />
                    <Button label={t('save')} primary onClick={saveSlurs} />
                </Box>
            </Box>
        </Box>
    );
}

function SlurChip({ slur, deleteSlur }) {
    return (
        <Box
            direction="row"
            gap="small"
            align="center"
            style={{ borderRadius: '20px' }}
            border={{ color: 'black', size: 'xsmall' }}
            pad={{ vertical: 'xxsmall', horizontal: 'medium' }}
        >
            <Text>{slur}</Text>
            <Box
                border={{ color: 'black', size: 'xsmall' }}
                style={{ borderRadius: '100%', width: 'fit-content' }}
            >
                <Button
                    fill={false}
                    pad="none"
                    icon={<FormClose color="plain" size="15px" />}
                    onClick={deleteSlur}
                />
            </Box>
        </Box>
    );
}
