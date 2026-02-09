import { Box, Text } from "grommet";
import React from "react";

export function SectionBorderTop({ title }) {
  return (
    /* TOP BORDER WITH TEXT */
    <Box
      direction="row"
      align="center"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 20,
      }}
    >
      <Box
        flex
        style={{
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 20px",
          height: 20,
        }}
      />
      <Text
        size="large"
        margin={{ horizontal: "small" }}
        style={{ color: "black" }}
      >
        {title}
      </Text>
      <Box
        flex
        style={{
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 20px",
          height: 20,
        }}
      />
    </Box>
  );
}

export function SectionBorderSidesBottom() {
  return (
    <>
      {/* LEFT BORDER */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          bottom: 20,
          width: 20,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "20px auto",
        }}
      />
      {/* RIGHT BORDER */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          right: 0,
          bottom: 20,
          width: 20,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "20px auto",
        }}
      />
      {/* Bottom BORDER */ }
      <Box
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 20,
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 20px",
        }}
      />
    </>
  );
}

export function SectionBorderSides() {
  return (
    <>
      {/* LEFT BORDER */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          bottom: 0,
          width: 20,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "20px auto",
        }}
      />

      {/* RIGHT BORDER */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          right: 0,
          bottom: 0,
          width: 20,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "20px auto",
        }}
      />
    </>
  );
}
