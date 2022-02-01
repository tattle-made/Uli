import { Box, Text, Anchor, Button } from "grommet";
import { useTranslation } from "react-i18next";

export function Resources() {
  const { t, i18n } = useTranslation();
  return (
    <Box width={"medium"}>
      <Anchor href="#" label={t("user_guide")} />
      <Anchor href="#" label={t("mental_health")} />
      <Anchor href="#" label={t("legal_resources")} />
      <Anchor href="#" label={t("report_tweet")} />
      {/* <Button
        label={"test"}
        onClick={() => {
          console.log("clicked");
          chrome.storage.local.set(
            { "ogbv-data": "Your data set from options page. 0.0.2" },
            function (result) {
              console.log(" Data saved ");
            }
          );
        }}
      /> */}
    </Box>
  );
}
