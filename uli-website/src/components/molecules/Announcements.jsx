import { Box, Text } from "grommet";
import React, { useState, useEffect, useContext } from "react";
import DashedButton from "../atoms/DashedButton";
import { navigate } from "gatsby";

function AnnouncementBanner({ children }) {
  return (
    <Box
      align="center"
      className="
        w-fit
        mx-auto
        text-center
        border-solid
        border-[1.2em]
        px-2
        [border-image-source:url('/announcement-bg.svg')]
        [border-image-slice:33%_4%_fill]
        [border-image-repeat:round]>
        animate-[fadeUp_1.2s_ease-out_forwards]
    "
    >
      {children}
    </Box>
  );
}

export default function Announcements() {
  return (
    <AnnouncementBanner>
      <Box className="flex flex-col gap-2 items-center">
        <Text className="text-[0.8em] font-bold font-labrada">Uli joins UNICEF FemTech Cohort</Text>
        <Text className="text-[0.8em] font-labrada leading-[140%]">
          Our solution that monitors users’ social media feeds, identifies abuse and connects users to support networks has got selected to be developed further by the UNICEF FemTech Ventures.
        </Text>
        <DashedButton
          className="mt-1 w-fit px-10 py-2"
          content={<Text className="text-[13px] font-labrada tracking-[-0.05em]">Read the announcement</Text>}
          onClick={() => navigate("https://www.unicef.org/innovation/femtech-cohort-1")}
        />
      </Box>
    </AnnouncementBanner>
  );
}
