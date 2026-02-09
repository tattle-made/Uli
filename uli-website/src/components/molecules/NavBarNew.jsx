import React from "react";
import { Box, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function NavBarNew() {
  return (
    <Box
      align="center"
      pad={"medium"}
      style={{
        backgroundImage: `url("/top-border.svg")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 20px",
      }}
    >
      <Box width="full" direction="row" align="center">
        <Box flex align="start">
          <NavLink to="/">
            <Text size="small">Tattle</Text>
          </NavLink>
        </Box>

        <Box align="center">
          <img
            src="/Uli_Logo.png"
            alt="Uli Logo"
            style={{ height: "40px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Box flex direction="row" gap="medium" justify="end">
          <NavLink to="#">
            <Text size="small">Contact</Text>
          </NavLink>
          <NavLink to="/about">
            <Text size="small">About us</Text>
          </NavLink>
          <NavLink to="#">
            <Text size="small">Data Y</Text>
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
}
