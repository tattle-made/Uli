import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function Footer() {
  const size = useContext(ResponsiveContext);

  return (
    <Box align="center">
      <Box
        margin={{ top: "small", bottom: "small" }}
        width={"large"}
        direction={"row-responsive"}
        gap="small"
        style={
          size === "small"
            ? {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }
            : {}
        }
      >
        <NavLink to="https://twitter.com/tattlemade">Twitter</NavLink>
        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="https://github.com/tattle-made/OGBV/tree/main/uli-website">
          GitHub
        </NavLink>
        <NavLink to="/sitemap">
          SiteMap
        </NavLink>
      </Box>
    </Box>
  );
}
