import { useState, useEffect, useContext } from 'react';
import { Box, Text, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext } from '../atoms/AppContext';

const { getSlurAndCategory, deleteSlurAndCategory } = Api;

export function Slur() {
    let navigate = useNavigate();
    const [getSlurs, setGetSlurs] = useState([]);
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
    async function handleDeleteSlur(slurId) {
        try {
            await deleteSlurAndCategory(user.accessToken, slurId);
            fetchSlurs();
        } catch (err) {
            console.error('could not delete slur', err);
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
            <Box gap="medium" alignContent="center" wrap>
                {getSlurs.map((slur, index) => (
                    <Box
                        key={index}
                        background="light-2"
                        pad="medium"
                        round="small"
                        width="medium"
                        elevation="small"
                    >
                        <Box direction="row" justify="end">
                            <Button
                                label="Edit"
                                onClick={() => navigate(`/slur/${slur.id}`)}
                            />
                            <Button
                                label="Delete"
                                onClick={() => handleDeleteSlur(slur.id)}
                            />
                        </Box>
                        <Text>
                            <strong>Label:</strong> {slur.label}
                        </Text>
                        <Text>
                            <strong>Label Meaning:</strong> {slur.labelMeaning}
                        </Text>
                        <Text>
                            <strong>Appropriated:</strong>{' '}
                            {slur.appropriated ? 'Yes' : 'No'}
                        </Text>
                        <Text>
                            <strong>Appropriation Context:</strong>{' '}
                            {slur.appropriationContext}
                        </Text>
                        <Text>
                            <strong>Categories:</strong>
                            <ul>
                                {slur.categories.map(
                                    (category, categoryIndex) => (
                                        <li key={categoryIndex}>
                                            {category.category}
                                        </li>
                                    )
                                )}
                            </ul>
                        </Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
