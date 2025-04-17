import React from "react"
import "./src/styles/global.css";

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

export const wrapRootElement = ({ element }) => {
  return <div id="app">{element}</div>;
};
