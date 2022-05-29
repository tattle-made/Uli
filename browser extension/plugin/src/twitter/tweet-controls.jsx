import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Layer, TextArea, Button, Spinner, Grommet } from 'grommet';
import {
    Camera,
    Wifi,
    Eye,
    // Menu,
    ChevronLeft,
    XCircle
    // Activity,
} from 'react-feather';
import { saveScreenshot } from '../service-screenshot';
import repository from '../repository';
import Api from '../ui-components/pages/Api';
import Theme from '../ui-components/atoms/Theme';
const { getUserData, getPreferenceData } = repository;
const { invokeNetwork } = Api;

function UnfocussedButton({ onClick, children }) {
    return (
        <Box onClick={onClick} focusIndicator={false}>
            {children}
        </Box>
    );
}

UnfocussedButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.element)
};

export function TweetControl({ tweet, id, setBlur }) {
    const [collapsed, setCollapsed] = useState(true);
    // const [category, setCategory] = useState('Uncategorized');
    const [blurFlag, setBlurFlag] = useState(true);
    const [userLS, setUserLS] = useState(undefined);
    const [preferenceLS, setPreferenceLS] = useState(undefined);

    const [message, setMessage] = useState(
        'Hey, can you help me report this post?'
    );
    const [showPopup, setShowPopup] = useState(false);
    const [progress, showProgress] = useState(false);
    const [notification, setNotification] = useState(undefined);

    function showNotification(notification) {
        setNotification(notification);
        setTimeout(() => {
            setNotification(undefined);
        }, 2000);
    }

    // function clickActivity() {
    //     debug(id);
    // }

    useEffect(async () => {
        await updateData();
    }, []);

    async function updateData() {
        const userData = await getUserData();
        const preferenceData = await getPreferenceData();
        setUserLS(userData);
        setPreferenceLS(preferenceData);
    }

    useEffect(() => {
        console.log({ preferenceLS });
    }, [preferenceLS]);

    // useEffect(async () => {
    //     try {
    //         const response = await axios.post('http://localhost:8000/predict', {
    //             text: tweet.original_text.join(' ')
    //         });
    //         const { data } = response;
    //         if (data.confidence > 0.5) {
    //             setCategory(data.sentiment);
    //         }
    //     } catch (err) {
    //         console.log(`Error : server could not classify tweet`, err);
    //     }
    // }, []);

    async function clickCamera() {
        const node = document.getElementById(id);
        console.log(node);
        let tweetUrl = tweet.tweet_url ? tweet.tweet_url : location.href;
        try {
            await saveScreenshot(
                node,
                preferenceLS.storeLocally,
                userLS.accessToken,
                tweetUrl
            );
            showProgress(false);
            showNotification({ message: 'Post Archived' });
        } catch (err) {
            showProgress(false);
            showNotification({ message: 'Error Archiving Post on Server' });
        }
    }

    function clickInvokeNetwork() {
        setShowPopup(true);
    }

    async function clickSend() {
        showProgress(false);
        await updateData();
        try {
            let tweetUrl = tweet.tweet_url ? tweet.tweet_url : location.href;
            await invokeNetwork(userLS.accessToken, message, tweetUrl);
            showProgress(false);
            showNotification({ message: 'Successfully Messaged Friends' });
        } catch (err) {
            console.log('Error invoking network', err);
        } finally {
            setShowPopup(false);
        }
    }

    return (
        <Grommet theme={Theme}>
            <Box direction="row" background={'white'}>
                <Box flex="grow"></Box>
                {!collapsed ? (
                    <Box direction="row" gap={'small'} padding={'medium'}>
                        {/* {category != 'Uncategorized' || category != 'None' ? (
                        <Text size="'small">{category}</Text>
                    ) : null} */}
                        <Box direction="row">
                            {progress ? <Spinner /> : null}
                            {notification ? (
                                <Text color={'brand'} size={'small'}>
                                    {notification.message}
                                </Text>
                            ) : null}
                        </Box>
                        <UnfocussedButton onClick={clickCamera}>
                            <Camera size={16} color={'#212121'} />
                        </UnfocussedButton>
                        <UnfocussedButton onClick={clickInvokeNetwork}>
                            <Wifi size={16} color={'#212121'} />
                        </UnfocussedButton>
                        <UnfocussedButton
                            onClick={() => {
                                setBlurFlag(!blurFlag);
                                setBlur(id, blurFlag);
                            }}
                        >
                            <Eye size={16} color={'#212121'} />
                        </UnfocussedButton>
                        {/* <UnfocussedButton onClick={clickActivity}>
                        <Activity size={16} />
                    </UnfocussedButton> */}
                        <UnfocussedButton
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                        >
                            <XCircle size={16} />
                        </UnfocussedButton>
                    </Box>
                ) : (
                    <UnfocussedButton
                        onClick={() => {
                            setCollapsed(!collapsed);
                        }}
                    >
                        <ChevronLeft size={16} color={'#212121'} />
                    </UnfocussedButton>
                )}
                {showPopup ? (
                    <Layer
                        onEsc={() => setShowPopup(false)}
                        onClickOutside={() => setShowPopup(false)}
                    >
                        <Box width={'medium'} gap={'medium'} margin={'large'}>
                            <TextArea
                                placeholder={
                                    'Hey, can you help me report this post?'
                                }
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                            ></TextArea>
                            <Box direction={'row'} gap={'small'}>
                                <Button
                                    label="Cancel"
                                    onClick={() => setShowPopup(false)}
                                />
                                <Button
                                    label="Send"
                                    onClick={() => {
                                        clickSend();
                                    }}
                                    primary
                                />
                            </Box>
                        </Box>
                    </Layer>
                ) : null}
            </Box>
        </Grommet>
    );
}

TweetControl.propTypes = {
    tweet: PropTypes.object,
    id: PropTypes.string,
    debug: PropTypes.func,
    setBlur: PropTypes.func
};
