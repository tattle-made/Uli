import React from 'react'
import SlurCardBubble from './SlurCardBubble';
import {
    Card, CardBody, CardFooter,
    Box,
    Anchor,
    Table,
    TableRow,
    TableCell,
    Text,
} from 'grommet';
import { Alert, FormUp, FormDown } from 'grommet-icons';

const SlurCardComponent = ({ data }) => {
    const isDataEmpty =
        !data.levelOfSeverity ||
        data.casual === undefined ||
        data.appropriated === undefined ||
        data.categories.length === 0;

    const [showMore, setShowMore] = React.useState(false);
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    const buttonLabel = showMore ? 'See Less' : 'See More';
    const buttonIcon = showMore ? <FormUp /> : <FormDown />;

    return (
        <Card flex={true} background="#FFE5B4">
            <CardBody pad="medium">
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
                    <Table>
                        <tbody>
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
                        </tbody>
                    </Table>
                )}
            </CardBody>
            <CardFooter pad={{horizontal: "medium"}}>
                <Anchor
                    label={buttonLabel}
                    icon={buttonIcon}
                    onClick={toggleShowMore}
                />
            </CardFooter>
        </Card>
    );
}

export default SlurCardComponent