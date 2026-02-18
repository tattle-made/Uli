import { Box, Text } from "grommet";
import { navigate } from "gatsby";
import {
  SectionBorderTop,
  SectionBorderBottom,
  SectionBorderSides,
} from "./SectionBorders";
import React from "react";
import DashedButton from "../atoms/DashedButton";

const projectsConfig = [
  {
    title: "Title",
    content:
      "Use Uli to redact slurs and abusive content, archive problematic content, and collectively push back against online gender based violence",
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
    title: "Title",
    content:
      "Use Uli to redact slurs and abusive content, archive problematic content, and collectively push back against online gender based violence",
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
      <SectionBorderTop title={"Projects"} />
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
  return (
    <Box
      className={`
            w-full
            lg:w-[70%]
            2xl:w-[40%]
            min-h-72
            mx-auto
            border-solid
            border-[0.5em]
            [border-image-source:url('/project-card-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:round]
            md:px-10
            lg:px-20
            py-10
            items-center      
            gap-9    
            md:gap-3
            2xl:gap-6
            flex
            flex-col-reverse
            ${order % 2 == 0 ? "md:flex-row" : "md:flex-row-reverse"}  `}
    >
      <Box
        className={`flex flex-col w-[90%] md:w-[60%] 2xl:w-[70%] gap-10  md:gap-7 ${order % 2 != 0 ? "lg:pl-6" : ""}`}
      >
        <Text  className="text-5xl mx-auto md:mx-0">{title}</Text>
        <Text size="large">{content}</Text>
        <div className="flex flex-col md:flex-row gap-4">
          {buttons.map((btn, idx) => {
            return (
              <DashedButton
                key={idx}
                className=" px-16 py-3 text-xl w-[90%] mx-auto"
                content={btn.content}
                onClick={() => navigate(btn.url)}
              />
            );
          })}
        </div>
      </Box>

      <Box className={`flex  items-center self-center`}>
        <img src="/project-card-logo.svg" alt="" srcset="" className="w-52" />
      </Box>
    </Box>
  );
}
