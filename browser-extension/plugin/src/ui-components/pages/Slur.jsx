import { useState, useEffect, useContext } from 'react';
import { Box, Text, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext, NotificationContext } from '../atoms/AppContext';
import SlurCard from '../atoms/SlurCard';

const { getSlurAndCategory, deleteSlurAndCategory } = Api;

export function Slur() {
    let navigate = useNavigate();
    const [getSlurs, setGetSlurs] = useState([]);
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);

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
            showNotification({
                type: 'message',
                message: 'Slur Deleted'
            });
        } catch (err) {
            console.error('could not delete slur', err);
            showNotification({
                type: 'error',
                message: 'Error - Could not delete Slur'
            });
        }
    }

    useEffect(() => {
        fetchSlurs();
    }, []);

    return (
        <Box fill gap={'medium'}>
            <Box gap="medium" alignContent="center" wrap>
                {getSlurs.length === 0 ? (
                    <>
                        <Box alignContent="center">
                            <Text textAlign="center">
                                <strong>Your Crowdsourced Slur List</strong>
                            </Text>
                        </Box>
                        <Box
                            direction="column"
                            gap={'small'}
                            justify="center"
                            margin="xlarge"
                            align="center"
                        >
                            <Box width={'fit-content'}>
                                <Button
                                    id="add-slur-button"
                                    icon={<Add size="small" />}
                                    fill={false}
                                    label="Add Slur"
                                    onClick={navigateToAddSlur}
                                />
                            </Box>
                            <Box>
                                <Text size="small">
                                    No Slurs have been added, click to add slurs
                                </Text>
                            </Box>
                        </Box>
                    </>
                ) : (
                    getSlurs.map((slur, index) => (
                        <>
                            <Box
                                direction="row"
                                gap={'small'}
                                justify="center"
                                align="center"
                            >
                                <Button
                                    id="add-slur-button"
                                    icon={<Add size="small" />}
                                    fill={false}
                                    label="Add Slur"
                                    onClick={navigateToAddSlur}
                                />
                            </Box>
                            <Box alignContent="center" margin="medium">
                                <Text textAlign="center" margin={'small'}>
                                    <strong>Your Crowdsourced Slur List</strong>
                                </Text>
                            </Box>
                            <Box
                                key={index}
                                background="#FAE6C9"
                                pad="medium"
                                round="medium"
                                width="medium"
                                elevation="small"
                            >
                                <Box
                                    direction="row"
                                    justify="between"
                                    gap="small"
                                    align="center"
                                >
                                    <Text size="large">
                                        <strong>{slur.label}</strong>
                                    </Text>
                                    <Box direction="row" gap="medium">
                                        <Button
                                            id="slur-edit-button"
                                            label="Edit"
                                            onClick={() =>
                                                navigate(`/slur/${slur.id}`)
                                            }
                                        />
                                        <Button
                                            id="slur-delete-button"
                                            label="Delete"
                                            // color="#FFDBD0"
                                            onClick={() =>
                                                handleDeleteSlur(slur.id)
                                            }
                                        />
                                    </Box>
                                </Box>
                                <Box margin={{ top: 'large' }}>
                                    <SlurCard data={slur} />
                                </Box>
                                {/* <Text>
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
                                </Text> */}
                            </Box>
                        </>
                    ))
                )}
            </Box>
        </Box>
    );
}
