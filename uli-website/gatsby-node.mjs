import { createFilePath } from "gatsby-source-filesystem"

export const onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const relativeFilePath = createFilePath({ node, getNode })
    console.log(relativeFilePath);
    createNodeField({
      node,
      name: 'slug',
      value: `${relativeFilePath}`
    });
  }
};
