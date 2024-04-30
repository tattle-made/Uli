import React, { useState } from 'react';
import {
    List,
    Text,
    Box,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Anchor,
} from 'grommet';
import { Alert, FormUp, FormDown } from 'grommet-icons';
import SlurCardBubble from './SlurCardBubble';

const SlurCard = ({ data }) => {
    const isDataEmpty =
        !data.levelOfSeverity ||
        data.casual === undefined ||
        data.appropriated === undefined ||
        data.categories.length === 0;

    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    const buttonLabel = showMore ? 'See Less' : 'See More';
    const buttonIcon = showMore ? <FormUp /> : <FormDown />;

    return (
        <Box align="center">
            {isDataEmpty ? (
                <Box
                    direction="row"
                    gap="medium"
                    align="center"
                    background="status-warning"
                    width={'fit-content'}
                >
                    <Box margin="medium">
                        <Alert />
                    </Box>
                    <Text margin="small">Add metadata for the slur</Text>
                </Box>
            ) : (
                <>
                    <Box width={'fit-content'}>
                        {/* <List
                            primaryKey="name"
                            secondaryKey="value"
                            data={[
                                {
                                    name: 'Level of Severity',
                                    value: data.levelOfSeverity
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
                                    value: (
                                        <Box>
                                            <Text truncate>
                                                {data.labelMeaning}
                                            </Text>
                                        </Box>
                                    )
                                },
                                {
                                    name: 'Categories',
                                    value: (
                                        <Box
                                            direction="row"
                                            gap="medium"
                                        >
                                            {data.categories.map(
                                                (category, categoryIndex) => (
                                                    <SlurCardBubble
                                                        key={categoryIndex}
                                                        data={category}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    )
                                }
                            ]}
                        /> */}
                        <Table>
                            {/* <TableHeader>
                                <TableRow>
                                    <TableCell scope="col" border="bottom">
                                        Name
                                    </TableCell>
                                    <TableCell scope="col" border="bottom">
                                        Flavor
                                    </TableCell>
                                </TableRow>
                            </TableHeader> */}
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                        <Text color="#646464">
                                            Level of Severity
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        {data.levelOfSeverity}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <Text color="#646464">Casual</Text>
                                    </TableCell>
                                    <TableCell>
                                        {data.casual === true
                                            ? 'Yes'
                                            : data.casual === false
                                            ? 'No'
                                            : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        <Text color="#646464">
                                            Appropriated
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        {data.appropriated === true
                                            ? 'Yes'
                                            : data.appropriated === false
                                            ? 'No'
                                            : ''}
                                    </TableCell>
                                </TableRow>
                                {showMore && (
                                    <>
                                        <TableRow>
                                            <TableCell scope="row">
                                                <Text color="#646464">
                                                    If, Appropriated, Is it by
                                                    Community or Others?
                                                </Text>
                                            </TableCell>
                                            <TableCell>
                                                {data.appropriationContext === true
                                                    ? 'Community'
                                                    : data.appropriationContext ===
                                                      false
                                                    ? 'Others'
                                                    : ''}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell scope="row">
                                                <Text color="#646464">
                                                    What Makes it Problematic?
                                                </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Text
                                                        truncate
                                                        style={{
                                                            maxWidth: '100px',
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {data.labelMeaning}
                                                    </Text>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell scope="row">
                                                <Text color="#646464">
                                                    Categories
                                                </Text>
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    <Box
                                                        direction="row"
                                                        gap="medium"
                                                        wrap={true}
                                                    >
                                                        {data.categories.map(
                                                            (
                                                                category,
                                                                categoryIndex
                                                            ) => (
                                                                <Box
                                                                    margin={
                                                                        'xsmall'
                                                                    }
                                                                >
                                                                    <SlurCardBubble
                                                                        key={
                                                                            categoryIndex
                                                                        }
                                                                        data={
                                                                            category
                                                                        }
                                                                    />
                                                                </Box>
                                                            )
                                                        )}
                                                    </Box>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                        <Box align='center' margin={{top: "small"}}>
                        <Anchor
                            label={buttonLabel}
                            icon={buttonIcon}
                            onClick={toggleShowMore}
                        />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SlurCard;
