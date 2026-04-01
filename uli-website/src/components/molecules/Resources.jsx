import { Box, Text } from "grommet";
import React from "react";
import {
  SectionBorderSides,
  SectionBorderSidesBottom,
  SectionBorderTop,
} from "./SectionBorders";
import { graphql, useStaticQuery, navigate } from "gatsby";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const resourcesConfig = [
  {
    category: "For Platforms",
    resources: [
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
    ],
  },
  {
    category: "For Educators",
    resources: [
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
    ],
  },
  {
    category: "For Technologists",
    resources: [
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
      {
        type: "Report",
        name: "Make It Real - Mapping AI-Facilitated",
        url: "/#",
      },
    ],
  },
];

export default function Resources() {
  return (
    <Box
      pad={"large"}
      style={{
        position: "relative",
      }}
    >
      <SectionBorderTop title={"Resources"} />
      <SectionBorderSidesBottom />
      <Box className="py-5 lg:px-5">
        <Box className="flex flex-col gap-12 lg:gap-16 mx-auto w-full lg:w-[70%] 2xl:w-[50%] smooth-layout">
          {resourcesConfig.map((resource, idx) => {
            return (
              <Box
                key={idx}
                className=" flex flex-col gap-5 lg:gap-0 lg:flex-row items-start justify-center"
              >
                <Box className="min-w-[25%]">
                  <Text className="text-[16px] lg:text-[19px]">{resource.category}</Text>
                </Box>
                <Box className="flex w-full lg:w-[50%] flex-col gap-4 ">
                  {resource.resources.map((r, id) => {
                    return (
                      <Box
                        key={id}
                        className=" cursor-pointer flex flex-row lg:justify-between pb-[5px] pr-2 grow  border-t-0 border-r-0 border-l-0 border-b-2 border-dashed border-black/30 hover:bg-[#FFE7D9] active:bg-[#FFC8A6] focus:outline-none focus:ring-0 hover:scale-100 transition-transform duration-100 ease-in-out"
                        onClick={() => navigate(r.url)}
                      >
                        <Text className="w-[30%] md:w-[15%] lg:w-auto text-[14px] lg:text-[16px]">{r.type}</Text>
                        <Text
                          className="cursor-pointer text-[14px] lg:text-[16px]"
                          onClick={() => navigate(r.url)}
                        >
                          {r.name}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
