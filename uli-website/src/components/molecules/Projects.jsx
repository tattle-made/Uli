import { Box, Text } from "grommet";
import { navigate } from "gatsby";
import {
  SectionBorderTop,
  SectionBorderBottom,
  SectionBorderSides,
} from "./SectionBorders";
import React from "react";
import DashedButton from "../atoms/DashedButton";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const projectsConfig = [
  {
    title: "Datasets",
    content:
      "Through participatory workshops, we create datasets on abuse in Indian languages. The flagship dataset is a dataset on online misogyny. We also maintain a dataset on slurs and abusive phrases in Indian languages.",
    buttons: [
      {
        content: "install",
        url: "/#",
      },
      {
        content: "install",
        url: "https://google.com",
      },
    ],
  },
  {
    title: "Workshops",
    content:
      "A pedagogical track to engage with young people upwards of 14 years in interactive sessions discussing forms of OGBV with a special focus on language-based abuse rampant on social media.",
    buttons: [
      {
        content: "install",
        url: "/#",
      },
      {
        content: "install",
        url: "/#",
      },
    ],
  },
  {
    title: "User-Facing Tools",
    content:
      "Tattle builds tools to reduce the toxicity from people’s social media feeds to provide timely response. In 2022 we built a browser plugin. With support from UNICEF’s Femtech Venture Fund, we will build a tool to monitor users’ social media feeds to identify abuse and connect them to support networks.",
    buttons: [
      {
        content: "install",
        url: "/#",
      },
      {
        content: "install",
        url: "/#",
      },
    ],
  },
];

export default function Projects() {
  return (
    <Box
      style={{
        position: "relative",
      }}
    >
      <SectionBorderTop title={"Tracks"} />
      <SectionBorderSides />

      {/* CONTENT */}
      <Box pad="large">
        {projectsConfig.map((project, idx) => {
          return (
            <ProjectCard
              key={idx}
              title={project.title}
              content={project.content}
              buttons={project.buttons}
              order={idx}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function ProjectCard({ title, content, buttons, order = 0 }) {
  const revealRef = useScrollReveal({ threshold: 0.1 });
  return (
    <Box
      ref={revealRef}
      className={`reveal smooth-layout
            w-full
            lg:w-[70%]
            2xl:w-[40%]
            min-h-[360px]
            mx-auto
            border-solid
            border-[0.5em]
            [border-image-source:url('/project-card-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:round]
            md:px-8
            lg:px-16
            py-[1.25rem]
            items-center      
            gap-7    
            md:gap-3
            2xl:gap-5
            flex
            flex-col-reverse
            ${order % 2 == 0 ? "md:flex-row" : "md:flex-row-reverse"}  `}
    >
      <Box
        className={`flex flex-col w-[90%] md:w-[60%] 2xl:w-[70%] gap-10  md:gap-7 ${order % 2 != 0 ? "lg:pl-5" : ""}`}
      >
        <Text className="text-[38px] mx-auto md:mx-0">{title}</Text>
        <Text className="text-[16px] leading-[133%]">{content}</Text>
        <div className="flex flex-col md:flex-row gap-3">
          {buttons.map((btn, idx) => {
            return (
              <DashedButton
                key={idx}
                className=" px-12 py-2 text-[16px] w-[90%] mx-auto"
                content={btn.content}
                onClick={() => navigate(btn.url)}
              />
            );
          })}
        </div>
      </Box>

      <Box className={`flex  items-center self-center`}>
        <img src="/project-card-logo.svg" alt="" srcset="" className="w-40" />
      </Box>
    </Box>
  );
}
