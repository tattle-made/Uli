const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.SERVICE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SERVICE_AWS_SECRET_ACCESS_KEY,
  },
});

try {
} catch (error) {
  console.log("Could not connect to AWS SES");
}

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
    Source: "admin@tattle.co.in",
    ReplyToAddresses: ["admin@tattle.co.in"],
  };

  return params;
};

const sendEmail = async ({ subject, body, receiver }) => {
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
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
