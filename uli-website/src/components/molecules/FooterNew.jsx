import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";

export default function FooterNew() {
  // const size = useContext(ResponsiveContext);

  return (
    <Box className="bg-[#2D2D2D] font-labrada text-white flex flex-col-reverse items-center gap-6 lg:flex-row justify-between">

      <NavLink to="/privacy-policy">Privacy Policy</NavLink>
      <NavLink to="/blog">Blog</NavLink>
      <NavLink to="https://github.com/tattle-made/OGBV/tree/main/uli-website">
        GitHub
      </NavLink>
      <NavLink to="/sitemap">
        SiteMap
      </NavLink>
    </Box>
  );
}
