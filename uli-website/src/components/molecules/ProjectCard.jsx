import React from "react";
import projectImage from "../../images/projectImage.svg";

const pixelCutShape =
  "polygon(" +
  "0% 20%, 3% 20%, 3% 10%, 6% 10%, 6% 0%, " +
  "94% 0%, 94% 10%, 97% 10%, 97% 20%, 100% 20%, " +
  "100% 80%, 97% 80%, 97% 90%, 94% 90%, 94% 100%, " +
  "6% 100%, 6% 90%, 3% 90%, 3% 80%, 0% 80%" +
  ")";

const ProjectCard = ({ title, description, reverse }) => {
  return (
    <div
      style={{
        background: "#fde9d9",
        padding: "10px",
        clipPath: pixelCutShape,
      }}
    >
      <div
        style={{
          backgroundColor: "#fde9d9",
          padding: "44px 56px",
          clipPath: pixelCutShape,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: reverse ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
          }}
        >
          {/* LEFT ICON */}
          <img
            src={projectImage}
            alt=""
            style={{ width: "180px" }}
          />

          {/* TEXT */}
          <div style={{ maxWidth: "55%" }}>
            <h3 style={{ marginBottom: "16px" }}>{title}</h3>

            <p style={{ marginBottom: "24px", lineHeight: "1.6" }}>
              {description}
            </p>

            <div style={{ display: "flex", gap: "18px" }}>
              <button style={btnStyle}>Install</button>
              <button style={btnStyle}>Install</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
  background: "transparent",
  border: "2px dashed #000",
  padding: "10px 28px",
  cursor: "pointer",
};

export default ProjectCard;
