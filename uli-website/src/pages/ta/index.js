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
} from "../../components/atoms/UliCore";
import AppShell from "../../components/molecules/AppShell";
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
              உங்கள் ட்விட்டர் ஃபீடை மதிப்பாய்வு செய்யவும்
            </LandingSectionHeading>
            <p>
              அவமதிப்பான / தெளிவில்லாத பேச்சு/சொற்களை திருத்துவதன் மூலமும்,
              சிக்கலான ட்வீட்களைக் ஆர்க்கைவ் செய்வதன்மூலமும், உங்கள்
              நண்பர்களுடன் செயல்களை ஒருங்கிணைப்பதன் மூலமும், உளி உங்கள்
              ட்விட்டர் டைம்லைனை கட்டுப்படுத்த உதவுகிறது.
            </p>
            <Box width={"fit-content"} align="center">
              <CTALinkPlainPrimary>
                {userBrowser === "firefox" ? (
                  <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/uli/"
                    target={"_blank"}
                  >
                    ப்ரௌசரில் சேர்க்கவும்
                  </a>
                ) : (
                  <a
                    href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
                    target={"_blank"}
                  >
                    ப்ரௌசரில் சேர்க்கவும்
                  </a>
                )}
              </CTALinkPlainPrimary>
              <Text size={"small"}>
                Chrome மற்றும் Brave இல் ஆதரிக்கப்படுகிறது
              </Text>
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
            <FeatureLabel>ஆர்க்கைவ் டிவீட்ஸ்</FeatureLabel>
            <FeatureHeadline>
              ஒரு விவாதத்தை உருவாக்க அல்லது அணிதிரட்ட, ட்வீட்களை ஆதாரமாக
              ஆர்க்கைவ் செய்யவும்
            </FeatureHeadline>
            <FeatureDescription>
              புண்படுத்தும் ட்வீட்களின் ஸ்கிரீன்ஷாட்களை எடுக்க உளி எளிதான
              வழிமுறையை வழங்குகிறது. இந்த ட்வீட்களை உள்நாட்டில் சேமிக்கலாம்
              அல்லது உங்களுக்கே மின்னஞ்சலாக அனுப்பலாம்.
            </FeatureDescription>
            <FeatureFollowUp>
              எதிர்காலத்தில், பயனர்களால் ஆர்க்கைவ் செய்யப்பட்ட ட்வீட்களின்
              அடையாளமற்ற பொது களஞ்சியத்தை உருவாக்குவோம் என்று நம்புகிறோம்.
              இந்தக் காப்பகம் எங்கள் டிஜிட்டல் அறையாக இருக்கும், அங்கு நாங்கள்
              சமூக ஊடகங்களில் இருந்த அனுபவத்தைச் சேகரித்து விவரிக்கிறோம்.
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
            <FeatureLabel>அவமதிப்பான</FeatureLabel>
            <FeatureHeadline>
              ஹிந்தி, ஆங்கிலம்/இங்கிலீஷ் மற்றும் தமிழில் அவமதிப்பான
            </FeatureHeadline>
            <FeatureDescription>
              உளி , இந்திய மொழிகளில் குழு அமைப்பு செய்யப்பட்ட அவமதிப்பான /
              தெளிவில்லாத பேச்சு/சொற்களின் பட்டியலைப் பயன்படுத்துகிறது மற்றும்
              அவற்றை உங்கள் ட்வீட்டில் கண்டறிந்து அவற்றை ரியல் -டைம்
              அடிப்படையில் மறைக்கிறது.
            </FeatureDescription>
            <FeatureFollowUp>
              தெளிவில்லாத பேச்சு/சொற்களின் பட்டியல் மிகவும் பெரிது மற்றும்
              ஒவ்வொரு பயனரும் உளியுடன் ஒன்றுகூடி அந்த பட்டியலை இன்னும் பெரிதாக்க
              உதவலாம்.
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
              <FeatureLabel>நெட்வொர்க்கை அழைக்கவும்</FeatureLabel>
            </Box>
            <FeatureHeadline>இதில் நீங்கள் தனியாக இல்லை</FeatureHeadline>
            <FeatureDescription>
              பிரச்சனைக்குரிய ட்வீட்களில் செயல்பட உங்கள் நண்பர்களையும்
              சமூகத்தையும் ஈடுபடுத்துங்கள் மற்றும் ஆன்லைன் வெறுப்பூட்டும் பேச்சை
              எதிர்த்துப் போராடுங்கள்.
            </FeatureDescription>
            <FeatureFollowUp>
              இந்த அம்சம் மக்களை ஒருவரையொருவர் ஆதரிக்கவும், கதைகளைப் பகிரவும்,
              இடைத்தரகர் பொறுப்பு மற்றும் தனிப்பட்ட உறவுகளைப் பற்றிய
              உரையாடல்களைத் தொடங்கவும், ஆன்லைனில் இருப்பதன் அர்த்தம் என்ன என்பதை
              உணர்த்தும் வகையில் மக்களை அழைக்கும்.
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
              <SectionLableOne>வளங்கள்</SectionLableOne>
              <Link to="/resources">Current Resources</Link>
            </Box>

            <SectionCenteredBody>
              ட்விட்டரின் சமூக வழிகாட்டுதல்கள், டிஜிட்டல் பாதுகாப்பு
              வழிகாட்டுதல்கள் மற்றும் வெறுக்கத்தக்க பேச்சு மற்றும் துன்புறுத்தல்
              போன்ற நிகழ்வுகளைச் சமாளிக்க முக்கியமான சட்டக் கல்வியறிவை
              உருவாக்கும் சட்ட ஆதார ஆவணம் போன்ற சில ஆதாரங்களையும் நாங்கள்
              சேர்ப்போம். இந்த ஆதாரங்கள் அனைத்தும் இந்தி, தமிழ் மற்றும்
              ஆங்கிலத்தில் கிடைக்கும்.
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
            <CTAHeadlineOne>இப்போது க்ரோம் ஸ்டோரில் சரிபார்க்க</CTAHeadlineOne>
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
              இப்போது இன்ஸ்டால்
            </CTALinkPlain>
            <CTALinkPlain href="/user-guide">LEARN HOW TO USE</CTALinkPlain>
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
