import React from "react";
import { Box, Text, Heading } from "grommet";
import {
  Colors,
  CTAHeadlineOne,
  SectionLableOne,
} from "../components/atoms/UliCore";
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

          <Box id={"conf"} height={"4em"}></Box>
          <Box
            alignSelf="center"
            gap={"small"}
            direction={"row-responsive"}
            margin={{ bottom: "large" }}
          >
            <Text style={{ fontSize: "2em" }}>Configuring Uli</Text>
          </Box>
          <Box direction="row-responsive" gap={"medium"}>
            <Box width={"large"}>
              <img src={"/configuration-screen.png"}></img>
            </Box>
            <Box gap={"medium"}>
              <Box>
                <Text id="conf-1" color={Colors.COLOR_ORANGE}>
                  1. Store Tweets on Computer
                </Text>
                <Text>
                  If you only want to store your images locally, select this.
                  This will ensure that your screenshots don't leave your device
                </Text>
              </Box>
              <Box>
                <Text id="conf-2" color={Colors.COLOR_ORANGE}>
                  2. Language
                </Text>
                <Text>
                  Set the primary language for Uli. We currently support
                  English, Hindi and Tamil.
                </Text>
              </Box>

              <Box>
                <Text id="conf-3" color={Colors.COLOR_ORANGE}>
                  3. Your Email Address
                </Text>
                <Text>
                  We use this email to send you a copy of any archived tweet.
                </Text>
              </Box>

              <Box>
                <Text id="conf-4" color={Colors.COLOR_ORANGE}>
                  4. Friends
                </Text>
                <Text>
                  When you use the "Invoke Network" feature, we use the email
                  ids mentioned here to contact your friends. You can specify
                  multiple email ids if you separate them by commas.
                </Text>
              </Box>

              <Box>
                <Text id="conf-5" color={Colors.COLOR_ORANGE}>
                  5. Your Slur List
                </Text>
                <Text>
                  You can add words that you find offensive and want to hide
                  from your timeline. You can specify multiple slurs if you
                  separate them by commas.
                </Text>
              </Box>
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

            <Box>
              <Text size={"xlarge"}>
                How will you continue to maintain this tool?
              </Text>

              <Text>
                This pilot project is supported by a grant from Omidyar Network
                India. Given the experience of other similar projects, we
                understand that projects such as these should be sustainable in
                order to remain useful in the long run. With this in mind, we
                aim to design the tool in such a way that it can be managed
                affordably in the long run. If the pilot succeeds, we would
                focus on long-term fundraising to keep this project running.
              </Text>
            </Box>

            <Box>
              <Text size={"xlarge"}>
                What are your future plans with the archive feature?
              </Text>

              <Text>
                We hope to create an anonymised public repository.of hatespeech
                and harassment on social media targetting sexual and gender
                minorities. We hope that this data base will support future
                research on online violence and will also help activists,
                lawyers and researchers in their advicacy efforts and build
                discourse around online violence.
              </Text>
            </Box>

            <Box>
              <Text size={"xlarge"}>Why do you need my email address?</Text>

              <Text>
                We need your email address in order to send your archived tweets
                to your email address. Your email is not used to correspond with
                you regarding any Tattle or CIS events, promotions etc. It is
                not shared with any third party as well.
              </Text>
            </Box>

            <Box>
              <Text size={"xlarge"}>What is this slur list? </Text>

              <Text>
                We crowdsourced a list of offensive words and phrases that
                areused online. We used this list to scrape some of the content
                off Twitter and build an inclusive dataset to train the machine
                learning model. A smaller version of this list, containing slurs
                that are commonly used was coded into the plugin to help with
                the slur replacement feature.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
};

export default UserGuide;
