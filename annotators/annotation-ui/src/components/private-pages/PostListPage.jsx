import React, { useState, useEffect } from "react";
import { Box, Text, Image, Pagination } from "grommet";
import { Clock, Alert, Checkmark } from "grommet-icons";
import { AppContentSection } from "../AppContentSection";
import axios from "axios";
import { navigate } from "gatsby";
import { config } from "../config";

const SimplePost = ({ post, onPostClicked }) => {
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
      onClick={onPostClicked}
    >
      <Box direction={"row"} gap={"small"} align={"center"}>
        <Text color={"dark-4"}>{post.id}</Text>
        {post.status === "pending" ? (
          <Clock size={"small"} color={"visuals-8"} />
        ) : post.status === "malformed" ? (
          <Alert size={"small"} color={"visuals-7"} />
        ) : post.status === "complete" ? (
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
};

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  async function getPosts(pageNum) {
    return axios.get(`${config.api_endpoint}/posts?page=${pageNum}`);
  }

  useEffect(async () => {
    const postsRes = await getPosts(pageNum);
    console.log(postsRes.data);
    setPosts(postsRes.data.posts);
    setPageCount(postsRes.data.count);
  }, []);

  function onPostClicked(ix) {
    console.log({ pageNum, ix });
    navigate(`/app/post/${posts[ix].Post.id}`);
  }

  async function changePage({ page: currentPageNum }) {
    console.log(currentPageNum);
    setPageNum(currentPageNum);
    const postsRes = await getPosts(currentPageNum);
    setPosts(postsRes.data.posts);
  }

  return (
    <AppContentSection>
      <Box
        flex={{
          grow: 6,
        }}
        gap={"small"}
      >
        <Pagination numberItems={pageCount} onChange={changePage} />
        <Box direction={"column"} gap={"small"}>
          {posts.map((post, ix) => (
            <SimplePost
              post={post}
              key={ix}
              onPostClicked={() => onPostClicked(ix)}
            ></SimplePost>
          ))}
        </Box>
      </Box>
      <Box
        flex={{
          grow: 1,
        }}
        round={"small"}
        responsive
        background={"visuals-1"}
        pad={"small"}
      >
        Sidebar
      </Box>
    </AppContentSection>
  );
};

export default PostListPage;
