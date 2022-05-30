import React from "react";
import { Box } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function NavBar() {
  return (
    <Box align="center">
      <Box
        margin={{ top: "small" }}
        width={"large"}
        direction={"row-responsive"}
        align={"center"}
      >
        <Box
          width={"4em"}
          hoverIndicator
          focusIndicator={false}
          onClick={() => navigate("/")}
        >
          <img src={"/Uli_Logo.png"} alt={"Uli Logo"} />
        </Box>

        <Box flex={"grow"} />
        <Box direction="row" gap={"medium"}>
          <NavLink to={"/user-guide"}>User Guide</NavLink>
          {/* <NavLink to={"/blog"}>Blog</NavLink> */}
          <NavLink to={"/privacy-policy"}>Privacy Policy</NavLink>
          <NavLink to={"/about"}>About</NavLink>
        </Box>
      </Box>
    </Box>
  );
}
