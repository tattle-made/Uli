import React, { useContext, useEffect, useState } from "react";
import { Box, ResponsiveContext, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { NavLinkNew } from "../atoms/NavLinkNew";

export default function NavBarNew() {
  const [open, setOpen] = useState(false);
  const size = useContext(ResponsiveContext);

  useEffect(()=>{
    console.log(size)
    console.log(open)
  },[size, open])

  return (
    <Box
      className={`font-labrada lg:bg-inherit transition-colors duration-300 ${open && "bg-[#FFE7D9]"}`}
      align="center"
      pad={"medium"}
      style={{
        backgroundImage: `url("/top-border.svg")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 20px",
      }}
    >
      <Box width="full" direction="row" align="center" className=" mt-4 lg:mt-0">
        <Box flex align="start">
          <NavLink to="/">
            <Text className="text-xl font-semibold">Tattle</Text>
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

        <Box flex direction="row" gap="medium" justify="end" align="end" className="lg:hidden" ><button className="bg-inherit m-0 p-0 border-none transition-transform duration-300" onClick={()=>{setOpen(prev => !prev)}}><img src={open ? "/cross-icon.svg" :"/hamburger-icon.svg"} alt="" className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`} /></button></Box>

        <Box flex direction="row" gap="medium" justify="end" className="hidden lg:flex">
          <NavLinkNew to="#">
            <Text className="text-xl font-medium">Contact</Text>
          </NavLinkNew>
          <NavLinkNew to="/about">
            <Text className="text-xl font-medium">About us</Text>
          </NavLinkNew>
          <NavLinkNew to="#">
            <Text className="text-xl font-medium">Data Y</Text>
          </NavLinkNew>
        </Box>
      </Box>

      <Box className={`bg-[#FFE7D9] w-full text-center overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 mt-9 mb-4" : "max-h-0 opacity-0"} lg:hidden`}>
        <Box className="flex flex-col gap-5 py-6">
          <NavLinkNew to="#">
            <Text className="text-xl font-medium">Contact</Text>
          </NavLinkNew>
          <NavLinkNew to="/about">
            <Text className="text-xl font-medium">About us</Text>
          </NavLinkNew>
          <NavLinkNew to="#">
            <Text className="text-xl font-medium">Data Y</Text>
          </NavLinkNew>
        </Box>


      </Box>
    </Box>
  );
}
