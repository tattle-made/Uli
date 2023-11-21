const {
  SES
} = require("@aws-sdk/client-sesv2");

const constructParamsObject = ({ subject, body, receiver }) => {
  const params = {
    Destination: {
      ToAddresses: [receiver],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "uli_support@tattle.co.in",
    ReplyToAddresses: ["uli_support@tattle.co.in"],
  };

  return params;
};

const sendEmail = async ({ subject, body, receiver }) => {
  const sendPromise = new SES({
    // The transformation for apiVersion is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for apiVersion.
    apiVersion: "2010-12-01",

    region: "ap-south-1",

    credentials: {
      accessKeyId: process.env.SERVICE_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.SERVICE_AWS_SECRET_ACCESS_KEY,
    }
  })
    .sendEmail(constructParamsObject({ subject, body, receiver }))
    .promise();
  try {
    await sendPromise;
    console.log("Success : Email");
  } catch (error) {
    console.log("Error : Could not send email");
    console.log(error);
    throw error;
  }
};

module.exports = { sendEmail };
