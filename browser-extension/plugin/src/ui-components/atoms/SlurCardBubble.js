import { Box, Text } from 'grommet';

const SlurCardBubble = ({ data }) => {
    return (
        <Box>
            {' '}
            <Box
                round={'small'}
                background="#FADA5E"
                pad={'small'}
                width={'fit-content'}
            >
                <Text size={'small'}>{data.category}</Text>{' '}
            </Box>
        </Box>
    );
};

export default SlurCardBubble;
