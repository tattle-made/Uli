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

          <Box height={"4em"}></Box>
          <Box alignSelf="center" gap={"small"} direction={"row-responsive"}>
            <Text style={{ fontSize: "2em" }}>{t("ug_faq_head")}</Text>
          </Box>
          <Box gap={"medium"}>
            <Text size={"large"} weight={"700"}>
              {t("faq_1_head")}
            </Text>
            <Text size={"large"} weight={"700"}>
              {t("faq_1_desc")}
            </Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_2_head")}
            </Text>
            <Text size={"large"}>{t("faq_2_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_3_head")}
            </Text>
            <Text size={"large"}>{t("faq_3_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_4_head")}
            </Text>
            <Text size={"large"}>{t("faq_4_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_5_head")}
            </Text>
            <Text size={"large"}>{t("faq_5_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_6_head")}
            </Text>
            <Text size={"large"}>{t("faq_6_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_7_head")}
            </Text>
            <Text size={"large"}>{t("faq_7_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_8_head")}
            </Text>
            <Text size={"large"}>{t("faq_8_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_9_head")}
            </Text>
            <Text size={"large"}>{t("faq_9_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_10_head")}
            </Text>
            <Text size={"large"}>{t("faq_10_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_11_head")}
            </Text>
            <Text size={"large"}>{t("faq_11_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_12_head")}
            </Text>
            <Text size={"large"}>{t("faq_12_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_13_head")}
            </Text>
            <Text size={"large"}>{t("faq_13_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_14_head")}
            </Text>
            <Text size={"large"}>{t("faq_14_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_15_head")}
            </Text>
            <Text size={"large"}>{t("faq_15_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_16_head")}
            </Text>
            <Text size={"large"}>{t("faq_16_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_17_head")}
            </Text>
            <Text size={"large"}>{t("faq_17_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_18_head")}
            </Text>
            <Text size={"large"}>{t("faq_18_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_19_head")}
            </Text>
            <Text size={"large"}>{t("faq_19_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_20_head")}
            </Text>
            <Text size={"large"}>{t("faq_20_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_21_head")}
            </Text>
            <Text size={"large"}>{t("faq_21_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_22_head")}
            </Text>
            <Text size={"large"}>{t("faq_22_desc")}</Text>

            <Text size={"large"} weight={"700"}>
              {t("faq_23_head")}
            </Text>
            <Text size={"large"}>{t("faq_23_desc")}</Text>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
};

export default UserGuide;
