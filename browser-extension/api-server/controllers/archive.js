//console.log(`Environment : ${process.env.NODE_ENV}`);
const {
  preference,
  post
} = require("../db/models");


const {
  sendArchiveEmail,
} = require("../controller-email");
const { encrypt, decrypt } = require("../encryption");


const archiveTweet =  async (req, res) => {
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
};

const getArchive =  async (req, res) => {
  const user = req.user;
  const { rows, count } = await post.findAndCountAll({
    where: {
      userId: user.id,
    },
    limit: 20,
  });

  const archive = rows.map((row) => row.get({ plain: true }));

  res.send({ archive, count });
};



module.exports = { getArchive , archiveTweet } ; 
