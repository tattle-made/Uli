import React, { useState } from "react";
import { Box, Nav, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function Footer() {
  return (
    <Box align="center">
      <Box
        margin={{ top: "small", bottom: "small" }}
        width={"large"}
        direction={"row-responsive"}
        align={"center"}
        gap="small"
      >
        <NavLink to="https://twitter.com/tattlemade">Twitter</NavLink>
        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="https://github.com/tattle-made/OGBV/tree/main/uli-website">GitHub</NavLink>
      </Box>
    </Box>
  );
}
