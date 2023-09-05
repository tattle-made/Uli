import { Box, Text, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

export function Slur() {
    let navigate = useNavigate();
    const navigateToAddSlur = () => {
        navigate('/slur/create');
    };

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
