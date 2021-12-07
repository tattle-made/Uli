import React, { useState, useEffect } from "react";
import { Box } from "grommet";
import axios from "axios";
import { config } from "./config";
import { navigate } from "gatsby";
import { Post } from "./Post";

const AllocationList = () => {
  const userId = "9404f34a-c36e-4437-82d2-aee3f22fb93c";
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  useEffect(async () => {
    const postsRes = await axios.get(
      `${config.api_endpoint}/allocation/for-user/?userId=${userId}&page=${pageNum}`
    );
    console.log(postsRes);
    setPosts(postsRes.data.allocation);
  }, []);

  function onPostClicked(ix) {
    console.log({ pageNum, ix });
    navigate(`/app/post/${posts[ix].Post.id}`);
  }

  return (
    <Box direction={"column"} gap={"small"}>
      {posts.map((post, ix) => (
        <Post post={post} ix={ix} onPostClicked={onPostClicked}></Post>
      ))}
    </Box>
  );
};

export default AllocationList;
