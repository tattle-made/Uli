import React from "react";
import { Box, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { useContext } from "react";
import navbarBg from "../../images/navbar-bg.svg";


export default function NavBarNew() {
  const size = useContext(ResponsiveContext);

  return (
    <>
      {/* ---------- TOP SVG STRIP ---------- */}
      <Box
        height="20px"
        style={{
          backgroundImage: `url(${navbarBg})`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "top left",
          backgroundSize: "auto 20px",
        }}
      />

      {/* ---------- NAVBAR ---------- */}
      <Box
        align="center"
        background="#fff6e9"
        pad={{ vertical: "medium", horizontal: "small" }}
      >
        <Box
          width="xlarge"
          direction="row"
          align="center"
          justify="between"
          style={{
            position: "relative",
          }}
        >
          {/* ---------- LEFT ---------- */}
          <Box direction="row" gap="medium">
            <NavLink to="/">
              <Text size="small">Tattle</Text>
            </NavLink>
          </Box>

          {/* ---------- CENTER LOGO ---------- */}
          <Box
            style={{
              position: size === "small" ? "static" : "absolute",
              left: "50%",
              transform: size === "small" ? "none" : "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/Uli_Logo.png"
              alt="Uli Logo"
              style={{ height: "40px" }}
            />
          </Box>

          {/* ---------- RIGHT ---------- */}
          <Box direction="row" gap="medium">
            <NavLink to="/contact">
              <Text size="small">Contact</Text>
            </NavLink>
            <NavLink to="/about">
              <Text size="small">About us</Text>
            </NavLink>
            <NavLink to="/data">
              <Text size="small">Data Y</Text>
            </NavLink>
          </Box>
        </Box>
      </Box>
    </>
  );
}
