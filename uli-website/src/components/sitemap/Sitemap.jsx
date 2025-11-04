import React from "react";
import { Box, Heading } from "grommet";
import { Link, useStaticQuery, graphql } from "gatsby";
import generateDisplayName from "../../utils/generateDisplayName"; 

export default function Sitemap() {
  // Fetch all site pages
  const data = useStaticQuery(graphql`
    {
      allSitePage(
        filter: { path: { ne: "/dev-404-page/" } }
        sort: { path: ASC }
      ) {
        nodes {
          path
        }
      }
    }
  `);

  // Paths to ignore
  const ignoredPaths = [
    "/404/",
    "/404.html",
    "/dev-404-page/",
    "/offline-plugin-app-shell-fallback/",
  ];

  // Build tree structure
  const buildTree = (pages) => {
    const root = {};

    pages.forEach(({ path }) => {
      if (ignoredPaths.includes(path)) return; // skip ignored pages

      // Skip nested blog pages (keep only /blog)
      if (path.startsWith("/blog/") && path !== "/blog/") return;

      const parts = path.split("/").filter(Boolean);
      let current = root;

      parts.forEach((part, index) => {
        if (!current[part]) current[part] = { __children: {}, __isPage: false };
        if (index === parts.length - 1) {
          current[part].__isPage = true;
        }
        current = current[part].__children;
      });
    });

    return root;
  };

  const tree = buildTree(data.allSitePage.nodes);

  // Recursive renderer
  const renderTree = (node, base = "") =>
    Object.entries(node).map(([key, value]) => {
      const fullPath = `${base}/${key}`;
      const hasChildren = Object.keys(value.__children || {}).length > 0;

      return (
        <li key={fullPath} style={{ marginBottom: "6px", lineHeight: "1.8rem" }}>
          {value.__isPage ? (
            <Link
              to={fullPath}
              style={{
                textDecoration: "none",
                color: "#5A4230",
                fontWeight: "bold",
              }}
            >
              {generateDisplayName(key)}
            </Link>
          ) : (
            <span style={{ color: "#5A4230", fontWeight: "600" }}>
              {generateDisplayName(key)}
            </span>
          )}

          {hasChildren && (
            <ul style={{listStyleType: "disc" }}>
              {renderTree(value.__children, fullPath)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <Box
      pad={{ vertical: "large" }}
      align="center"
    >
      <Box
        width="xlarge"
        margin={{ horizontal: "auto" }}
        pad={{ horizontal: "large" }}
        style={{ maxWidth: "800px" }}
      >
        <Heading level={2} margin={{ bottom: "medium" }} textAlign="center">
          Site Map
        </Heading>

        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "1.5rem",
            textAlign: "left",
          }}
        >
          {renderTree(tree)}
        </ul>
      </Box>
    </Box>
  );
}
