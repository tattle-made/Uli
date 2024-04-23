import React from 'react'
import SlurCardBubble from './SlurCardBubble';
import {
    Card, CardBody, CardFooter,
    Box,
    Anchor,
    DataTable,
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

    const columns = [
        {
            property: 'name',
            header: false,
        },
        {
            property: 'value',
            header: false,
            render: data => {
                return data.name === 'Categories' ? (
                    <Box direction="row" gap="medium" wrap={true}>
                        {data.value.map((category, categoryIndex) => (
                            <Box margin={'xsmall'} key={categoryIndex}>
                                <SlurCardBubble data={category} />
                            </Box>
                        ))}
                    </Box>
                ) : data.value;
            },
        },
    ];

    const dataToShow = [
        { name: 'Level of Severity', value: data.levelOfSeverity },
        { name: 'Casual', value: data.casual ? 'Yes' : 'No' },
        { name: 'Appropriated', value: data.appropriated ? 'Yes' : 'No' },
    ];

    if (showMore) {
        dataToShow.push(
            { name: 'If, Appropriated, Is it by Community or Others?', value: data.appropriationContext ? 'Community' : 'Others' },
            { name: 'What Makes it Problematic?', value: data.labelMeaning },
            { name: 'Categories', value: data.categories },
        );
    }

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
                    <DataTable
                        columns={columns}
                        data={dataToShow}
                        border={false}
                    />
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