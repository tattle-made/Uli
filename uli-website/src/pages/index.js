import * as React from "react";
import { useContext } from "react";
import { Box, ResponsiveContext, Text } from "grommet";
import {
  Colors,
  Theme,
  FeatureLabel,
  FeatureHeadline,
  FeatureDescription,
  FeatureFollowUp,
  LandingSectionHeading,
  CTALink,
  CTAHeadlineOne,
  CTALinkPlain,
  BorderBox,
  SectionCenteredBody,
  SectionLableOne,
  CTALinkPlainPrimary,
  TestShape,
} from "../components/atoms/UliCore";
import AppShell from "../components/molecules/AppShell";

const IndexPage = () => {
  const size = useContext(ResponsiveContext);
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"}>
          <Box width={"18em"} alignSelf={"center"}>
            <LandingSectionHeading>
              Moderate Your Twitter Feed
            </LandingSectionHeading>
            <p>
              Uli lets you take control over your Twitter timeline by redacting
              slurs, allowing you to archive problematic tweets and coordinating
              actions with your friends.
            </p>
            <Box width={"fit-content"} align="center">
              <CTALinkPlainPrimary>
                <a
                  href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
                  target={"_blank"}
                >
                  Add to Browser
                </a>
              </CTALinkPlainPrimary>
              <Text size={"small"}>supported on Chrome and Brave</Text>
            </Box>
          </Box>
          <Box width={"26em"}>
            <img src={"/HeroIllustration.gif"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center">
        <h1>Features</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Archive Tweet Icon.png"}></img>
            </Box>
            <FeatureLabel>ARCHIVE TWEETS</FeatureLabel>
            <FeatureHeadline>
              Archive tweets as evidence, to build a discourse or mobilise.
            </FeatureHeadline>
            <FeatureDescription>
              Uli provides an easy mechanism to take screenshots of offending
              tweets. These tweets can be stored locally or sent as an email to
              yourself.
            </FeatureDescription>
            <FeatureFollowUp>
              This crowdsourced list of offensive phrases is dynamic and each
              user can gather around with Uli and help build a longer list.
            </FeatureFollowUp>
          </Box>
          <Box width={"28em"}>
            <img src={"/ArchiveTweet.gif"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center" margin={"large"}>
        <Box
          width={"fit-content"}
          direction={size === "small" ? "row-reverse" : "row-responsive"}
          gap={"xlarge"}
        >
          <Box width={"28em"}>
            <img src={"/SlurReplacement-HideAndSeekTweet.gif"}></img>
          </Box>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Slur Replacement Icon.png"}></img>
            </Box>
            <FeatureLabel>{"SLUR REPLACEMENT"}</FeatureLabel>
            <FeatureHeadline>
              Automatic blurring of slurs in Hindi, English and Tamil
            </FeatureHeadline>
            <FeatureDescription>
              Uli uses a crowdsourced list of slurs in Indian languages and
              detects them in your tweet and hides them in real-time.
            </FeatureDescription>
            <FeatureFollowUp>
              This crowdsourced list of offensive phrases is dynamic and each
              user can gather around with Uli and help build a longer list.
            </FeatureFollowUp>
          </Box>
        </Box>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box>
              <Box width={"1.2em"}>
                <img src={"/Invoke Network Icon.png"}></img>
              </Box>
              <FeatureLabel>INVOKE NETWORK</FeatureLabel>
            </Box>
            <FeatureHeadline>You are not alone in this.</FeatureHeadline>
            <FeatureDescription>
              Involve your friends and community to act on problematic tweets
              and combat online hate speech.
            </FeatureDescription>
            <FeatureFollowUp>
              This feature will invite people to support each other, share
              stories, initiate conversations around intermediary responsibility
              and interpersonal relationships and what it means to be online.
            </FeatureFollowUp>
          </Box>
          <Box width={"28em"}>
            <img src={"/InvokeNetworks.gif"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center">
        <BorderBox width={"large"}>
          <Box width={"medium"} alignSelf={"center"}>
            <Box align="center">
              <SectionLableOne>RESOURCES</SectionLableOne>
            </Box>

            <SectionCenteredBody>
              We will also add a few resources such as Twitter's community
              guidelines, a digital safety guidelines as well as a legal
              resource document that builds critical legal literacy to help
              tackle instances of hate speech and harassment. All these
              resources will be made available in Hindi, Tamil and English.
            </SectionCenteredBody>
          </Box>
        </BorderBox>
      </Box>
      <Box
        align="center"
        background={Colors.COLOR_BLACK}
        margin={{ top: "medium" }}
        pad={"large"}
      >
        <Box
          width={"large"}
          gap={"large"}
          direction={"row-responsive"}
          align="center"
        >
          <Box width={"16em"}>
            <img src={"/Uli_Logo_Light.png"}></img>
          </Box>
          <Box width={"medium"}>
            <CTAHeadlineOne>
              is now available on Chrome Store to try out.
            </CTAHeadlineOne>
          </Box>
        </Box>
        <Box
          width={"large"}
          gap={"large"}
          direction={"row-responsive"}
          align="center"
        >
          <Box width={"16em"}></Box>
          <Box direction={"row-responsive"} gap={"large"}>
            <CTALinkPlain
              target={"_blank"}
              href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
            >
              INSTALL NOW
            </CTALinkPlain>
            <CTALinkPlain href="/">LEARN HOW TO USE</CTALinkPlain>
          </Box>
        </Box>
      </Box>
      {/* <TestOne>Features</TestOne>
        <TestTwo>Features</TestTwo>
        <TestThree>Features</TestThree>
        <TestFour>Features</TestFour> */}
    </AppShell>
  );
};

export default IndexPage;
