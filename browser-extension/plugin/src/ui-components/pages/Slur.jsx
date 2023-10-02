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
                                background="light-2"
                                pad="medium"
                                round="small"
                                width="medium"
                                elevation="small"
                            >
                                <Box direction="row" justify="end">
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
                                        onClick={() =>
                                            handleDeleteSlur(slur.id)
                                        }
                                    />
                                </Box>
                                <Text>
                                    <strong>Label:</strong> {slur.label}
                                </Text>
                                <Text>
                                    <strong>Level of Severity:</strong>{' '}
                                    {slur.level_of_severity}
                                </Text>
                                <Text>
                                    <strong>Casual:</strong>{' '}
                                    {slur.casual ? 'Yes' : 'No'}
                                </Text>

                                <Text>
                                    <strong>Appropriated:</strong>{' '}
                                    {slur.appropriated ? 'Yes' : 'No'}
                                </Text>
                                {slur.appropriationContext && (
                                    <Text>
                                        <strong>
                                            If, Appropriated, Is it by Community
                                            or Others?:
                                        </strong>{' '}
                                        {slur.appropriationContext ===
                                        'Community'
                                            ? 'Community'
                                            : 'Others'}
                                    </Text>
                                )}
                                {slur.labelMeaning && (
                                    <Text>
                                        <strong>
                                            What Makes it Problematic?:
                                        </strong>{' '}
                                        {slur.labelMeaning}
                                    </Text>
                                )}
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
                        </>
                    ))
                )}
            </Box>
        </Box>
    );
}
