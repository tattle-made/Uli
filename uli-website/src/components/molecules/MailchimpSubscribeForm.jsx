import React, { useState, useEffect } from "react"
import { Box, Heading, Text, Button, TextInput } from "grommet"
import MailchimpSubscribe from "react-mailchimp-subscribe"
import DashedButton from "../atoms/DashedButton"

const MAILCHIMP_URL =
  "https://tattle.us19.list-manage.com/subscribe/post?u=a9af83af1f247ecc04f50ad46&amp;id=f3e092d65e&amp;f_id=00e1bbe7f0"

/**
 * @author
 * @function MailchimpSubscribeForm
 **/

/**
 * Renders a custom email subscription form using Mailchimp.
 * Handles user input, form submission, and displays status messages.
 *
 * @returns {JSX.Element} Mailchimp subscribe form component.
 */


const SimpleForm = () => <MailchimpSubscribe url={MAILCHIMP_URL} />

const MailchimpSubscribeForm = () => {
  const [email, setEmail] = useState("")
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    setFetching(true)
  }, [])

  return (
    <Box direction={"column"}>
      <MailchimpSubscribe
        url={MAILCHIMP_URL}
        render={({ subscribe, status, message }) => {
          return (
            <Box direction={"column"}>
              {status !== "success" && (
                <>
                  <Text size={"medium"} weight={600}>
                    Join our newsletter to get project and knowledge updates once a month.
                  </Text>
                  <Box height={"xxsmall"} />
                  <Box
                    direction={"row-responsive"}
                    gap={"medium"}
                    width={"100%"}
                    alignSelf={"center"}
                  >
                    <TextInput
                      focusIndicator={false}
                      placeholder="Email address"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      background={"#FFFFFF"}
                    />
                
                    <DashedButton
                        className="mt-1 w-fit px-10 py-2"
                        content={status === "sending" ? "Submitting..." : "Subscribe"}
                        onClick={() => {
                          subscribe({ EMAIL: email })
                        }}
                      />
                  </Box>
                </>
              )}

              {status === "success" && (
                <Box
                  margin={{ top: "small" }}
                  animation={{ type: "fadeIn", duration: 1000 }}
                >
                  <Text size={"medium"}>
                    Thank you! We look forward to sharing our progress with you. You can view our past newsletters&nbsp;
                    <a
                      href="https://us19.campaign-archive.com/home/?u=a9af83af1f247ecc04f50ad46&id=f3e092d65e&amp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>.
                  </Text>
                </Box>
              )}

              {status === "error" && (
                <Text size={"medium"} color={"status-error"}>
                  There was an error saving your email. Please try again later.
                </Text>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default MailchimpSubscribeForm
