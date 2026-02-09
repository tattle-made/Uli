import { Box, Text } from "grommet";
import React, { useState, useEffect, useContext } from "react";


function AnnouncementBanner({ children }) {
    return (
        <Box align="center" className="

    w-fit
    mx-auto
    text-center
    border-solid
    border-[1.5em]
    px-2
    [border-image-source:url('/announcement-long-div.svg')]
    [border-image-slice:33%_4%_fill]
    [border-image-repeat:round]>
    ">
            {children}

        </Box>
    );
}

export default function Announcements() {
    return(
        <AnnouncementBanner>
          <Box className="flex flex-col gap-3 items-center">
            <Text size="xlarge">Announcement</Text>
            <Box>That white background would typically be a solid fill with border radius, and using Auto Layout <br /> would be able to grow and shrink based on the label overrides per instance.</Box>
            <button className="
                mt-2 w-fit px-12 py-3 bg-transparent cursor-pointer border-1 border-solid
                [border-image-source:url('/dashed-btn-bg.png')]
                [border-image-slice:0%_fill]
                [border-image-repeat:round]"> <Text size="small">Learn more</Text></button>
          </Box>

        </AnnouncementBanner>
    )
}
