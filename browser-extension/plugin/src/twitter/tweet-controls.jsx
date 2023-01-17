import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Text,
    Layer,
    TextArea,
    Button,
    Spinner,
    Grommet,
    Tip
} from 'grommet';
import {
    Camera,
    Wifi,
    Eye,
    // Menu,
    ChevronLeft,
    XCircle,
    Flag
    // Activity,
} from 'react-feather';
import { saveScreenshot } from '../service-screenshot';
import repository from '../repository';
import Api from '../ui-components/pages/Api';
import Theme from '../ui-components/atoms/Theme';
const { getUserData, getPreferenceData } = repository;
const { invokeNetwork } = Api;
const axios = require('axios');

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

export function TweetControl({ tweet, id, setBlur, hasSlur, enableML }) {
    const [collapsed, setCollapsed] = useState(false);
    const [category, setCategory] = useState('Uncategorized');
    const [hideTweet, setHideTweet] = useState('false');
    const [hasOGBV, setHasOGBV] = useState(false);
    const [blurFlag, setBlurFlag] = useState(true);
    const [feedbackFlag, setFeedbackFlag] = useState(false); //setting feedback flag
    const [userLS, setUserLS] = useState(undefined);
    const [preferenceLS, setPreferenceLS] = useState(undefined);
    const [feedbackSentiment, setFeedbackSentiment] = useState(undefined);
    const [feedbackConfidence, setFeedbackConfidence] = useState(undefined);

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

        // Classify Tweet if enableML is true
        let accessToken =
            userData && userData.accessToken ? userData.accessToken : undefined;
        let enableML =
            preferenceData && preferenceData.enableML
                ? preferenceData.enableML
                : undefined;
        // console.log(enableML);
        setFeedbackFlag(enableML);
        if (enableML && accessToken) {
            
            try {
                const response = await axios.post(
                    `${process.env.API_URL}/predict`,
                    // `http://127.0.0.1:8081/predict`, // for local dev
                    {
                        text: tweet.original_text.join(' ')
                    },
                    {
                        headers: {
                            Authorization: `token ${accessToken}`
                        }
                    }
                );
                const { data } = response;
                setFeedbackConfidence(data.confidence);
                setFeedbackSentiment(data.sentiment);
                if (data.confidence > 0.4 && data.sentiment === 'Hate') {
                    setCategory(data.sentiment);
                    setHideTweet(true);
                    setHasOGBV(true);
                }
            } catch (err) {
                console.log(`Error : server could not classify tweet`, err);
            }
        }
        
    }

    async function clickCamera() {
        showProgress(true);
        const node = document.getElementById(id);
        // console.log(node);
        let tweetUrl =
            tweet && tweet.tweet_url ? tweet.tweet_url : location.href;
        let accessToken =
            userLS && userLS.accessToken ? userLS.accessToken : undefined;
        let storeLocally =
            preferenceLS && preferenceLS.storeLocally != undefined
                ? preferenceLS.storeLocally
                : true;
        console.log({ node, accessToken, storeLocally, tweetUrl });

        try {
            await saveScreenshot(node, storeLocally, accessToken, tweetUrl);
            showProgress(false);
            showNotification({ message: 'Post Archived' });
        } catch (err) {
            console.log(err);
            showProgress(false);
            showNotification({ message: 'Error Archiving Post on Server' });
        } finally {
            showProgress(false);
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

    async function sendFeedback() {
        showProgress(false);
        // let tweetUrl =
        //     tweet && tweet.tweet_url ? tweet.tweet_url : location.href;
        // console.log(tweetUrl);
        const user_Data = await getUserData();
        let accessToken =
            user_Data && user_Data.accessToken ? user_Data.accessToken : undefined;
        try {
            const feedbackResponse = await axios.post(
                `${process.env.API_URL}/feedback`, //sending feedback to local server, the url would change to ${API_URL} in prod code
                {
                    user_id: userLS.id,
                    tweet_text: tweet.original_text.join(' '),
                    tweet_sentiment: feedbackSentiment,
                    tweet_confidence: feedbackConfidence
                },
                {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                }

                );
                showNotification({ message: 'Feedback Sent' });

        } catch (err) {
            console.log(err);
            
            showNotification({ message: 'Error Sending Feedback' });
        }
        

    }

    return (
        <Grommet className="ogbv-tweetcontrol-bar" theme={Theme}>
            <Box>
                <Box
                    direction="row"
                    background={'white'}
                    style={{ zIndex: '500' }}
                    pad={'xsmall'}
                >
                    <Box flex="grow"></Box>
                    {!collapsed ? (
                        <Box direction="row" gap={'small'} padding={'medium'}>
                            {/* {category != 'Uncategorized' ||
                            category != 'None' ? (
                                <Text size="'small">{category}</Text>
                            ) : null} */}
                            {/* <Text>{`${hasSlur}, ${hasOGBV}`}</Text> */}
                            <Box direction="row">
                                {progress ? (
                                    <Spinner
                                        color={'#212121'}
                                        size={'xsmall'}
                                    />
                                ) : null}
                                {notification ? (
                                    <Text color={'brand'} size={'small'}>
                                        {notification.message}
                                    </Text>
                                ) : null}
                            </Box>
                            <UnfocussedButton onClick={clickCamera}>
                                <Tip content={'Archive'}>
                                    <Camera size={16} color={'#212121'} />
                                </Tip>
                            </UnfocussedButton>
                            {/* <UnfocussedButton onClick={clickInvokeNetwork}>
                                <Tip content={'Invoke Network'}>
                                    <Wifi size={16} color={'#212121'} />
                                </Tip>
                            </UnfocussedButton> */}
                            {hasSlur || hasOGBV ? (
                                <UnfocussedButton
                                    onClick={() => {
                                        setBlurFlag(!blurFlag);
                                        setHideTweet(!hideTweet);
                                        setBlur(id, blurFlag);
                                    }}
                                >
                                    <Tip content={'Show/Hide original tweet'}>
                                        <Eye size={16} color={'#212121'} />
                                    </Tip>
                                </UnfocussedButton>
                            ) : null}
                            
                            {feedbackFlag ? (                                
                                <UnfocussedButton onClick={sendFeedback}>
                                    <Tip content={'Give feedback'}>
                                        <Flag size={16} color={'#212121'} />
                                    </Tip>
                                </UnfocussedButton>
                            ) : null}
                            {/* <UnfocussedButton onClick={clickActivity}>
                        <Activity size={16} />
                    </UnfocussedButton> */}
                            {/* <UnfocussedButton
                                onClick={() => {
                                    setCollapsed(!collapsed);
                                }}
                            >
                                <XCircle size={16} />
                            </UnfocussedButton> */}
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
                            <Box
                                width={'medium'}
                                gap={'medium'}
                                margin={'large'}
                            >
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
                {category === 'Hate' && hideTweet ? (
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#fdf6ed',
                            zIndex: '499',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.4em'
                        }}
                    >
                        <p>Uli detected this tweet to be oGBV</p>
                    </div>
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
