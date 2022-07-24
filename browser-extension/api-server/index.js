const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const { upload } = require("./s3");

const { user, preference, post } = require("./db/models");
const { Op } = require("sequelize");
const { registerAnonymousUser } = require("./controller-auth");
const { sendEmail } = require("./email");
const {
  sendArchiveEmail,
  sendAskFriendsForHelpEmail,
} = require("./controller-email");

app.use(cors());
app.use(express.json());
app.options("*", cors());

app.use(async (req, res, next) => {
  console.log("auth middleware pinged");
  // console.log(req.headers);
  if (req.path.startsWith("/auth/")) {
    console.log("hi2");
    next();
  } else {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "No credentials sent!" });
    } else {
      authorization = req.headers.authorization;
      token = authorization.split(" ")[1];
      const result = await user.findOne({
        where: {
          accessToken: token,
        },
      });
      if (result == null) {
        res.status(401).json({ error: "Unauthorized user" });
      } else {
        req.user = result;
        next();
      }
    }
  }
});

console.log(process.env.NODE_ENV);

app.get("/auth/login", async (req, res) => {
  const { username, password } = req.query;
  const result = await user.findOne({
    where: {
      [Op.and]: [{ username }, { password }],
    },
  });
  if (result == null) {
    res.status(404).send();
  } else {
    res.send({ user: result.get({ plain: true }) });
  }
});

app.get("/auth/register", async (req, res) => {
  try {
    const newUser = await registerAnonymousUser();
    res.send({ user: newUser });
  } catch (err) {
    res.status(501).send();
  }
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await user.findOne({
    where: {
      id: userId,
    },
  });
  if (result == null) {
    res.send({ user: undefined, msg: "No user found" });
  } else {
    res.send({ user: result.get({ plain: true }) });
  }
});

app.post("/preference/", async (req, res) => {
  console.log("POST preferences");
  const { id, language, friends, slurList, email } = req.body;
  const user = req.user;
  console.log({ user, id, language, email, friends, slurList });
  const result = await preference.upsert({
    id,
    userId: user.id,
    email,
    language,
    friends,
    slurList,
  });
  res.send({ ...result[0].get({ plain: true }) });
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
    res.send({ preference: result.get({ plain: true }) });
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
  try {
    const fileName = req.file.key;
    const s3URL = req.file.location;
    const { url } = req.body;
    const user = req.user;
    console.log({ fileName, url, s3URL });

    await post.create({
      userId: user.id,
      sourceUrl: url,
      permanentUrl: null,
      tags: null,
      screenshotUrl: fileName,
    });

    const result = await preference.findOne({
      where: {
        userId: user.id,
      },
    });
    resultPlain = result.get({ plain: true });
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

app.post("/invoke-network", async (req, res) => {
  const user = req.user;
  const { message, url } = req.body;

  const result = await preference.findOne({
    where: {
      userId: user.id,
    },
  });
  const plainResult = result.get({ plain: true });
  if (result != null && plainResult.friends != null) {
    const { friends } = plainResult;
    let temp = friends.replace(/ /g, "");
    const friendArray = temp.split(",");
    friendArray.map(async (friend) => {
      await sendAskFriendsForHelpEmail(friend, url, message);
    });
  }

  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// userId : e3be8f99-7ec7-11ec-a714-0242ac140002
