import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function EmailSubscription() {
  // const size = useContext(ResponsiveContext);
  const revealRef = useScrollReveal({ threshold: 0.1 });

  return (
    <Box
      ref={revealRef}
      className="reveal bg-[#2D2D2D] pt-20 px-2 md:px-5 text-white text-center flex flex-col items-center gap-8 smooth-layout"
    >
      <Text className="text-5xl lg:text-[77px]">Stay Updated</Text>
      <Text className="w-full lg:w-[50%] 2xl:w-[30%] text-[16px] lg:text-[19px] leading-[120%]">
        An endeavour to build safer online spaces in India by collectivizing women and gender minorities for creating representative data and tools for detection of online abuse, and supporting each other in times of need.
      </Text>
      <form action="#" className="w-full flex justify-center">
        <div
          className="w-full lg:w-[50%] 2xl:w-[30%] 
            border-1
            border-solid 
            [border-image-source:url('/subscribe-bar-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:round]
            relative
            flex 
            flex-row
            px-3
            items-center
            "
        >
          <img src="/mail-logo.svg" alt="" />
          <input
            type="text"
            className="w-full h-10 px-3 outline-none border-none bg-transparent"
          />
          <button className="border-0 px-5 h-7 text-white bg-[url(/subscribe-btn-bg.png)] cursor-pointer font-labrada"><Text className="text-[13px]">subscribe</Text></button>
        </div>
      </form>
    </Box>
  );
}
