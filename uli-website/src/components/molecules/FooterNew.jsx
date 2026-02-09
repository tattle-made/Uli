import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function FooterNew() {
  // const size = useContext(ResponsiveContext);

  return (
    <Box pad={"large"} className="bg-[#2D2D2D] text-white flex flex-row justify-between">

      <Box className="flex flex-col">
        <Text size="large">Uli by Tattle</Text>
        <Text size="small">Email & Other contents</Text>
      </Box>
      <Box className="flex flex-col lg:flex-row gap-4 text-base">
        <Text size="small" className="cursor-pointer">Link 1</Text>
        <Text size="small" className="cursor-pointer">Link 2</Text>
        <Text size="small" className="cursor-pointer">Link 3</Text>
      </Box>
    </Box>
  );
}
