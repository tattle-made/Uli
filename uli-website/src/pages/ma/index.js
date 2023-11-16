import * as React from "react"
import { useContext } from "react"
import { Anchor, Box, ResponsiveContext, Text } from "grommet"
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
} from "../../components/atoms/UliCore"
import AppShell from "../../components/molecules/AppShell"
import { useTranslation } from "react-i18next"
import { Link } from "gatsby"

const IndexPage = () => {
  const size = useContext(ResponsiveContext)
  const { t, i18n } = useTranslation()
  console.log(t)
  const [userBrowser, setUserBrowser] = React.useState("chrome")

  React.useEffect(() => {
    console.log("mal", t)
    const agent = navigator.userAgent
    if (agent.indexOf("Firefox") != -1) {
      setUserBrowser("firefox")
    }
  }, [])

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"}>
          <Box width={"18em"} alignSelf={"center"}>
            <LandingSectionHeading>
              {t("section_hero_head", { lng: "ma" })}
            </LandingSectionHeading>
            <p>{t("section_hero_subhead", { lng: "ma" })}</p>
            <Box width={"fit-content"} align="center">
              <CTALinkPlainPrimary>
                {userBrowser === "firefox" ? (
                  <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/uli/"
                    target={"_blank"}
                  >
                    {t("section_hero_cta", { lng: "ma" })}
                  </a>
                ) : (
                  <a
                    href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
                    target={"_blank"}
                  >
                    {t("section_hero_cta", { lng: "ma" })}
                  </a>
                )}
              </CTALinkPlainPrimary>
              <Text>{t("section_hero_cta_subhead", { lng: "ma" })}</Text>
              <Box height={"0.6em"}></Box>
              <Text size={"medium"}>
                നിങ്ങൾ ഉളി വിഭവങ്ങളിൽ താൽപ്പര്യമുള്ള ഒരു ട്രസ്റ്റ് ആൻഡ് സേഫ്റ്റി
                ടീമാണെങ്കിൽ ദയവായി{" "}
                <Anchor href={"https://uli.tattle.co.in/uli-for-ts/"}>
                  ഇവിടെ ക്ലിക്ക് ചെയ്യുക
                </Anchor>
              </Text>
            </Box>
          </Box>
          <Box width={"26em"}>
            <img src={"/HeroIllustration.gif"}></img>
          </Box>
        </Box>
      </Box>

      <Box align="center">
        <h1>{t("section_feature_head", { lng: "ma" })}</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Archive Tweet Icon.png"}></img>
            </Box>
            <FeatureLabel>
              {t("section_feature_1_label", { lng: "ma" })}
            </FeatureLabel>
            <FeatureHeadline>
              {t("section_feature_1_head", { lng: "ma" })}
            </FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_1_description", { lng: "ma" })}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_1_follow_up", { lng: "ma" })}
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
            <FeatureLabel>
              {t("section_feature_2_label", { lng: "ma" })}
            </FeatureLabel>
            <FeatureHeadline>
              {t("section_feature_2_head", { lng: "ma" })}
            </FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_2_description", { lng: "ma" })}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_2_follow_up", { lng: "ma" })}
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
            <FeatureLabel>ഒജിബിവി കണ്ടെത്തൽ</FeatureLabel>
            <FeatureHeadline>
              മെഷീൻ ലേണിംഗ്, മുമ്പ് ടാഗ് ചെയ്ത ഒജിബിവി പോസ്റ്റുകളിൽ നിന്നും
              ഡ്രോയിംഗ് പാറ്റേൺ തിരിച്ചറിയൽ ഫീച്ചർ ഉപയോഗിച്ച് ഒരു ഉപയോക്താവിന്റെ
              ഫീഡിൽ നിന്ന് പ്രശ്നമുള്ള പോസ്റ്റുകൾ കണ്ടെത്തുന്നതിനും
              മറയ്ക്കുന്നതിനും ഉപയോഗിക്കുന്നു.
            </FeatureHeadline>
            <FeatureDescription>
              ഈ രണ്ട് ഫീച്ചറുകളുടെയും പണി പുരോഗമിക്കുകയാണ്.
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
              <FeatureLabel>
                {t("section_feature_3_label", { lng: "ma" })}
              </FeatureLabel>
            </Box>
            <FeatureHeadline>
              {t("section_feature_3_head", { lng: "ma" })}
            </FeatureHeadline>
            <FeatureDescription>
              {t("section_feature_3_description", { lng: "ma" })}
            </FeatureDescription>
            <FeatureFollowUp>
              {t("section_feature_3_follow_up", { lng: "ma" })}
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
              <SectionLableOne>
                {t("section_resources_label", { lng: "ma" })}
              </SectionLableOne>
              <Link to="/resources">നിലവിലെ വിഭവങ്ങൾ</Link>
            </Box>

            <SectionCenteredBody>
              {t("section_resources_description", { lng: "ma" })}
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
            <CTALinkPlain href="/user-guide">
              {t("section_cta_secondary")}
            </CTALinkPlain>
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
  )
}

export default IndexPage
