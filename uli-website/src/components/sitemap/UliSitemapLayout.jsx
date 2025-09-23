import React from "react"
import { Box, Heading } from "grommet"
import { Link, graphql, useStaticQuery } from "gatsby"

const pageTitles = {
  "/": "Home",
  "/about/": "About",
  "/projects/": "Projects",
  "/blog/": "Blog",
  "/contact/": "Contact",
}

function buildTree(pages) {
  const tree = {}
  pages.forEach(({ path }) => {
    const parts = path.split("/").filter(Boolean)
    let current = tree

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = { __path: "/" + parts.slice(0, index + 1).join("/") + "/" }
      }
      current = current[part]
    })
  })
  return tree
}

function renderTree(tree, level = 0) {
  const bulletStyle = level === 0 ? "disc" : "circle"

  return (
    <ul style={{ listStyleType: bulletStyle, paddingLeft: level ? "1.5rem" : "1rem" }}>
      {Object.entries(tree).map(([key, value]) => {
        if (key === "__path") return null
        const name =
          pageTitles[value.__path] ||
          key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ")
        return (
          <li key={value.__path}>
            <Link to={value.__path} style={{ textDecoration: "none", fontWeight: 500 }}>
              {name}
            </Link>
            {renderTree(value, level + 1)}
          </li>
        )
      })}
    </ul>
  )
}

export default function UliSitemapLayout() {
  const data = useStaticQuery(graphql`
    {
      allSitePage {
        nodes {
          path
        }
      }
    }
  `)

  const pages = data.allSitePage.nodes.filter(
    node => !node.path.includes("404") && !node.path.includes("dev-404")
  )

  const tree = buildTree(pages)

  return (
    <Box width="100%" pad={{ vertical: "large" }} align="center">
      <Heading level={2} margin={{ bottom: "medium" }} textAlign="center">
        Uli Site Map
      </Heading>

      {/* Content left aligned (normal page content ki tarah) */}
      <Box width="xlarge" margin={{ horizontal: "auto" }} pad={{ horizontal: "medium" }}>
        <Box style={{ maxWidth: "800px", lineHeight: "2rem" }}>
          {renderTree(tree)}
        </Box>
      </Box>
    </Box>
  )
}
