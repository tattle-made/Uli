import React from "react";
import {
  ResponsiveContext,
  Box,
  Text,
  Sidebar,
  Tabs,
  Tab,
  Anchor,
} from "grommet";
import { PlainLink } from "./atoms/TattleLinks";

export const AppSideNavBar = () => {
  const size = React.useContext(ResponsiveContext);
  const options = [
    { label: "Annotations", route: "/annotations" },
    { label: "Users", route: "/users" },
    { label: "Posts", route: "/posts" },
  ];
  function onTabChanged(e) {
    console.log(e);
  }
  return size === "small" ? (
    <Box width={"100%"} responsive={true}>
      <Tabs alignControls={"start"} onActive={onTabChanged}>
        <Tab title="tab 1">
          <Box pad="medium">One</Box>
        </Tab>
        <Tab title="tab 2">
          <Box pad="medium">Two</Box>
        </Tab>
      </Tabs>
    </Box>
  ) : (
    <Box width={"small"} responsive={true}>
      <Sidebar>
        <PlainLink to={"/app/posts"}>
          <Text size={"large"} color={"accent-2"} weight={"600"}>
            Posts
          </Text>
        </PlainLink>
        <PlainLink to={"/app/preferences"}>
          <Text size={"large"} color={"accent-2"} weight={"600"}>
            Users
          </Text>
        </PlainLink>
        <Text size={"large"}>Users</Text>
        <Text size={"large"}>Posts</Text>
        <Text size={"large"}>{size}</Text>
      </Sidebar>
    </Box>
  );
};
