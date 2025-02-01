import React from 'react';
import { Box, Text } from 'grommet';

const HoverSlurMetadata = ({ slurDetails}) => {
    return (
        <Box
            pad="small"
            background="antiquewhite"
            border={{ color: 'black', size: 'small' }}
            round="small"
            width="16rem"
            justify="start"
            align="start"
            elevation="small"
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
                    <Text>
                        <b>Categories:</b>{' '}
                        {slurDetails['Categories'].join(', ')}
                    </Text>
                )}
        </Box>
    );
};

export default HoverSlurMetadata;
