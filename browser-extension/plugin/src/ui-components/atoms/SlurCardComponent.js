import React from 'react'
import SlurCardBubble from './SlurCardBubble';
import {
    Card, CardBody, CardFooter, CardHeader, List,
    Text,
    Box,
    Button,
    Anchor,
} from 'grommet';


const SlurCardComponent = ({ data }) => {
    return (
        <Card flex={true} background="#FFE5B4">
            <CardHeader pad="medium">Header</CardHeader>
            <CardBody pad="medium">Body</CardBody>
        </Card>
    )
}

export default SlurCardComponent