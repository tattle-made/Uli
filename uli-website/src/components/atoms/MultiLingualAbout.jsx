import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Heading, Paragraph, Text } from "grommet";

export default function MultiLingualAbout() {
  const { t } = useTranslation();
  return (
    <Box>
      <Text style={{ fontSize: "1.6em" }}>{t("about_head_1")}</Text>
      <Paragraph fill>{t("about_para_1")}</Paragraph>
      <Paragraph fill>{t("about_para_2")}</Paragraph>
      <Paragraph fill>{t("about_para_3")}</Paragraph>
    </Box>
  );
}
