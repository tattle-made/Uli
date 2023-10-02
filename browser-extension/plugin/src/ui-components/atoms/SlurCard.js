import { Box, Text } from 'grommet';
import SlurCardBubble from './SlurCardBubble';

const SlurCard = ({ data }) => {
    return (
        <Box>
            <Box direction="row" justify="start" align="center">
                <Text margin={{ left: 'xsmall' }} color="#71797E">
                    Level of Severity:
                </Text>
                <Text margin={{ left: 'medium' }}>
                    {data.level_of_severity}
                </Text>
            </Box>
            <Box direction="row" justify="start" align="center">
                <Text margin={{ left: 'xsmall' }} color="#646464">
                    Casual:
                </Text>
                <Text margin={{ left: 'medium' }}>
                    {data.casual ? 'Yes' : 'No'}
                </Text>
            </Box>
            <Box direction="row" justify="start" align="center">
                <Text margin={{ left: 'xsmall' }} color="#646464">
                    Appropriated:
                </Text>
                <Text margin={{ left: 'medium' }}>
                    {data.appropriated ? 'Yes' : 'No'}
                </Text>
            </Box>
            {data.appropriationContext && (
                <Box direction="row" justify="start" align="center">
                    <Text margin={{ left: 'xsmall' }} color="#646464">
                        If, Appropriated, Is it by Community or Others?:
                    </Text>
                    <Text margin={{ left: 'medium' }}>
                        {data.appropriationContext === 'Community'
                            ? 'Community'
                            : 'Others'}
                    </Text>
                </Box>
            )}
            {data.labelMeaning && (
                <Box direction="row" justify="start" align="center">
                    <Text margin={{ left: 'xsmall' }} color="#646464">
                        What Makes it Problematic?:
                    </Text>
                    <Text margin={{ left: 'medium' }}>{data.labelMeaning}</Text>
                </Box>
            )}
            <Box direction="column">
                <Text margin={{ left: 'xsmall' }} color="#646464">
                    Categories:
                </Text>
                <Box direction="row" gap="medium" margin={{top: 'medium', left: 'xsmall'}}>
                    {data.categories.map((category, categoryIndex) => (
                        <SlurCardBubble key={categoryIndex} data={category} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SlurCard;
