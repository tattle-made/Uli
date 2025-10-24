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

  // Create a tree structure but skip folders that don’t have pages
  const buildTree = (pages) => {
    const root = {};

    pages.forEach(({ path }) => {
      const parts = path.split("/").filter(Boolean);
      let current = root;

      parts.forEach((part, index) => {
        if (!current[part]) current[part] = { __children: {} };
        current = current[part].__children;

        // Only mark as page if it ends here (no trailing slash)
        if (index === parts.length - 1) {
          current.__isPage = true;
        }
      });
    });

    return root;
  };

  const tree = buildTree(data.allSitePage.nodes);

  const renderTree = (node, base = "") =>
    Object.entries(node)
      .filter(([key]) => key !== "__children" && key !== "__isPage")
      .map(([key, value]) => {
        const fullPath = `${base}/${key}`;
        const hasChildren = Object.keys(value.__children || {}).length > 0;

        // Show only if page exists or has children with pages
        if (value.__isPage || hasChildren) {
          return (
            <Box key={fullPath} margin={{ vertical: "xsmall" }}>
              {value.__isPage ? <Link to={fullPath}>{key}</Link> : <strong>{key}</strong>}
              {hasChildren && (
                <Box margin={{ left: "medium" }}>
                  {renderTree(value.__children, fullPath)}
                </Box>
              )}
            </Box>
          );
        }
        return null;
      });

  return (
    <Box pad={{ horizontal: "large", vertical: "medium" }} width="xlarge" alignSelf="center">
      <Heading level={2} margin={{ bottom: "medium" }} textAlign="center">
        Site Map
      </Heading>
      {renderTree(tree)}
    </Box>
  );
}
