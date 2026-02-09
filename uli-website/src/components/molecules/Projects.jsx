import { Box, Text } from "grommet";
import { navigate } from "gatsby";
import {
  SectionBorderTop,
  SectionBorderBottom,
  SectionBorderSides,
} from "./SectionBorders";
import React from "react";

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
      className={`w-[70%]
            2xl:w-[45%]
            min-h-72
            mx-auto
            border-solid
            border-[0.5em]
            [border-image-source:url('/project-card-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:round]
            px-20
            py-10
            items-center          
            gap-3
            2xl:gap-6
            flex
            ${order % 2 == 0 ? "flex-row" : "flex-row-reverse"}  `}
    >
      <Box
        className={`flex flex-col w-[60%] 2xl:w-[70%] gap-7 ${order % 2 != 0 ? "pl-6" : ""}`}
      >
        <Text size="xxlarge">{title}</Text>
        <Text>{content}</Text>
        <div className="flex gap-4">
          {buttons.map((btn, idx) => {
            return (
              <button
                key={idx}
                className="
                px-16 py-3 bg-transparent cursor-pointer border-1 border-solid
                [border-image-source:url('/dashed-btn-bg.png')]
                [border-image-slice:0%_fill]
                [border-image-repeat:round]"
                onClick={() => navigate(btn.url)}
              >
                {btn.content}
              </button>
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

