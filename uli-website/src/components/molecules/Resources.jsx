import { Box, Text } from "grommet";
import React from "react";
import {
  SectionBorderSides,
  SectionBorderSidesBottom,
  SectionBorderTop,
} from "./SectionBorders";
import { graphql, useStaticQuery, navigate } from "gatsby";

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
      <Box className="py-6 lg:px-6">
        <Box className="flex flex-col gap-16 lg:gap-20 mx-auto w-full lg:w-[70%] 2xl:w-[50%]">
          {resourcesConfig.map((resource, idx) => {
            return (
              <Box
                key={idx}
                className=" flex flex-col gap-6 lg:gap-0 lg:flex-row items-start justify-center"
              >
                <Box className="min-w-[25%]">
                  <Text size="large">{resource.category}</Text>
                </Box>
                <Box className="flex w-full lg:w-[50%] flex-col gap-5">
                  {resource.resources.map((r, id) => {
                    return (
                      <Box
                        key={id}
                        className=" flex flex-row lg:justify-between pb-[6px] pr-3 grow  border-t-0 border-r-0 border-l-0 border-b-2 border-dashed border-black/30"
                      >
                        <Text className="w-[30%] md:w-[15%] lg:w-auto">{r.type}</Text>
                        <Text
                          className="cursor-pointer"
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
