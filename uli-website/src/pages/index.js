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
import { useTranslation } from "react-i18next";
import { Link } from "gatsby";

const IndexPage = () => {
  const size = useContext(ResponsiveContext);
  const { t, i18n } = useTranslation();
  const [userBrowser, setUserBrowser] = React.useState("chrome");

  React.useEffect(() => {
    const agent = navigator.userAgent;
    if (agent.indexOf("Firefox") != -1) {
      setUserBrowser("firefox");
    }
  }, []);

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"}>
          <Box width={"18em"} alignSelf={"center"}>
            <LandingSectionHeading>
              {t("section_hero_head")}
            </LandingSectionHeading>
            <p>{t("section_hero_subhead")}</p>
            <Box width={"fit-content"} align="center">
              <CTALinkPlainPrimary>
                {userBrowser === "firefox" ? (
                  <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/uli/"
                    target={"_blank"}
                  >
                    {t("section_hero_cta")}
                  </a>
                ) : (
                  <a
                    href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
                    target={"_blank"}
                  >
                    {t("section_hero_cta")}
                  </a>
                )}
              </CTALinkPlainPrimary>
              <Text size={"small"}>{t("section_hero_cta_subhead")}</Text>
            </Box>
          </Box>
          <Box width={"26em"}>
            <img src={"/HeroIllustration.gif"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center">
        <h1>{t("section_feature_head")}</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Archive Tweet Icon.png"}></img>
            </Box>
            <FeatureLabel>{t("section_feature_1_label")}</FeatureLabel>
            <FeatureHeadline>{t("section_feature_1_head")}</FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_1_description")}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_1_follow_up")}
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
            <FeatureLabel>{t("section_feature_2_label")}</FeatureLabel>
            <FeatureHeadline>{t("section_feature_2_head")}</FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_2_description")}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_2_follow_up")}
            </FeatureFollowUp>
          </Box>
        </Box>
      </Box>

      <Box align="center" margin={"large"}>
        <Box
          width={"fit-content"}
          direction={size === "small" ? "row-reverse" : "row-responsive"}
          gap={"xlarge"}
        >
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Slur Replacement Icon.png"}></img>
            </Box>
            <FeatureLabel>DETECTING OGBV</FeatureLabel>
            <FeatureHeadline>
              The machine learning feature uses pattern recognition drawing from
              previously tagged oGBV posts to detect and hide problematic posts
              from a user’s feed.
            </FeatureHeadline>
            <FeatureDescription>
              Both these features are work in progress.
            </FeatureDescription>
            {/* <FeatureFollowUp>
              {t("section_feature_2_follow_up")}
            </FeatureFollowUp> */}
          </Box>
          <Box width={"20em"}>
            <img src={"/MLFeature.png"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center">
        <h1>Coming Soon</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box>
              <Box width={"1.2em"}>
                <img src={"/Invoke Network Icon.png"}></img>
              </Box>
              <FeatureLabel>{t("section_feature_3_label")}</FeatureLabel>
            </Box>
            <FeatureHeadline>{t("section_feature_3_head")}</FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_3_description")}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_3_follow_up")}
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
              <SectionLableOne>{t("section_resources_label")}</SectionLableOne>
              <Link to="/resources">Current Resources</Link>
            </Box>

            <SectionCenteredBody>
              {t("section_resources_description")}
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
            <CTAHeadlineOne>{t("section_cta_head")}</CTAHeadlineOne>
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
              {t("section_cta_primary")}
            </CTALinkPlain>
            <CTALinkPlain href="/">{t("section_cta_secondary")}</CTALinkPlain>
          </Box>
          {/* <Box direction={'row-responsive'}>
            <Text></Text>
          </Box> */}
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
