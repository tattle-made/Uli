import { Box, Text, Tag, Image, Button } from "grommet";
import { Refresh } from "grommet-icons";
import { useEffect, useState, useContext } from "react";
import { UserContext, NotificationContext } from "../atoms/AppContext";
import Api from "./Api";
import { t } from "i18next";

const { getArchive } = Api;

function ArchiveItem({ key, url, tags }) {
  return (
    <Box
      round={"xsmall"}
      key={key}
      border
      width={"medium"}
      align="start"
      pad={"small"}
      overflow={"hidden"}
    >
      <Box height="small" width="small">
        <Image fit="contain" src={url} />
      </Box>
      {/* <Text>{JSON.stringify({ url, tags, key })}</Text> */}
      <Box
        direction="row-responsive"
        gap={"small"}
        margin={{ top: "small" }}
        width={"100%"}
      >
        {tags && tags.split(",").map((tag) => <Tag value={tag} />)}
      </Box>
    </Box>
  );
}

items = [
  {
    url: "https://v2.grommet.io/assets/Wilderpeople_Ricky.jpg",
    tags: "caste,gender",
  },
];

export function Archive() {
  const [archive, setArchive] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const { notification, showNotification } = useContext(NotificationContext);

  useEffect(async () => {
    const archive = await getArchive(user.accessToken);
    console.log(archive);
    setArchive(archive);
  }, [user]);

  return (
    <Box gap={"small"} align="start">
      {/* <Button
        icon={<Refresh />}
        label={"Refresh"}
        plain
        hoverIndicator={"light-2"}
        pad={"small"}
      /> */}
      {archive ? (
        <Box gap={"xsmall"}>
          {archive.map((item, ix) => (
            <ArchiveItem key={ix} {...item} url={item.screenshotUrl} />
          ))}
        </Box>
      ) : (
        <Text>{t("message_archive_empty")}</Text>
      )}
    </Box>
  );
}
