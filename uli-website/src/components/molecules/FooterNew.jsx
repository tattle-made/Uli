import React from "react";
import { Box, Text } from "grommet";

const FooterNew = () => {
  return (
    <Box
      as="footer"
      background="#2b2b2b"
      pad={{ vertical: "xlarge", horizontal: "large" }}
      gap="large"
    >
      {/* Stay Updated Section */}
      <Box align="center" gap="medium">
        <Text
          size="48px"
          weight="bold"
          style={{
            color: "#ffffff"
          }}
        >
          Stay Updated
        </Text>

        <Text
          size="medium"
          textAlign="center"
          style={{ maxWidth: "600px", color: "#eaeaea" }}
        >
          Short Statement about what Uli is <br />
          Use Uli to redact slurs and abusive content, archive problematic
          content, and collectively push back against online gender based
          violence.
        </Text>

        {/* Email Input */}
        <Box
          direction="row"
          align="center"
          width="medium"
          pad="small"
          background="#f6efe6"
          round="xsmall"
          justify="between"
        >
          <Text size="large">✉️</Text>

          <Text size="small" color="#666">
            your email address
          </Text>

          <Box
            pad={{ horizontal: "medium", vertical: "xsmall" }}
            background="#000"
            round="xsmall"
          >
            <Text size="small" color="white">
              subscribe
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box
        direction="row"
        justify="between"
        align="center"
        margin={{ top: "large" }}
      >
        <Box>
          <Text weight="bold" color="white">
            Uli by Tattle
          </Text>
          <Text size="small" color="#cccccc">
            Email & Other contacts
          </Text>
        </Box>

        <Box direction="row" gap="medium">
          <Text size="small" color="white">
            Link 1
          </Text>
          <Text size="small" color="white">
            Link 2
          </Text>
          <Text size="small" color="white">
            Link 3
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterNew;
