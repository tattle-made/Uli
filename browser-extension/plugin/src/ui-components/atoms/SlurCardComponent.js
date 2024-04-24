import React from 'react'
import {
    Box,
    Anchor,
    DataTable,
    Text,
    Card, 
    CardBody, 
    CardFooter,
} from 'grommet';
import { Alert, FormUp, FormDown } from 'grommet-icons';
import SlurCardBubble from './SlurCardBubble';

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
    const buttonLabel = showMore ? 'Contract' : 'Expand';
    const buttonIcon = showMore ? <FormUp /> : <FormDown />;

    

    const dataSet = [] ; 

    if (showMore === true) {

        dataSet.push(
            { name: 'Level of Severity', value: data.levelOfSeverity },
            { name: 'Casual', value: data.casual ? 'Yes' : 'No' },
            { name: 'Appropriated', value: data.appropriated ? 'Yes' : 'No' },
            { name: 'If, Appropriated, Is it by Community or Others?', value: data.appropriationContext ? 'Community' : 'Others' },
            { name: 'What Makes it Problematic?', value: data.labelMeaning },
            { name: 'Categories', value: data.categories },
        );

    }


    const columns = [
        {
            property: 'name',
            header: false,
            render : data => {
                return <Text color="#646464" weight="bolder">
                    {data.name}
                </Text>
            }
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


    return (
        <Card flex={true} background="#FFE5B4">
            <CardBody>
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
                        data={dataSet}
                        border={false}
                    />
                )}
            </CardBody>
            <CardFooter align='center' pad={{horizontal: "medium"}}>
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