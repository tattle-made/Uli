import { createFilePath } from "gatsby-source-filesystem"
import config from "./gatsby-config.js"

export const onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const relativeFilePath = createFilePath({ node, getNode })
    const absoluteFilePath = `${config.siteMetadata.siteUrl}${relativeFilePath}`
    createNodeField({
      node,
      name: 'slug',
      value: `${relativeFilePath}`
    });
  }
};
