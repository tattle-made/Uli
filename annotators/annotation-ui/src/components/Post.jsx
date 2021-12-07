import React from "react";
import { Box, Text, Image } from "grommet";
import { Clock, Alert, Checkmark } from "grommet-icons";

export function Post(props) {
  return (
    <Box
      direction={"column"}
      round={"small"}
      responsive
      border={{
        color: "light-4",
      }}
      pad="medium"
      gap={"xsmall"}
      hoverIndicator={true}
      onClick={() => props.onPostClicked(props.ix)}
    >
      <Box direction={"row"} gap={"small"} align={"center"}>
        <Text key={props.ix} color={"dark-4"}>
          {props.post.Post.id}
        </Text>
        {props.post.status === "pending" ? (
          <Clock size={"small"} color={"visuals-8"} />
        ) : props.post.status === "malformed" ? (
          <Alert size={"small"} color={"visuals-7"} />
        ) : props.post.status === "complete" ? (
          <Checkmark size={"small"} color={"visuals-6"} />
        ) : null}
      </Box>
      <div>
        {props.post.Post.role === "text" ? (
          <Text size={"medium"} weight={600}>
            {props.post.Post.text}
          </Text>
        ) : null}
      </div>
      {props.post.Post.role === "image" ? (
        <Box height={"small"} width={"small"}>
          <Image
            fit={"contain"}
            alignSelf={"start"}
            src={props.post.Post.url}
          />
        </Box>
      ) : null}
    </Box>
  );
}
