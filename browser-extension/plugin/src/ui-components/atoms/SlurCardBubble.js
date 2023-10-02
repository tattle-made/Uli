import { Box, Text } from 'grommet';

const SlurCardBubble = ({ data }) => {
    return(
        <Box>
        {" "}
        <Box
          round={"small"}
          background="#E7A85F"
          pad={"xsmall"}
          width={"fit-content"}
        >
          <Text size={"xsmall"}>{data.category}</Text>{" "}
        </Box>
      </Box>
    )
}

export default SlurCardBubble;