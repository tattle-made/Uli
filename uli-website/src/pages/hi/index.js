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
              अपने ट्विटर फ़ीड का नियंत्रण खुद करें
            </LandingSectionHeading>
            <p>
              उली के साथ आप अपनी ट्विटर टाइमलाइन का नियंत्रण खुद कर सकते हैं,
              समस्याग्रस्त ट्वीट्स को संग्रहित कर सकते हैं और अपने दोस्तों से
              मदद माँग सकते हैं।
            </p>
            <Box width={"fit-content"} align="center">
              <CTALinkPlainPrimary>
                {userBrowser === "firefox" ? (
                  <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/uli/"
                    target={"_blank"}
                  >
                    Add to Browser
                  </a>
                ) : (
                  <a
                    href="https://chrome.google.com/webstore/detail/uli/hbfmbflgailjeobfkhpdipcdmpclinki"
                    target={"_blank"}
                  >
                    Add to Browser
                  </a>
                )}
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
        <h1>उली की विशेषताएं</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box width={"1.2em"}>
              <img src={"/Archive Tweet Icon.png"}></img>
            </Box>
            <FeatureLabel>भद्दे ट्वीट संग्रहित करें:</FeatureLabel>
            <FeatureHeadline>
              सबूत एकत्रित करने के लिए या दुसरो के साथ साझा करके नफरत और हिंसा
              फ़ैलाने वाले पोस्ट्स के खिलाफ बातचीत शुरू करने के लिए आप उली की मदद
              से पोस्ट संगृहीत कर सकते हैं।
            </FeatureHeadline>
            <FeatureDescription>
              उली आपत्तिजनक ट्वीट्स के स्क्रीनशॉट आसानी से ले सकता है । इन
              ट्वीट्स को स्थानीय रूप से संग्रहीत किया जा सकता है या आप खुद को
              ईमेल के रूप में भेज सकतें हैं।
            </FeatureDescription>
            <FeatureFollowUp>
            यह क्राउडसोर्स्ड आपत्तिजनक वाक्यांशों की सूची गतिशील है 
            और हर उपयोगकर्ता उली के साथ जुड़कर इसे और लंबा
            बनाने में मदद कर सकता है।
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
            <FeatureLabel>भद्दे शब्दों या वाक्यांशों को छिपाना</FeatureLabel>
            <FeatureHeadline>
              उली भद्दे शब्दों की एक सूची के उपयोग से आपकी ट्विटर टाइमलाइन से उन
              शब्दों को वास्तविक समय में छिपा सकता है । यह फीचर आपके डायरेक्ट
              मैसेज पर भी काम करता है।{" "}
            </FeatureHeadline>
            <FeatureDescription>
              आपत्तिजनक वाक्यांशों की यह सूची और भी बड़ी हो सकती है और प्रत्येक
              यूज़र उली के साथ मिलकर एक लंबी सूची बुनने में मदद कर सकतें है। सूचि
              में और शब्द जोड़ने के लिए या इस सूचि के बारे में और जानकारी के लिए
              यहाँ क्लिक करें।
            </FeatureDescription>
            <FeatureFollowUp></FeatureFollowUp>
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
            <FeatureLabel>ऑनलाइन लिंग-आधारित हिंसा की पहचान करना</FeatureLabel>
            <FeatureHeadline>
            यह मशीन लर्निंग फ़ीचर, पहले से टैग की गईं ऑनलाइन लिंग-आधारित
            हिंसा (OGBV) वाली पोस्टों के आधार पर पैटर्न रिकग्निशन (पैटर्न पहचान)
            का उपयोग करके, उपयोगकर्ता की फ़ीड से
            समस्याग्रस्त पोस्ट का पता लगाता है और उन्हें छिपा देता है।
            </FeatureHeadline>
            <FeatureDescription>
            इन दोनों फ़ीचर्स पर अभी काम चल रहा है।
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
        <h1>जल्द आ रहा है</h1>
      </Box>

      <Box align="center" margin={"large"}>
        <Box width={"fit-content"} direction={"row-responsive"} gap={"xlarge"}>
          <Box width={"small"} gap={"xsmall"} alignSelf={"center"}>
            <Box>
              <Box width={"1.2em"}>
                <img src={"/Invoke Network Icon.png"}></img>
              </Box>
              <FeatureLabel>अपने साथियों को एलर्ट करें</FeatureLabel>
            </Box>
            <FeatureHeadline>इसमें आप अकेले नहीं हैं</FeatureHeadline>
            <FeatureDescription>
              समस्याग्रस्त ट्वीट्स पर कार्रवाई करने और ऑनलाइन अभद्र भाषा का
              मुकाबला करने के लिए अपने मित्रों और समुदाय को शामिल करें।
            </FeatureDescription>
            <FeatureFollowUp>
              हमारी उम्मीद है की यह फीचर लोगों को इकट्ठा होने, एक-दूसरे का
              समर्थन करने, सोशल मीडिया कंपनियों और पारस्परिक संबंधों की
              जिम्मेदारी, और ऑनलाइन हमारे अनुभवों के बारे में बातचीत शुरू करने
              में मदद कर सकेगा।
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
              <SectionLableOne>संसाधन</SectionLableOne>
              <Link to="/resources">मौजूदा संसाधन</Link>
            </Box>

            <SectionCenteredBody>
              हमने कुछ संसाधन भी जोड़े हैं जैसे कि ट्विटर के सामुदायिक
              दिशानिर्देश, डिजिटल सुरक्षा दिशानिर्देश (डिजिटल सुरक्षा के लिए सेफ
              सिस्टर्स की सामान्य ज्ञान मार्गदर्शिका का एक अनुकूलन), साथ ही एक
              कानूनी संसाधन दस्तावेज़ । ये सभी संसाधन हिंदी, तमिल और अंग्रेजी
              में उपलब्ध हैं।
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
            <CTAHeadlineOne>उपलब्ध है।</CTAHeadlineOne>
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
              अभी इनस्टॉल करें
            </CTALinkPlain>
            <CTALinkPlain href="/user-guide">उपयोग करना सीखें</CTALinkPlain>
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
