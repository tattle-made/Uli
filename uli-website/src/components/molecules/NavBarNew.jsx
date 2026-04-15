import React, { useContext, useEffect, useState, useRef } from "react";
import { Box, ResponsiveContext, Text } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { NavLinkNew } from "../atoms/NavLinkNew";
import TattleLogo from "../atoms/TattleLogo";

export default function NavBarNew() {
  const [open, setOpen] = useState(false);
  const size = useContext(ResponsiveContext);
  const borderRef = useRef(null);

  // Scroll-driven border animation: shifts background-position-x as user scrolls
  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (borderRef.current) {
          const scrollY = window.scrollY || window.pageYOffset;
          // Slow drift: 0.3x scroll speed
          borderRef.current.style.backgroundPositionX = `${scrollY * 0.3}px`;
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Box
      ref={borderRef}
      className={`font-labrada lg:bg-inherit transition-colors duration-300 border-animate-x ${open && "bg-[#FFE7D9]"}`}
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
          <NavLink as="a" href="https://tattle.co.in/">
            <TattleLogo data={{scale: 0.8}} />
          </NavLink>
        </Box>
        

        <Box align="center">
          <img
            src="/Uli_Logo.png"
            alt="Uli Logo"
            style={{ height: "32px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        <Box flex direction="row" gap="medium" justify="end" align="end" className="lg:hidden" ><button className="bg-inherit m-0 p-0 border-none transition-transform duration-300" onClick={() => { setOpen(prev => !prev) }}><img src={open ? "/cross-icon.svg" : "/hamburger-icon.svg"} alt="" className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`} /></button></Box>

        <Box flex direction="row" gap="medium" justify="end" className="hidden lg:flex">
          {/* <NavLinkNew to="#">
            <Text className="text-[16px] font-medium">Contact</Text>
          </NavLinkNew> */}
          {/* <NavLinkNew to="/about">
            <Text className="text-[16px] font-medium">About us</Text>
          </NavLinkNew> */}
          <NavLinkNew to="/blog">
            <Text className="text-[16px] font-medium">Blog</Text>
          </NavLinkNew>
        </Box>
      </Box>

      <Box className={`bg-[#FFE7D9] w-full text-center overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 mt-9 mb-4" : "max-h-0 opacity-0"} lg:hidden`}>
        <Box className="flex flex-col gap-5 py-6">
          {/* <NavLinkNew to="/about">
            <Text className="text-[16px] font-medium">About us</Text>
          </NavLinkNew> */}
          <NavLinkNew to="/blog">
            <Text className="text-[16px] font-medium">Blog</Text>
          </NavLinkNew>
        </Box>


      </Box>
    </Box>
  );
}
