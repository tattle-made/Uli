import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../config";
import { Box, Heading, Text } from "grommet";
import { Post } from "../Post";

export default function PostDetailPage({ postId }) {
  const [post, setPost] = useState(undefined);
  useEffect(async () => {
    const res = await axios.get(`${config.api_endpoint}/post/${postId}`);
    console.log(res.data.post);
    setPost(res.data.post);
  }, []);
  return (
    <Box>
      <Heading level={3} margin={"none"}>
        Post
      </Heading>

      <Heading level={3} margin={"none"}>
        Your Annotations
      </Heading>
      <Box height={"1em"}></Box>
      <Box>
        {post &&
          post.Annotations &&
          post.Annotations.map((annotation) => (
            <Box direction={"row-responsive"}>
              <Box width={"small"} border pad={"small"}>
                <Text>{annotation.key}</Text>
              </Box>
              <Box width={"small"} border pad={"small"}>
                <Text>{annotation.value}</Text>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
