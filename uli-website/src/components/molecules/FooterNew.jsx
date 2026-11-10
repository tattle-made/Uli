import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";

export default function FooterNew() {
  // const size = useContext(ResponsiveContext);

  return (
    <div className="bg-[#2D2D2D] w-full flex flex-col items-center">
      {/* Dashed divider above Footer links from Figma node 493:287 */}
      <div className="w-full flex justify-center px-4 md:px-12">
        <div className="w-full max-w-[1130px] border-t border-dashed border-[#FFF6E8]/40" />
      </div>

      <Box className="w-full max-w-[1130px] py-8 px-4 md:px-12 font-labrada text-white flex flex-col-reverse items-center gap-6 lg:flex-row justify-between">
        <NavLink to="/privacy-policy">Privacy Policy</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="https://github.com/tattle-made/OGBV/tree/main/uli-website">
          GitHub
        </NavLink>
        <NavLink to="/sitemap">
          SiteMap
        </NavLink>
      </Box>
    </div>
  );
}
