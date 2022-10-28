import React from "react";
import { Box, Text, Heading } from "grommet";
import {
  Colors,
  CTAHeadlineOne,
  SectionLableOne,
} from "../components/atoms/UliCore";
import AppShell from "../components/molecules/AppShell";
import { useTranslation } from "react-i18next";

const UserGuide = () => {
  const { t } = useTranslation();
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Box alignSelf="center" gap={"small"} direction={"row-responsive"}>
            <Text style={{ fontSize: "2em" }}>{t("ug_install_heading")}</Text>
            <Box width={"4em"}>
              <img src={"/Uli_Logo.png"}></img>
            </Box>
          </Box>
          <Box height={"1.4em"}></Box>
          <Box
            direction={"row-responsive"}
            justify={"between"}
            pad={{ left: "large", right: "large" }}
          >
            <Box direction={"column"} align="center">
              <SectionLableOne>1</SectionLableOne>
              <Text>{t("ug_step_1")}</Text>
            </Box>
            <Box direction={"column"} align="center">
              <SectionLableOne>2</SectionLableOne>
              <Text>{t("ug_step_2")}</Text>
            </Box>
            <Box direction={"column"} align="center">
              <SectionLableOne>3</SectionLableOne>
              <Text>{t("ug_step_3")}</Text>
            </Box>
          </Box>

          <Box id={"conf"} height={"4em"}></Box>
          <Box
            alignSelf="center"
            gap={"small"}
            direction={"row-responsive"}
            margin={{ bottom: "large" }}
          >
            <Text style={{ fontSize: "2em" }}>{t("ug_configure_heading")}</Text>
          </Box>
          <Box direction="row-responsive" gap={"medium"}>
            <Box width={"large"}>
              <img src={"/configuration-screen.png"}></img>
            </Box>
            <Box gap={"medium"}>
              <Box>
                <Text id="conf-1" color={Colors.COLOR_ORANGE}>
                  {t("ug_configure_1_head")}
                </Text>
                <Text>{t("ug_configure_1_desc")}</Text>
              </Box>
              <Box>
                <Text id="conf-2" color={Colors.COLOR_ORANGE}>
                  {t("ug_configure_2_head")}
                </Text>
                <Text>{t("ug_configure_2_desc")}</Text>
              </Box>

              <Box>
                <Text id="conf-3" color={Colors.COLOR_ORANGE}>
                  {t("ug_configure_3_head")}
                </Text>
                <Text>{t("ug_configure_3_desc")}</Text>
              </Box>

              {/* <Box>
                <Text id="conf-4" color={Colors.COLOR_ORANGE}>
                  4. Friends
                </Text>
                <Text>
                  When you use the "Invoke Network" feature, we use the email
                  ids mentioned here to contact your friends. You can specify
                  multiple email ids if you separate them by commas.
                </Text>
              </Box> */}

              <Box>
                <Text id="conf-4" color={Colors.COLOR_ORANGE}>
                  {t("ug_configure_4_head")}
                </Text>
                <Text>{t("ug_configure_4_desc")}</Text>
              </Box>
              <Box>
                <Text id="conf-5" color={Colors.COLOR_ORANGE}>
                  {t("ug_configure_5_head")}
                </Text>
                <Text>{t("ug_configure_5_desc")}</Text>
              </Box>
            </Box>
          </Box>
          {/* add picture of preference screen with labels */}
          <Box
            alignSelf="center"
            gap={"small"}
            direction={"row-responsive"}
            margin={{ top: "xlarge", bottom: "large" }}
          >
            <Text style={{ fontSize: "2em" }}>Instruction Videos</Text>
          </Box>
          <Box>
            <Box>
              <Text style={{ fontSize: "1.4em" }} margin={{ bottom: "0.8em" }}>
                {" "}
                How to install
              </Text>
              <Box fill>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/mgkJritMbqM"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>

            <Box>
              <Text
                style={{ fontSize: "1.4em" }}
                margin={{ top: "0.8em", bottom: "0.8em" }}
              >
                {" "}
                How to Archive Tweets
              </Text>
              <Box fill>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/93b2nK90qMk"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>

            <Box>
              <Text
                style={{ fontSize: "1.4em" }}
                margin={{ top: "0.8em", bottom: "0.8em" }}
              >
                {" "}
                How to replace slurs
              </Text>
              <Box fill>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/2IBZzbQs6UU"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>

            <Box>
              <Text
                style={{ fontSize: "1.4em" }}
                margin={{ top: "0.8em", bottom: "0.8em" }}
              >
                {" "}
                How to hide tweets containing OGBV
              </Text>
              <Box fill>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/jxpVxj2iCv8"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>

            <Box>
              <Text
                style={{ fontSize: "1.4em" }}
                margin={{ top: "0.8em", bottom: "0.8em" }}
              >
                {" "}
                How to uninstall Uli
              </Text>
              <Box fill>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/LQPZ8YVsMoY"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
};

export default UserGuide;
