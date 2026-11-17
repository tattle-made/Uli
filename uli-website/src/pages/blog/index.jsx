import React from "react";
import { Box, Heading, Text, Paragraph } from "grommet";
import { graphql } from "gatsby";
import AppShell from "../../components/molecules/AppShell";
import { NavLink } from "../../components/atoms/UliCore";
import DashedButton from "../../components/atoms/DashedButton";

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
          <div className="flex flex-row items-center justify-between mb-12">
            <h1 className="text-[40px] md:text-[48px] font-extrabold text-black font-labrada m-0 leading-tight">
              Blog
            </h1>
            <DashedButton
              className="px-6 py-2.5 text-[15px] font-medium"
              content="Read Newsletter"
              onClick={() =>
                window.open(
                  "https://us19.campaign-archive.com/home/?u=a9af83af1f247ecc04f50ad46&id=f3e092d65e",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            />
          </div>
          <Box className="flex flex-col">
            {blogs.map((blog, idx) => {
              return (
                <React.Fragment key={blog.fields.slug}>
                  {idx > 0 && (
                    <div className="w-full flex">
                      <svg
                        className="w-full h-[1px]"
                        height="1"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="0"
                          y1="0.5"
                          x2="100%"
                          y2="0.5"
                          stroke="#000000"
                          strokeOpacity="0.2"
                          strokeDasharray="6 4"
                        />
                      </svg>
                    </div>
                  )}
                  <Box className="w-full my-2">
                    <NavLink
                      to={`${blog.fields.slug}`}
                      className="flex flex-col gap-1 no-underline py-4 px-3 -mx-3 rounded transition-colors duration-150 hover:bg-[#FFE7D9] active:bg-[#FFC8A6]"
                    >
                      <Text size="xlarge" className="font-semibold text-black">
                        {blog.frontmatter.name}
                      </Text>
                      {blog.frontmatter.author && (
                        <Text size="medium" className="text-black/80 font-normal">
                          {blog.frontmatter.author}
                        </Text>
                      )}
                      <Text
                        size="small"
                        color="text-slate-50"
                        className="text-black/60 font-light"
                      >
                        {formatDate(blog.frontmatter.date)}
                      </Text>
                    </NavLink>
                  </Box>
                </React.Fragment>
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
