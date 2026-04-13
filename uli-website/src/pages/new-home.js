import * as React from "react";
import AppShellNew from "../components/molecules/AppShellNew";
import Announcements from "../components/molecules/Announcements";
import { Box, Text } from "grommet";
import Projects from "../components/molecules/Projects";
import RecentBlogs from "../components/molecules/RecentBlogs";
import Resources from "../components/molecules/Resources";
import SupportUs from "../components/molecules/SupportUs";
// import Resources from "../components/molecules/Resources";
import { NavLinkNew } from "../components/atoms/NavLinkNew";
import MailchimpSubscribeForm from "../components/molecules/MailchimpSubscribeForm";
import { SectionBorderTop } from "../components/molecules/SectionBorders";

const NewHome = () => {
  return (
    <AppShellNew>
      <Box align="center" margin={{ horizontal: "large", vertical: "small" }}>
        <Announcements />
        <Box className="flex flex-col items-center pb-10 gap-10 mt-6 smooth-layout">
          <Text
            className="
            text-center
            text-[4rem] leading-[90%] font-semibold
            lg:text-[8rem] lg:leading-[90%] lg:font-medium
            animate-[fadeUp_0.8s_ease-out_forwards]
            smooth-layout
            "
          >
            Reclaim your <br className="" /> online space
          </Text>

          <Text className="lg:w-[40%] text-center mt-2 lg:mt-8 text-base lg:text-[16px] lg:leading-[120%] animate-[fadeUp_1s_ease-out_0.3s_both] smooth-layout">
            An endeavour to build safer online spaces in India by collectivizing women and gender minorities. Uli creates representative data and tools for detection of online abuse and connects to support in times of need.
          </Text>

          <Box className="flex flex-row gap-6 font-normal text-[15px] lg:text-[19px] leading-[120%] animate-[fadeUp_1s_ease-out_0.7s_both] smooth-layout">

            <NavLinkNew to="/process">Our Process</NavLinkNew>
            <NavLinkNew to="/about">About Us</NavLinkNew>
          </Box>
        </Box>
      </Box>
      <Projects />
      <RecentBlogs />
      {/* <Resources /> */}

      <SupportUs />

      <Box className="bg-inherit pt-32 pb-20 px-4 md:px-5 text-slate-900 flex flex-col items-center gap-12 smooth-layout">
        <MailchimpSubscribeForm />
      </Box>

    </AppShellNew>
  );
};

export default NewHome;
