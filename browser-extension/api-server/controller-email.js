const { sendEmail } = require("./email");

async function sendArchiveEmail(address, tweetUrl, imageUrl) {
  const emailBody = (tweetUrl, imageUrl) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Archived Tweet from OGBV Plugin</title>
      </head>
      <body>
        <p>${"Tweet URL :" + tweetUrl}</p>
        <img src=${imageUrl} src="img_girl.jpg" alt="Archived Tweet from the OGBV plugin" width="500" height="auto" />
      </body>
      </html>`;
  };

  await sendEmail({
    subject: "You archived a tweet using OGBV Plugin",
    body: emailBody(tweetUrl, imageUrl),
    receiver: address,
  });
}

async function sendAskFriendsForHelpEmail(address, tweetUrl, message) {
  const emailBody = (tweetUrl, message) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your friend needs your help</title>
      </head>
      <body>
        <p>${"Tweet URL :" + tweetUrl}</p>
        <p>${message}</p>
      </body>
      </html>`;
  };

  await sendEmail({
    subject: "Your friend needs your help",
    body: emailBody(tweetUrl, message),
    receiver: address,
  });
}

module.exports = {
  sendArchiveEmail,
  sendAskFriendsForHelpEmail,
};
