import React from "react";
import { Box, Text } from "grommet";
import sideBorder from "../../images/left-border.svg";

const resources = [
  {
    heading: "For Platforms",
    items: [
      { type: "Report", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Guidelines", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Database", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
    ],
  },
  {
    heading: "For Educators",
    items: [
      { type: "Report", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Guidelines", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Database", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
    ],
  },
  {
    heading: "For Technologists",
    items: [
      { type: "Report", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Guidelines", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
      { type: "Database", title: "Make It Real - Mapping AI-Facilitated Gendered Harm" },
    ],
  },
];

const ResourcesSection = () => {
  return (
    <Box background="#FFF6E9">

      {/* Top Decorative Border */}
      <Box
        height="40px"
        style={{
          backgroundImage: `url(${sideBorder})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Centered Content Wrapper */}
      <Box width="100%" align="center" pad={{ vertical: "large" }}>
        <Box width="1100px">

          {/* Title */}
          <Text
            size="48px"
            weight="bold"
            alignSelf="center"
            margin={{ bottom: "large" }}
            style={{ fontFamily: "serif" }}
          >
            Resources
          </Text>

          {/* Sections */}
          {resources.map((section, index) => (
            <Box key={index} margin={{ bottom: "large" }}>

              <Box direction="row" align="start" gap="large">

                {/* Left Heading */}
                <Box width="250px">
                  <Text
                    weight="bold"
                    size="22px"
                    style={{ fontFamily: "serif" }}
                  >
                    {section.heading}
                  </Text>
                </Box>

                {/* Right Content */}
                <Box flex>
                  {section.items.map((item, idx) => (
                    <Box
                      key={idx}
                      direction="row"
                      gap="medium"
                      margin={{ bottom: "small" }}
                    >
                      {/* Type */}
                      <Text
                        size="18px"
                        color="dark-4"
                        style={{ minWidth: "120px" }}
                      >
                        {item.type}
                      </Text>

                      {/* Title */}
                      <Text
                        size="18px"
                        style={{ fontFamily: "serif" }}
                      >
                        {item.title}
                      </Text>
                    </Box>
                  ))}
                </Box>

              </Box>

              {/* Divider Line */}
              {index !== resources.length - 1 && (
                <Box
                  margin={{ top: "medium" }}
                  border={{ side: "bottom", color: "#D6CFC4", size: "xsmall" }}
                />
              )}

            </Box>
          ))}

        </Box>
      </Box>

      {/* Bottom Decorative Border */}
      <Box
        height="40px"
        style={{
          backgroundImage: `url(${sideBorder})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          transform: "rotate(180deg)",
        }}
      />

    </Box>
  );
};

export default ResourcesSection;
