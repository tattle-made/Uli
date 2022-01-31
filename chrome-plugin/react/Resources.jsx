import { Box, Text, Anchor, Button } from "grommet";
import { useTranslation } from "react-i18next";

export function Resources() {
  const { t, i18n } = useTranslation();
  return (
    <Box width={"medium"}>
      <p>{t("app_name")}</p>
      <Anchor href="#" label="User Guide" />
      <Anchor href="#" label="Mental Health Resource" />
      <Anchor href="#" label="Legal Resources" />
      <Anchor href="#" label="Report Tweet Guide" />
      <Button
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
      />
    </Box>
  );
}
