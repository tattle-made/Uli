import React from "react";
import { Box, Heading, Text, Paragraph } from "grommet";
import { graphql } from "gatsby";
import AppShell from "../../components/molecules/AppShell";
import { NavLink } from "../../components/atoms/UliCore";

const BlogIndex = ({ data }) => {
  const blogs = data.allMdx.nodes;

  // Function to convert timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp)); // Timestamp ko date mein convert kar rahe hain
    return date.toLocaleDateString(); // Date ko readable format mein dikhana
  };

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Heading level={2}>Blog</Heading>
          <Box>
            {blogs.map((blog) => {
              return (
                <Box key={blog.fields.slug} margin={{ bottom: "medium" }}>
                  <NavLink to={`${blog.fields.slug}`}>
                    <Paragraph fill margin="none">
                      <Text size={"xlarge"}>{blog.frontmatter.name}</Text>,
                      <Text> {blog.frontmatter.author}</Text>
                    </Paragraph>
                    {/* Publish date ko yahan display kiya gaya hai */}
                    <Text size="small"
                      color="grey"
                      margin={{ top: "xxsmall" }}>
                      Published on: {formatDate(blog.frontmatter.date)}
                    </Text>
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
