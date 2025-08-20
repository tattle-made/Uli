import React from "react";
import AppShell from "./AppShell";
import { Box, Text } from "grommet";
import { MDXProvider } from "@mdx-js/react";
import styled from "styled-components";
import CustomCodeBlock from "./codeSnippet";

const HeadingOne = styled(Text)`
  font-size: 2em;
  line-height: 1em;
`;

const HeadingTwo = styled(Text)`
  font-size: 1.6em;
`;

const HeadingThree = styled(Text)`
  font-size: 1.2em;
`;

const ContentPageShell = ({ children }) => {
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <MDXProvider
          components={{
            // Map HTML element tag to React component
            h1: HeadingOne,
            h2: HeadingTwo,
            h3: HeadingThree,
            code: (props) => <CustomCodeBlock {...props} />,
          }}
        >

          <Box width={"large"}>{children}</Box>
        </MDXProvider>
      </Box>
    </AppShell>
  );
};

export default ContentPageShell;
