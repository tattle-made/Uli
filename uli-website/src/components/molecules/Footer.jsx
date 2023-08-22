import React, { useState, useEffect } from "react";
import { Box, Nav, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function Footer() {

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isSmallScreen = windowWidth <= 768;


  return (
    <Box align="center">
      <Box
        margin={{ top: "small", bottom: "small" }}
        width={"large"}
        direction={"row-responsive"}
        gap="small"
        style={
          isSmallScreen
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
    </Box>
    </Box >
  );
}
