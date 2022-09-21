const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { upload } = require("./s3");

const { preference, post } = require("./db/models");
const { Op } = require("sequelize");
const { registerAnonymousUser, resetUser } = require("./controller-auth");
const { sendEmail } = require("./email");
const {
  sendArchiveEmail,
  sendAskFriendsForHelpEmail,
} = require("./controller-email");
const { authentication } = require("./middlewares");
const { encrypt, decrypt } = require("./encryption");
const { classify } = require("./service-classifier");

app.use(cors());
app.use(express.json());
app.options("*", cors());

app.use(authentication);

console.log(`Environment : ${process.env.NODE_ENV}`);

app.get("/auth/register", async (req, res) => {
  try {
    const newUser = await registerAnonymousUser();
    res.send({ user: newUser });
  } catch (err) {
    res.status(501).send();
  }
});

app.post("/preference/", async (req, res) => {
  console.log("POST preferences");
  const { id, language, slurList, email } = req.body;
  const user = req.user;
  const encryptedEmail = email ? encrypt(email) : null;
  const result = await preference.upsert({
    id,
    userId: user.id,
    email: encryptedEmail,
    language,
    slurList,
  });

  let plainResult = result[0].get({ plain: true });
  console.log({ plainResult });
  res.send({
    ...plainResult,
    email,
  });

  // res.send({ ...result[0].get({ plain: true }) });
});

app.get("/preference/", async (req, res) => {
  const user = req.user;
  const result = await preference.findOne({
    where: {
      userId: user.id,
    },
  });
  if (result == null) {
    res.status(404).send();
  } else {
    let plainResult = result.get({ plain: true });
    // console.log({ plainResult });
    res.send({
      ...plainResult,
      email: decrypt(plainResult.email),
    });
  }
});

app.get("/post", async (req, res) => {
  const user = req.user;
  const result = post.findAll({
    where: {
      userId: user.id,
    },
    limit: 20,
  });
  res.send({ posts: result.map((res) => res.get({ plain: true })) });
});

app.post("/archive", upload.single("screenshot"), async (req, res) => {
  console.log("archive POST request");
  try {
    const fileName = req.file.key;
    const s3URL = req.file.location;
    const { url } = req.body;
    const user = req.user;

    await post.create({
      userId: user.id,
      sourceUrl: url,
      permanentUrl: null,
      tags: null,
      screenshot: fileName,
    });

    const result = await preference.findOne({
      where: {
        userId: user.id,
      },
    });
    resultPlain = result.get({ plain: true });
    resultPlain = { ...resultPlain, email: decrypt(resultPlain.email) };

    console.log({ resultPlain });

    if (
      (result != null && resultPlain.email != undefined) ||
      resultPlain.email != null
    ) {
      await sendArchiveEmail(
        resultPlain.email,
        url,
        `https://uli-media.tattle.co.in/${fileName}`
      );
    }

    res.send({ msg: "Tweet Archived" });
  } catch (err) {
    res.status(501).send({ msg: "Error archiving tweet" });
  }
});

app.get("/archive", async (req, res) => {
  const user = req.user;
  const { rows, count } = await post.findAndCountAll({
    where: {
      userId: user.id,
    },
    limit: 20,
  });

  const archive = rows.map((row) => row.get({ plain: true }));

  res.send({ archive, count });
});

app.post("/predict", async (req, res) => {
  const { text } = req.body;
  try {
    const label = await classify(text);
    res.send(label);
  } catch (err) {
    console.log("Error : could not classify tweet");
    console.log(err);
    res.status(501).send("Could not label this tweet");
  }
});

app.post("/reset", async (req, res) => {
  const { user } = req;
  const userId = user.id;
  console.log(`reset request for ${userId}`);
  try {
    await resetUser(userId);
    res.send({ message: "Account reset" });
  } catch (err) {
    console.log(`Error : unable to reset account`);
    console.log(err);
    res.status(501).send("Could not reset account");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
