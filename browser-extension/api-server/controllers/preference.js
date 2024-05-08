//console.log(`Environment : ${process.env.NODE_ENV}`);

const {
  preference
} = require("../db/models");

const { encrypt, decrypt } = require("../encryption");


const addPreference =  async (req, res) => {
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
};



const getPreference =  async (req, res) => {
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
};




module.exports = {addPreference , getPreference} ; 