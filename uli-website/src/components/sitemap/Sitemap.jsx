import React from "react";
import { Box, Heading } from "grommet";
import { Link, useStaticQuery, graphql } from "gatsby";

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

  // Build tree structure and skip empty intermediate folders
  const buildTree = (pages) => {
    const root = {};

    // Build a nested tree of paths
    pages.forEach(({ path }) => {
      const parts = path.split("/").filter(Boolean);
      let current = root;

      parts.forEach((part, index) => {
        if (!current[part]) current[part] = { __children: {}, __isPage: false };
        if (index === parts.length - 1) {
          current[part].__isPage = true; // mark as page only for actual file
        }
        current = current[part].__children;
      });
    });

    // Remove folders that don't contain pages
    const pruneEmpty = (node) => {
      const pruned = {};
      Object.entries(node).forEach(([key, value]) => {
        const prunedChildren = pruneEmpty(value.__children);
        const hasChildren = Object.keys(prunedChildren).length > 0;

        if (value.__isPage || hasChildren) {
          pruned[key] = {
            ...value,
            __children: prunedChildren,
          };
        }
      });
      return pruned;
    };

    return pruneEmpty(root);
  };

  const tree = buildTree(data.allSitePage.nodes);

  // Recursive renderer for list
  const renderTree = (node, base = "") =>
    Object.entries(node).map(([key, value]) => {
      const fullPath = `${base}/${key}`;
      const hasChildren = Object.keys(value.__children || {}).length > 0;

      return (
        <li key={fullPath} style={{ marginBottom: "6px", lineHeight: "1.8rem" }}>
          {/* Link if page exists */}
          {value.__isPage ? (
            <Link
              to={fullPath}
              style={{
                textDecoration: "none",
                color: "#5A4230", // same as Uli nav link color
                fontWeight: "bold",
              }}
            >
              {key}
            </Link>
          ) : (
            <span style={{ color: "#5A4230", fontWeight: "600" }}>{key}</span>
          )}

          {/* Render children recursively */}
          {hasChildren && (
            <ul style={{ marginLeft: "1.5rem", listStyleType: "disc" }}>
              {renderTree(value.__children, fullPath)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <Box
      background="##FCF3E8" // same as Uli main background color
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
