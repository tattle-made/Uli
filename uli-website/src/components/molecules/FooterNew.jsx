import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { Link, navigate } from "gatsby";

export default function FooterNew() {
  // const size = useContext(ResponsiveContext);

  return (
    <Box pad={{top: "large", bottom: "xlarge", horizontal:"xlarge"}} className="bg-[#2D2D2D] font-labrada text-white flex flex-col-reverse items-center gap-6 lg:flex-row justify-between">

      {/* <Box className="flex flex-col items-center lg:items-start">
        <Text className="text-[19px] font-medium">Uli by Tattle</Text>
         <Text className="text-[13px] font-medium">Email & Other contacts</Text> 
      </Box>
      <Box className="flex flex-col lg:flex-row gap-3 text-[13px]">
        <Link >
          <Text className="text-[13px] font-medium cursor-pointer">Github</Text>
        </Link>
        <Text className="text-[13px] font-medium cursor-pointer">Link 2</Text>
        <Text className="text-[13px] font-medium cursor-pointer">Link 3</Text>
      </Box> */}
    </Box>
  );
}
