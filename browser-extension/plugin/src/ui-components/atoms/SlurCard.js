import { List, Text, Box } from 'grommet';
import SlurCardBubble from './SlurCardBubble';

const SlurCard = ({ data }) => {
    return (
        <Box>
            <List
                primaryKey="name"
                secondaryKey="value"
                data={[
                    { name: 'Level of Severity', value: data.level_of_severity },
                    { name: 'Casual', value: data.casual ? 'Yes' : 'No' },
                    { name: 'If, Appropriated, Is it by Community or Others?', value: data.appropriated ? 'Community' : 'Others' },
                    { name: 'What Makes it Problematic?', value: data.labelMeaning }
                ]}
            />

            <Box direction="column">
                <Text margin={{ left: 'xsmall' }} color="#646464">
                    Categories:
                </Text>
                <Box
                    direction="row"
                    gap="medium"
                    margin={{ top: 'medium', left: 'xsmall' }}
                >
                    {data.categories.map((category, categoryIndex) => (
                        <SlurCardBubble key={categoryIndex} data={category} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SlurCard;
