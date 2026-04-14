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
    icon: "/track_icons/Database.png",
    content:
      "Through participatory workshops, we create datasets on abuse in Indian languages. The flagship dataset is a dataset on online misogyny. We also maintain a dataset on slurs and abusive phrases in Indian languages.",
    buttons: [
      {
        content: "View Dataset Snapshot",
        url: "https://github.com/tattle-made/Uli/blob/main/browser-extension/plugin/scripts/slur-list.txt",
      }
    ],
  },
  {
    title: "Workshops",
    icon: "/track_icons/Workshops.png",
    content:
      "A pedagogical track to engage with young people upwards of 14 years in interactive sessions discussing forms of OGBV with a special focus on language-based abuse rampant on social media.",
    buttons: [
      {
        content: "Read workshop reflection",
        url: "https://tattle.co.in/blog/uli-coimbatore-workshop-retrospective/",
      },
    ],
  },
  {
    title: "User-Facing Tools",
    icon: "/track_icons/Tools.png",
    content:
      "Tattle builds tools to reduce the toxicity from people’s social media feeds to provide timely response. In 2022 we built a browser plugin. With support from UNICEF’s Femtech Venture Fund, we will build a tool to monitor users’ social media feeds to identify abuse and connect them to support networks.",
    buttons: [
      {
        content: "Browser Extension",
        url: "/",
      },
      // {
      //   content: "install",
      //   url: "/#",
      // },
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
              icon={project.icon}
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

function ProjectCard({ title, icon, content, buttons, order = 0 }) {
  const revealRef = useScrollReveal({ threshold: 0.1 });
  return (
    <Box
      ref={revealRef}
      className={`reveal smooth-layout
            w-full
<<<<<<< HEAD
            max-w-[800px]
            mx-auto
            border-solid
            border-[0.65em]
            [border-image-source:url('/project-card-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:stretch]
=======
            lg:w-[75%]
            2xl:w-[45%]
            mx-auto
            border-solid
            border-[0.5em]
            [border-image-source:url('/project-card-bg.svg')]
            [border-image-slice:0%_fill]
            [border-image-repeat:round]
>>>>>>> main
            px-6
            md:px-12
            lg:px-20
            py-12
            items-center      
            gap-12
            md:gap-16
            lg:gap-24
            flex
            flex-col-reverse
            ${order % 2 == 0 ? "md:flex-row" : "md:flex-row-reverse"}  `}
    >
      <Box
        className={`flex flex-col w-full md:w-[60%] lg:w-[65%] gap-8 $${order % 2 != 0 ? "lg:pl-8" : ""}`}
      >
        <Text className="text-[38px] mx-auto md:mx-0" style={{ fontFamily: "'XStitch', sans-serif" }}>{title}</Text>
        <Text className="text-[16px] leading-[150%]">{content}</Text>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {buttons.map((btn, idx) => {
            return (
              <DashedButton
                key={idx}
                className=" px-12 py-3 text-[16px] w-[90%] mx-auto md:mx-0"
                content={btn.content}
                onClick={() => navigate(btn.url)}
              />
            );
          })}
        </div>
      </Box>

      <Box className="flex items-center justify-center self-center flex-1 p-4 md:p-8">
        <img src={icon} alt={title} className="w-32 md:w-36 lg:w-40 h-auto object-contain max-h-[130px]" />
      </Box>
    </Box>
  );
}
