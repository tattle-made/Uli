import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import { Camera, Wifi, Eye, Menu, XCircle, Activity } from 'react-feather';
import { saveScreenshot } from '../service-screenshot';
import axios from 'axios';

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

export function TweetControl({ tweet, id, debug, setBlur }) {
    const [collapsed, setCollapsed] = useState(true);
    const [category, setCategory] = useState('Uncategorized');
    const [blurFlag, setBlurFlag] = useState(true);
    function clickActivity() {
        console.log(id);
        debug(id);
    }

    useEffect(async () => {
        try {
            const response = await axios.post('http://localhost:8000/predict', {
                text: tweet.original_text.join(' ')
            });
            const { data } = response;
            if (data.confidence > 0.5) {
                setCategory(data.sentiment);
            }
        } catch (err) {
            console.log(`Error : server could not classify tweet`, err);
        }
    }, []);

    async function clickCamera() {
        const node = document.getElementById(id);
        console.log(node);
        await saveScreenshot(node);
    }

    return (
        <Box direction="row">
            <Box flex="grow"></Box>
            {!collapsed ? (
                <Box direction="row" gap={'small'} padding={'medium'}>
                    {category != 'Uncategorized' || category != 'None' ? (
                        <Text size="'small">{category}</Text>
                    ) : null}
                    <UnfocussedButton onClick={clickCamera}>
                        <Camera size={16} />
                    </UnfocussedButton>
                    <Wifi size={16} />
                    <UnfocussedButton
                        onClick={() => {
                            setBlurFlag(!blurFlag);
                            setBlur(id, blurFlag);
                        }}
                    >
                        <Eye size={16} />
                    </UnfocussedButton>
                    <UnfocussedButton onClick={clickActivity}>
                        <Activity size={16} />
                    </UnfocussedButton>
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
                    <Menu size={16} />
                </UnfocussedButton>
            )}
        </Box>
    );
}

TweetControl.propTypes = {
    tweet: PropTypes.object,
    id: PropTypes.string,
    debug: PropTypes.func,
    setBlur: PropTypes.func
};
