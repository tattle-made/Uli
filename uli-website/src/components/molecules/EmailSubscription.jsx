import React, { useState, useEffect, useContext } from "react";
import { Box, Nav, Text, ResponsiveContext } from "grommet";
import { NavLink } from "../atoms/UliCore";
import { navigate } from "gatsby";

export default function EmailSubscription() {
  // const size = useContext(ResponsiveContext);

  return (
    <Box
      className="bg-[#2D2D2D] pt-28 px-2 md:px-6  text-white text-center flex flex-col items-center gap-10 "
    >
      <Text className="text-6xl lg:text-8xl">Stay Updated</Text>
      <Text className="w-full lg:w-[50%] 2xl:w-[30%]">
        Short Statement about what Uli isUse Uli to redact slurs and abusive
        content, archive problematic content, and collectively push back against
        online gender based violence.
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
            px-4
            items-center
            "
        >
          <img src="/mail-logo.svg" alt="" />
          <input
            type="text"
            className="w-full h-12 px-4 outline-none border-none bg-transparent"
          />
          <button className="border-0 px-6 h-8 text-white bg-[url(/subscribe-btn-bg.png)] cursor-pointer font-labrada"><Text size="small">Subscribe</Text></button>
        </div>
      </form>
    </Box>
  );
}
