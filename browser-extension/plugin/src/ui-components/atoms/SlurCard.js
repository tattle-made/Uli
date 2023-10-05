import { List, Text, Box} from 'grommet';
import { Alert } from 'grommet-icons';
import SlurCardBubble from './SlurCardBubble';

const SlurCard = ({ data }) => {
    const isDataEmpty =
        !data.level_of_severity ||
        data.casual === undefined ||
        data.appropriated === undefined ||
        data.categories.length === 0;

    return (
        <Box align="center">
            {isDataEmpty ? (
                <Box direction="row" gap="medium" align="center" background="status-warning" width={'fit-content'}>
                    <Box margin="medium">
                    <Alert />
                    </Box>
                    <Text margin="small">
                        Add metadata for the slur
                    </Text>
                </Box>
            ) : (
                <>
                    <List
                        primaryKey="name"
                        secondaryKey="value"
                        data={[
                            {
                                name: 'Level of Severity',
                                value: data.level_of_severity
                            },
                            {
                                name: 'Casual',
                                value:
                                    data.casual === true
                                        ? 'Yes'
                                        : data.casual === false
                                        ? 'No'
                                        : ''
                            },
                            {
                                name: 'Appropriated',
                                value:
                                    data.appropriated === true
                                        ? 'Yes'
                                        : data.appropriated === false
                                        ? 'No'
                                        : ''
                            },
                            {
                                name: 'If, Appropriated, Is it by Community or Others?',
                                value:
                                    data.appropriated === true
                                        ? 'Community'
                                        : data.appropriated === false
                                        ? 'Others'
                                        : ''
                            },
                            {
                                name: 'What Makes it Problematic?',
                                value: data.labelMeaning
                            }
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
                                <SlurCardBubble
                                    key={categoryIndex}
                                    data={category}
                                />
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SlurCard;
