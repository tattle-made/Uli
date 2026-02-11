import React from "react";
import { Box, Text } from "grommet";
import sideBorder from "../../images/left-border.svg";


const updates = [
  { date: "03 Nov 2023", title: "Make It Real - Mapping AI-Facilitated" },
  { date: "03 Nov 2023", title: "Make It Real - Mapping AI-Facilitated" },
  { date: "03 Nov 2023", title: "Make It Real - Mapping AI-Facilitated" },
  { date: "03 Nov 2023", title: "Make It Real - Mapping AI-Facilitated" },
];

const UpdatesSection = () => {
  return (
    <Box background="#FFF6E9">
      {/* Top Border */}
      <Box
        height="40px"
        style={{
          backgroundImage: `url(${sideBorder})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Content */}
      <Box pad="large" align="center">

        <Box width="medium">
          {updates.map((item, index) => (
            <Box
              key={index}
              direction="row"
              justify="between"
              pad={{ vertical: "small" }}
              style={{
                borderBottom:
                  index !== updates.length - 1
                    ? "1px dashed #999"
                    : "none",
              }}
            >
              <Text size="small" color="dark-4">
                {item.date}
              </Text>

              <Text size="small" weight="bold">
                {item.title}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bottom Border */}
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

export default UpdatesSection;
