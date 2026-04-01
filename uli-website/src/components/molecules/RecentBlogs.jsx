import { Box, Text } from "grommet";
import React from "react";
import { SectionBorderSides, SectionBorderTop } from "./SectionBorders";
import { graphql, useStaticQuery, navigate } from "gatsby";
import { useStaggerReveal } from "../../hooks/useScrollReveal";

function formatDate(input) {
  if (!input) return "";

  const timestamp = Number(input);
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Formats the author string to show abbreviated form (e.g., "John Doe et al.").
 *
 * @param {string} author - Full author name string, usually comma-separated.
 * @returns {string} Abbreviated author string.
 */

function formatAuthor(author) {
  if (typeof author !== "string") return "";
  let firstDividerIndex = -1;
  let dividers = ["&", "and", "And", ","];
  for (let d of dividers) {
    let i = author.indexOf(d);

    if (firstDividerIndex === -1) {
      firstDividerIndex = Math.max(firstDividerIndex, i);
    } else {
      firstDividerIndex = Math.max(firstDividerIndex, i);
    }
  }
  if (firstDividerIndex === -1) return author;

  author = author.substring(0, firstDividerIndex).trim().concat(" et al.");

  return author;
}

export default function RecentBlogs() {
  const data = useStaticQuery(graphql`
    {
      latestBlogs: allMdx(
        limit: 5
        sort: { frontmatter: { date: DESC } }
        filter: {
          internal: { contentFilePath: { regex: "/.*/src/pages/blog/" } }
        }
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            name
            excerpt
            author
            project
            date
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);
  console.log(data);
  const staggerRef = useStaggerReveal({ threshold: 0.05 });

  return (
    <Box
      style={{
        position: "relative",
        paddingTop: "2.4em",
      }}
    >
      <SectionBorderTop title={"Recent Blogs"} />
      <SectionBorderSides />
      <Box pad={"large"}>
        <Box ref={staggerRef} className="flex flex-col gap-6 reveal-stagger">
          {data.latestBlogs.nodes.map((blog, idx) => {
            return (
              <Box
                key={idx}
                className=" mx-auto border-t-0 border-r-0 border-l-0 border-b-2 border-dashed border-black/30 flex flex-col lg:flex-row gap-1 lg:gap-6 w-full lg:w-[70%] 2xl:w-[50%] pb-2 hover:bg-[#FFE7D9] active:bg-[#FFC8A6] focus:outline-none focus:ring-0 hover:scale-103 transition-transform duration-300 ease-in-out"
                onClick={() => navigate(blog.fields.slug)}
              >
                <Text className="min-w-[7em] text-xs lg:text-[14px]">
                  {formatDate(blog.frontmatter.date)}
                </Text>
                <Box className="cursor-pointer" style={{ textAlign: "start" }}>
                  <Text onClick={() => navigate(blog.fields.slug)} className="font-semibold lg:font-normal text-[14px] lg:text-[16px]">
                    {blog.frontmatter.name}
                  </Text>
                </Box>
                <Box className="lg:text-end" style={{ minWidth: "7em", flexGrow: 1 }}>
                  <Text className="text-[13px] lg:text-[14px]">{formatAuthor(blog.frontmatter.author)}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
