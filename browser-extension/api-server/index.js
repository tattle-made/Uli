//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const app = express();
app.disable("x-powered-by");
const port = 3000;
const cors = require("cors");
const { upload } = require("./s3");

const {
  preference,
  post,
  feedback,
  slur,
  category,
  sequelize,
} = require("./db/models");

const { registerAnonymousUser, resetUser } = require("./controller-auth");
const { sendEmail } = require("./email");
const {
  sendArchiveEmail,
  sendAskFriendsForHelpEmail,
} = require("./controller-email");
const { authentication } = require("./middlewares");
const { encrypt, decrypt } = require("./encryption");
const { classify } = require("./service-classifier");
const { text } = require("express");

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
    console.log(err);
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

// Feedback code from here
app.post("/feedback", async (req, res) => {
  console.log("POST feedback");
  try {
    const data = req.body;

    await feedback.create({
      userId: data.user_id,
      tweetText: data.tweet_text,
      sentiment: data.tweet_sentiment,
      confidence: data.tweet_confidence,
    });

    res.send({ msg: "Feedback Sent" });
  } catch (err) {
    //console.log(err);
    res.status(501).send({ msg: "Error sending feedback" });
  }
});

// Feedback code ends here
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

// GET request for Slur and Category
app.get("/slur", async (req, res) => {
  const user = req.user;
  try {
    const results = await slur.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: category,
          as: "categories",
        },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
});

app.get("/slur/:id", async (req, res) => {
  const slurId = req.params.id;
  try {
    const slurMetadata = await slur.findByPk(slurId, {
      include: [
        {
          model: category,
          as: "categories",
        },
      ],
    });
    res.json(slurMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
});

// POST request for slur and category
app.post("/slur/create", async (req, res) => {
  const { user } = req;
  const userId = user.id;
  const {
    label,
    level_of_severity,
    casual,
    appropriated,
    appropriationContext,
    labelMeaning,
    categories,
  } = req.body;
  console.log(
    userId,
    label,
    labelMeaning,
    appropriated,
    appropriationContext,
    categories
  );
  const t = await sequelize.transaction();

  try {
    const newSlur = await slur.create(
      {
        userId,
        label,
        level_of_severity,
        casual,
        appropriated,
        appropriationContext,
        labelMeaning,
      },
      { transaction: t }
    );

    const categoryPromises = categories.map(async (categoryData) => {
      const newCategory = await category.create(
        {
          slurId: newSlur.id,
          category: categoryData,
        },
        { transaction: t }
      );
      return newCategory;
    });

    const createdCategories = await Promise.all(categoryPromises);

    await t.commit();

    res.send({
      slur: newSlur,
      categories: createdCategories,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
});

// PUT request for slur and category
app.put("/slur/:id", async (req, res) => {
  const slurId = req.params.id;
  const {
    label,
    level_of_severity,
    casual,
    appropriated,
    appropriationContext,
    labelMeaning,
    categories,
  } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingSlur = await slur.findByPk(slurId, { transaction: t });
    if (!existingSlur) {
      res.status(404).send({ error: "Slur not found" });
      await t.rollback();
      return;
    }
    // Update the slur record
    existingSlur.label = label;
    existingSlur.level_of_severity = level_of_severity;
    existingSlur.casual = casual;
    existingSlur.appropriated = appropriated;
    existingSlur.appropriationContext = appropriationContext;
    existingSlur.labelMeaning = labelMeaning;
    await existingSlur.save({ transaction: t });

    // Delete existing categories for this slur
    await category.destroy({
      where: {
        slurId: existingSlur.id,
      },
      transaction: t,
    });

    // Create new categories
    const categoryPromises = categories.map(async (categoryData) => {
      const newCategory = await category.create(
        {
          slurId: existingSlur.id,
          category: categoryData.category,
        },
        { transaction: t }
      );
      return newCategory;
    });

    const updatedCategories = await Promise.all(categoryPromises);
    await t.commit();

    res.send({
      slur: existingSlur,
      categories: updatedCategories,
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).send({ error: "Server error" });
  }
});

// DELETE request for slur and category
app.delete("/slur/:id", async (req, res) => {
  const slurId = req.params.id;
  const t = await sequelize.transaction();
  try {
    const slurToDelete = await slur.findByPk(slurId, { transaction: t });
    if (!slurToDelete) {
      res.status(404).send({ error: "Slur not found" });
      await t.rollback();
      return;
    }

    await category.destroy({
      where: {
        slurId: slurToDelete.id,
      },
      transaction: t,
    });
    await slurToDelete.destroy({ transaction: t });

    await t.commit();

    res.send();
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).send({ error: "server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
