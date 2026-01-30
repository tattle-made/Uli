import React from "react";
import { projects } from "../../config/projects";
import ProjectCard from "./ProjectCard";
import topBorder from "../../images/ProjectsTitle.svg";
import sideBorder from "../../images/left-border.svg";

const Projects = () => {
  return (
    <section
      style={{
        backgroundColor: "#fff6eb",
        position: "relative",
      }}
    >
      {/* 🔝 TOP BORDER */}
      <div
        style={{
          height: "50px",
          backgroundImage: `url(${topBorder})`,
          backgroundSize: "auto 100%",
        }}
      />

      {/* ⬅️➡️ SIDE BORDERS WRAPPER */}
      <div
        style={{
          backgroundImage: `url(${sideBorder}), url(${sideBorder})`,
          backgroundRepeat: "repeat-y, repeat-y",
          backgroundPosition: "left top, right top",
          backgroundSize: "auto 100%",
          padding: "80px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
