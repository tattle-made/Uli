import * as React from "react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Grommet, Box, ResponsiveContext } from "grommet";
import styled from "styled-components";

// one image in each corner
// const BorderBox = styled.div`
//   padding: 2em;
//   border: 36px solid;
//   border-image: url("https://cdn.iconscout.com/icon/free/png-256/flower-1958565-1651708.png");
// `;

const BorderBox = styled.div`
  padding: 2em;
  border: 40px solid;
  border-image-source: url("https://tattle-media.s3.amazonaws.com/boder.png");
  border-image-slice: 33%;
  border-image-repeat: round;
`;

const TestOne = styled.h1`
  font-family: "MixStitch";
  font-weight: 500;
  font-style: normal;
`;
const TestTwo = styled.h1`
  font-family: "XStitch";
  font-weight: 500;
  font-style: normal;
`;
const TestThree = styled.h1`
  font-family: "Eenvoudige Batik";
  font-weight: 300;
  font-style: normal;
`;
const TestFour = styled.h1`
  font-family: millisime, sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 80px;
`;

const COLOR_CREAM = "#fdf6ed";
const COLOR_BLACK = "#212121";
const COLOR_ORANGE = "#de8821";

const THEME = {
  text: {
    xsmall: {
      size: "24px",
      height: "32px",
    },
  },
};

const FeatureLabel = styled.p`
  font-family: millisime, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 0.7em;
  color: ${COLOR_ORANGE};
  margin-bottom: 0px;
`;

const FeatureHeadline = styled.h2`
  font-family: millisime, sans-serif;
  font-weight: 400;
  font-size: 1.2em;
  line-height: 1.2em;
  color: ${COLOR_BLACK};
  margin-bottom: 0px;
  margin-top: 0px;
`;

const FeatureDescription = styled.p`
  font-family: millisime, sans-serif;
  font-size: 0.8em;
  line-height: 1.2em;
  color: ${COLOR_BLACK};
  margin-bottom: 0px;
  margin-top: 0px;
`;

const FeatureFollowUp = styled.p`
  font-family: millisime, sans-serif;
  font-size: 0.7em;
  line-height: 1.2em;
  color: ${COLOR_ORANGE};
  margin-bottom: 0px;
  margin-top: 0px;
`;

const LandingSectionHeading = styled.h1`
  font-family: millisime, sans-serif;
  font-size: 2em;
  line-height: 1em;
  font-style: normal;
  font-weight: 200;
`;

const CTALink = styled.a`
  background-color: red;
  padding: 1em 3em 1em 3em;
  width: 100px;
  &:before {
    content: "";
    width: 100px;
    height: 0;
    position: relative;
    top: 0;
    left: 0;
    border-bottom: 29px solid green;
    border-left: 29px solid aqua;
    border-right: 29px solid aqua;
  }
  &:after {
    content: "";
    width: 100px;
    height: 0;
    position: relative;
    bottom: 0;
    left: 0;
    border-top: 29px solid red;
    border-left: 29px solid #eee;
    border-right: 29px solid #eee;
  }
`;

const IndexPage = () => {
  const size = useContext(ResponsiveContext);
  return (
    <Grommet theme={THEME}>
      <main>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Uli</title>
          <link rel="stylesheet" href="layout.css" />
          <link rel="stylesheet" href="https://use.typekit.net/twt1ywc.css" />
        </Helmet>

        <Box align="center">
          <Box width={"large"} direction={"row-responsive"} align={"center"}>
            <Box width={"4em"}>
              <img src={"/Uli_Logo.png"} alt={"Uli Logo"} />
            </Box>
            <Box flex={"grow"} />
            <Box direction="row" gap={"medium"}>
              <p>About</p>
              <p>User Guide</p>
              <p>Team</p>
            </Box>
          </Box>
        </Box>

        <Box align="center" margin={"large"}>
          <Box width={"fit-content"} direction={"row-responsive"}>
            <Box width={"18em"} alignSelf={"center"}>
              <LandingSectionHeading>
                Moderate Your Twitter Feed
              </LandingSectionHeading>
              <p>
                Uli lets you take control over your Twitter timeline by
                redacting slurs, allowing you to archive problematic tweets and
                coordinating actions with your friends.
              </p>
              <a href={"/"}>Install Now</a>
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
          <Box
            width={"fit-content"}
            direction={"row-responsive"}
            gap={"xlarge"}
          >
            <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
              <FeatureLabel>ARCHIVE TWEETS</FeatureLabel>
              <FeatureHeadline>
                Archive tweets as evidence, to build a discourse or mobilise.
              </FeatureHeadline>
              <FeatureDescription>
                Uli provides an easy mechanism to take screenshots of offending
                tweets. These tweets can be stored locally or sent as an email
                to yourself.
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
              <FeatureLabel>{"SLUR REPLACEMENT" + size}</FeatureLabel>
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
          <Box
            width={"fit-content"}
            direction={"row-responsive"}
            gap={"xlarge"}
          >
            <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
              <FeatureLabel>INVOKE NETWORK</FeatureLabel>
              <FeatureHeadline>You are not alone in this.</FeatureHeadline>
              <FeatureDescription>
                Involve your friends and community to act on problematic tweets
                and combat online hate speech.
              </FeatureDescription>
              <FeatureFollowUp>
                This feature will invite people to support each other, share
                stories, initiate conversations around intermediary
                responsibility and interpersonal relationships and what it means
                to be online.
              </FeatureFollowUp>
            </Box>
            <Box width={"28em"}>
              <img src={"/InvokeNetworks.gif"}></img>
            </Box>
          </Box>
        </Box>

        <h1>Uli</h1>
        <BorderBox>
          <h1>Resources</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut
            volutpat quam, venenatis posuere metus. Nunc fringilla justo
            pulvinar, ultricies lorem vitae, consequat orci.{" "}
          </p>
        </BorderBox>
        <TestOne>Features</TestOne>
        <TestTwo>Features</TestTwo>
        <TestThree>Features</TestThree>
        <TestFour>Features</TestFour>
      </main>
    </Grommet>
  );
};

export default IndexPage;
