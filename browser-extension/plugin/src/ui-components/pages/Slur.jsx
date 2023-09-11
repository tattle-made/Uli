import { useState, useEffect, useContext } from 'react';
import { Box, Text, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext } from '../atoms/AppContext';

const { getSlurAndCategory } = Api;

export function Slur() {
    let navigate = useNavigate();
    const [, setGetSlurs] = useState([]);
    const { user } = useContext(UserContext);
    // const { notification, showNotification } = useContext(NotificationContext);

    const navigateToAddSlur = () => {
        navigate('/slur/create');
    };
    async function fetchSlurs() {
        try {
            const slur = await getSlurAndCategory(user.accessToken);
            setGetSlurs(slur);
            console.log(slur);
        } catch (error) {
            console.error('error fetching slurs', error);
        }
    }

    useEffect(() => {
        fetchSlurs();
    }, []);

    return (
        <Box fill gap={'medium'}>
            <Box direction="row" gap={'small'} justify="start">
                <Button
                    icon={<Add size="small" />}
                    fill={false}
                    label="Add Slur"
                    onClick={navigateToAddSlur}
                />
            </Box>
            <Box alignContent="center">
                <Text textAlign="center">Your Crowdsourced Slur List</Text>
            </Box>
        </Box>
    );
}
