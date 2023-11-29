import React from "react";
import { Box, Heading, Text, Anchor, Paragraph } from "grommet";
import { graphql } from "gatsby";
import AppShell from "../../components/molecules/AppShell";
import { NavLink } from "../../components/atoms/UliCore";

const BlogIndex = ({ data }) => {
  const blogs = data.allMdx.nodes;
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Heading level={2}>Blog</Heading>
          <Box>
            {blogs.map((blog) => {
              return (
                <Box>
                  <NavLink to={`${blog.fields.slug}`}>
                    <Paragraph fill>
                      <Text size={"xlarge"}>{blog.frontmatter.name}</Text>,
                      <Text>{" " + blog.frontmatter.author}</Text>
                    </Paragraph>
                  </NavLink>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
};

export const query = graphql`query BlogIndexQuery {
  allMdx(
    filter: {internal: {contentFilePath: {regex: "/.*/src/pages/blog/"}}}
    sort: {frontmatter: {date: DESC}}
  ) {
    nodes {
      fields {
        slug
      }
      frontmatter {
        name
        author
        date
      }
      internal {
        contentFilePath
      }
    }
  }
}`;

export default BlogIndex;
