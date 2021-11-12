import React from "react";
import { Box, Text, Image } from "grommet";
import { Clock, Alert, Checkmark } from "grommet-icons";

export function SimplePost({ post, annotationStatus }) {
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
      height={"medium"}
    >
      <Box direction={"row"} gap={"small"} align={"center"}>
        <Text color={"dark-4"}>{post.id}</Text>
        {annotationStatus === "pending" ? (
          <Clock size={"small"} color={"visuals-8"} />
        ) : annotationStatus === "malformed" ? (
          <Alert size={"small"} color={"visuals-7"} />
        ) : annotationStatus === "complete" ? (
          <Checkmark size={"small"} color={"visuals-6"} />
        ) : null}
      </Box>
      <div>
        {post.role === "text" ? (
          <Text size={"medium"} weight={600}>
            {post.text}
          </Text>
        ) : null}
      </div>
      {post.role === "image" ? (
        <Box height={"small"} width={"small"}>
          <Image fit={"contain"} alignSelf={"start"} src={post.url} />
        </Box>
      ) : null}
    </Box>
  );
}
