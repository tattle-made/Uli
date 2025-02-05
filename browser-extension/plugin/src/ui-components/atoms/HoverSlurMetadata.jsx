import React from 'react';
import { Box, Text } from 'grommet';

const HoverCategoryBubble = ({ data }) => {
    return (
        <Box>
            <Box
                round="small"
                background="#FADA5E"
                pad="xsmall"
                width="fit-content"
                wrap={true}
                style={{
                    fontFamily: 'Raleway',
                    fontSize: '10px',
                    color: 'black',
                }}
            >
                <Text size="small">{data}</Text>
            </Box>
        </Box>
    );
};

const HoverSlurMetadata = ({ slurDetails }) => {
    return (
        <Box
            pad="small"
            background="antiquewhite"
            border={{ color: 'black', size: 'xsmall' }}
            round="small"
            width="18rem"
            justify="start"
            align="start"
            elevation="small"
            style={{
                fontFamily: 'Raleway',
                fontSize: '10px',
                color: 'black',
                textAlign: 'left',
                lineHeight: '1.5',
            }}
        >
            {slurDetails['Level of Severity'] && (
                <Text>
                    <b>Level of Severity:</b> {slurDetails['Level of Severity']}
                </Text>
            )}
            {slurDetails['Casual'] && (
                <Text>
                    <b>Casual:</b> {slurDetails['Casual']}
                </Text>
            )}
            {slurDetails['Appropriated'] && (
                <Text>
                    <b>Appropriated:</b> {slurDetails['Appropriated']}
                </Text>
            )}
            {slurDetails['If, Appropriated, Is it by Community or Others?'] && (
                <Text>
                    <b>If, Appropriated, Is it by Community or Others?:</b>{' '}
                    {
                        slurDetails[
                            'If, Appropriated, Is it by Community or Others?'
                        ]
                    }
                </Text>
            )}
            {slurDetails['What Makes it Problematic?'] && (
                <Text>
                    <b>What Makes it Problematic?:</b>{' '}
                    {slurDetails['What Makes it Problematic?']}
                </Text>
            )}

            {slurDetails['Categories'] &&
                slurDetails['Categories'].length > 0 && (
                    <Box>
                        <Text>
                            <b>Categories:</b>
                        </Text>
                        <Box direction="row" gap="xsmall" wrap>
                            {slurDetails['Categories'].map(
                                (category, index) => (
                                    <HoverCategoryBubble
                                        key={index}
                                        data={category.replace(/_/g, ' ')}
                                    />
                                )
                            )}
                        </Box>
                    </Box>
                )}
        </Box>
    );
};

export default HoverSlurMetadata;
