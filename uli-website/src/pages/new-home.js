import * as React from "react";
import AppShellNew from "../components/molecules/AppShellNew";
import Announcements from "../components/molecules/Announcements";
import { Box, Text } from "grommet";
import Projects from "../components/molecules/Projects";
import RecentBlogs from "../components/molecules/RecentBlogs";
import Resources from "../components/molecules/Resources";
import EmailSubscription from "../components/molecules/EmailSubscription";
import { NavLinkNew } from "../components/atoms/NavLinkNew";

const NewHome = () => {
  return (
    <AppShellNew>
      <Box align="center" margin={{ horizontal: "large", vertical: "small" }}>
        <Announcements />
        <Box className="flex flex-col items-center pb-12 gap-14 mt-8">
          <Text
            className="
            text-center
            text-6xl
            lg:text-9xl
            xl:text-[9rem] xl:leading-[85%] xl:tracking-[-5]
            animate-[fadeUp_0.8s_ease-out_forwards]
            "
          >
            Reclaim your <br className="" /> online space
          </Text>

          <Text className="lg:w-[30%] text-center mt-2 lg:mt-8">
            Short Statement about what Uli isUse Uli to redact slurs and abusive
            content, archive problematic content, and collectively push back
            against online gender based violence.
          </Text>

          <Box className="flex flex-row gap-8 font-bold">
            
            <NavLinkNew to="#">Our Process</NavLinkNew>
            <NavLinkNew to="/about">About Us</NavLinkNew>
          </Box>
        </Box>
      </Box>
      <Projects />
      <RecentBlogs />
      <Resources />
      <EmailSubscription />
    </AppShellNew>
  );
};

export default NewHome;
