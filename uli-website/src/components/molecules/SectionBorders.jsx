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
        height: 21,
      }}
    >
      <Box
        flex
        className="border-animate-x-delay"
        style={{
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 21px",
          height: 21,
        }}
      />
      <Text
        className="text-2xl lg:text-[30px]"
        margin={{ horizontal: "small", bottom: "small" }}
        style={{ color: "black", fontFamily: "'Eenvoudige Batik', sans-serif" }}
      >
        {title}
      </Text>
      <Box
        flex
        className="border-animate-x-delay"
        style={{
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 21px",
          height: 21,
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
        className="hidden lg:block border-animate-y-delay"
        style={{
          position: "absolute",
          top: 21,
          left: 0,
          bottom: 21,
          width: 21,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "21px auto",
        }}
      />
      {/* RIGHT BORDER */}
      <Box
        className="hidden lg:block border-animate-y-delay"
        style={{
          position: "absolute",
          top: 21,
          right: 0,
          bottom: 21,
          width: 21,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "21px auto",
        }}
      />
      {/* Bottom BORDER */}
      <Box
        className="border-animate-x-delay"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 21,
          backgroundImage: 'url("/section-border.svg")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 21px",
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
        className="hidden lg:block border-animate-y-delay"
        style={{
          position: "absolute",
          top: 21,
          left: 0,
          bottom: 0,
          width: 21,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "21px auto",
        }}
      />

      {/* RIGHT BORDER */}
      <Box
        className="hidden lg:block border-animate-y-delay"
        style={{
          position: "absolute",
          top: 21,
          right: 0,
          bottom: 0,
          width: 21,
          backgroundImage: 'url("/section-border-vertical.svg")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "21px auto",
        }}
      />
    </>
  );
}
