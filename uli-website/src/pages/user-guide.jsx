import React from "react";
import { Box, Text, Heading } from "grommet";
import { CTAHeadlineOne, SectionLableOne } from "../components/atoms/UliCore";
import AppShell from "../components/molecules/AppShell";

const UserGuide = () => {
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Box alignSelf="center" gap={"small"} direction={"row-responsive"}>
            <Text style={{ fontSize: "2em" }}>Installing</Text>
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
              <Text>Visit Chrome Store</Text>
            </Box>
            <Box direction={"column"} align="center">
              <SectionLableOne>2</SectionLableOne>
              <Text>Install Extension</Text>
            </Box>
            <Box direction={"column"} align="center">
              <SectionLableOne>3</SectionLableOne>
              <Text>Pin the Icon</Text>
            </Box>
          </Box>

          <Box height={"4em"}></Box>
          <Box alignSelf="center" gap={"small"} direction={"row-responsive"}>
            <Text style={{ fontSize: "2em" }}>Configuring Uli</Text>
          </Box>
          <Box direction="row-responsive" gap={"medium"}>
            <Box width={"4em"}>
              <img src={"/Slur Replacement Icon.png"}></img>
            </Box>
            <Box>
              <Text weight={700}>Store Tweet Locally</Text>
              <Text>
                If you only want to store your images locally, select this. This
                will ensure that your screenshots don't leave your device
              </Text>
              <Text weight={700}>Language</Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>

              <Text weight={700}>Your Email</Text>
              <Text>
                Ut consectetur molestie mauris vitae sagittis. Suspendisse
                scelerisque velit sit amet ornare commodo.
              </Text>

              <Text weight={700}>Friends</Text>
              <Text>
                n laoreet est ac ligula luctus, eu mattis sem efficitur.
              </Text>

              <Text weight={700}>Your Slur List</Text>
              <Text>
                Donec quis diam ipsum. Nam venenatis mi eleifend, convallis
                tellus eget, tempus quam.
              </Text>
            </Box>
          </Box>
          {/* add picture of preference screen with labels */}

          <Box height={"4em"}></Box>
          <Box alignSelf="center" gap={"small"} direction={"row-responsive"}>
            <Text style={{ fontSize: "2em" }}>FAQ</Text>
          </Box>
          <Box gap={"medium"}>
            <Text size={"large"}>Who can use this tool?</Text>
            <Text>
              After the first phase of development, we hope that the tool can be
              used by persons of marginalized gender who have an active,
              assertive presence on Twitter and are targeted for their opinions.
              We will introduce more features along the way and the tool should
              be useful for a number of people out there who face online abuse.
              You can see a list of potential features
              [https://tinyurl.com/2p9bnefk] or suggest some more features here:
            </Text>

            <Text size={"large"}> Will I have to pay to use the tool?</Text>
            <Text>
              No, the tool will be free to use and free to modify without any
              prior permission.
            </Text>

            <Text size={"large"}>
              Will the moderation happen at the platform level or the
              user-level?
            </Text>
            <Text>
              The moderation will only happen at the user level. The idea is to
              arrive at user-facing, bottom-up approaches as opposed to top-down
              platform level approaches.
            </Text>

            <Text size={"large"}>
              How did you arrive at the Non-ML features on the tool? ``
            </Text>
            <Text>
              The feature list developed after our conversations with activists,
              journalists, members of community based organization and
              individuals who have been at the receiving end of violence. A list
              of other festures suggested during our conversion can be accessed
              here: https://tinyurl.com/2p9bnefk
            </Text>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
};

export default UserGuide;
