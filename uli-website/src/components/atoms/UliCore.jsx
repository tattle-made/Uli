import styled from "styled-components";
import { Box } from "grommet";
import { Link } from "gatsby";

const COLOR_CREAM = "#fdf6ed";
const COLOR_BLACK = "#212121";
const COLOR_ORANGE = "#de8821";

export const Colors = {
  COLOR_BLACK,
  COLOR_CREAM,
  COLOR_ORANGE,
};

export const Theme = {
  text: {
    xsmall: {
      size: "24px",
      height: "32px",
    },
  },

    // global: {
    //   focus: {
    //     border: {
    //       color: "brand",
    //     },
    //   },
    // },
};

export const FeatureLabel = styled.p`
  font-family: millisime, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 0.7em;
  color: ${COLOR_ORANGE};
  margin-bottom: 0px;
`;

export const FeatureHeadline = styled.h2`
  font-family: millisime, sans-serif;
  font-weight: 200;
  font-size: 1.2em;
  line-height: 1.2em;
  color: ${COLOR_BLACK};
  margin-bottom: 0px;
  margin-top: 0px;
`;

export const FeatureDescription = styled.p`
  font-family: millisime, sans-serif;
  font-size: 0.8em;
  line-height: 1.2em;
  color: ${COLOR_BLACK};
  margin-bottom: 0px;
  margin-top: 0px;
`;

export const FeatureFollowUp = styled.p`
  font-family: millisime, sans-serif;
  font-size: 0.7em;
  line-height: 1.2em;
  color: ${COLOR_ORANGE};
  margin-bottom: 0px;
  margin-top: 0px;
`;

export const LandingSectionHeading = styled.h1`
  font-family: millisime, sans-serif;
  font-size: 2em;
  line-height: 1em;
  font-style: normal;
  font-weight: 200;
`;

export const CTAHeadlineOne = styled.h2`
  font-family: millisime, sans-serif;
  font-size: 2em;
  line-height: 1.4em;
  font-style: normal;
  font-weight: 200;
`;

export const CTALinkPlain = styled.a`
  font-family: "MixStitch";
  font-weight: 500;
  font-style: normal;
  color : ${Colors.COLOR_CREAM}
  text-decoration: none;
  &:hover{
    text-decoration: underline;
    color : ${Colors.COLOR_ORANGE};
    font-weight:700;
  };
  &:link  {
    color : ${Colors.COLOR_CREAM};
    text-decoration: none;
  };
  &:visited  {
    color : ${Colors.COLOR_CREAM};
    text-decoration: none;
  }  
`;

export const CTALinkPlainPrimary = styled.div`
  text-align: center;
  width: fit-content;
  height:'fit-content';
  border: 20px solid;
  border-image-source: url("https://uli-media.tattle.co.in/assets/cta-background.png");
  border-image-slice: 33%;
  border-image-repeat: round;
  font-family: "MixStitch";
  font-weight: 800;
  font-style: normal;
  color : ${Colors.COLOR_CREAM}
  text-decoration: none;
  font-size: 1.4em;
  a{
    color:${Colors.COLOR_BLACK};
  }
  a:hover{
    text-decoration: none;
    color : ${Colors.COLOR_ORANGE};

  };
  a:link  {
    color : ${Colors.COLOR_BLACK};
    text-decoration: none;
  };
  a:visited  {
    color : ${Colors.COLOR_BLACK};
    text-decoration: none;
  }
`;

export const CTALink = styled.a`
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

export const SectionLableOne = styled.h1`
  font-family: "Eenvoudige Batik";
  font-weight: 300;
  font-style: normal;
  font-size: 2.4em;
  color: ${Colors.COLOR_ORANGE};
`;

export const SectionCenteredBody = styled.p`
  font-family: millisime, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 1.2em;
  line-height: 1.4em;
  text-align: center;
`;

export const BorderBox = styled(Box)`
  padding: 2em;
  border: 6em solid ${Colors.COLOR_CREAM};
  border-image-source: url("/ResourceBorder.png");
  border-image-slice: 33%;
  border-image-repeat: round;
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${Colors.COLOR_BLACK};
  &:hover {
    color: ${Colors.COLOR_BLACK};
  }
  &:link {
    color: ${Colors.COLOR_BLACK};
  }
  &:visited {
    color: ${Colors.COLOR_BLACK};
  }
`;

export const TestShape = styled.div`
  width: fit-content;
  font-size: 1.4em;
  background: red;
  position: relative;

  &::before {
    content: ".";
    background: cyan;
  }
  &::after {
    content: ">";
    background: cyan;
    border-radius: 4em;
  }
`;
