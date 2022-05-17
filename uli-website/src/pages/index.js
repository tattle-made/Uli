import * as React from "react";
import { Helmet } from "react-helmet";
import { Grommet, Box } from "grommet";
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

const IndexPage = () => {
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
          <Box
            width={"fit-content"}
            direction={"row-responsive"}
            gap={"xlarge"}
          >
            <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
              <FeatureLabel>INVOKE NETWORK</FeatureLabel>
              <FeatureHeadline>
                Archive Tweets as evidence, to build a discource or mobilise.
              </FeatureHeadline>
              <FeatureDescription>
                Uli provides an easy mechanism to take screenshot of offending
                tweets. These tweets can be stored locally or sent as email to
                you.
              </FeatureDescription>
              <FeatureFollowUp>
                In future, we hope to build an anonymised public repository of
                tweets archived by users. This archive will be our digital
                courtyard where we cllect and narrate our experience of being on
                social media.
              </FeatureFollowUp>
            </Box>
            <Box width={"medium"}>
              <img src={"/ArchiveTweet.gif"}></img>
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
