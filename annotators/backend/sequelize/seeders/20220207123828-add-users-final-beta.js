"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");

const users = [
  { username: "arnav_en", lang: "en" },
  { username: "cheshta_en", lang: "en" },
  { username: "tarunima_en", lang: "en" },
  { username: "ambika_en", lang: "en" },
  { username: "brindaa_en", lang: "en" },
  { username: "brindaa_ta", lang: "ta" },
  { username: "vivek_ta", lang: "ta" },
  { username: "sonia_ta", lang: "ta" },
  { username: "grace_ta", lang: "ta" },
  { username: "bharathy_ta", lang: "ta" },
  { username: "dharini_ta", lang: "ta" },
  { username: "smita_ta", lang: "ta" },
  { username: "haseena_hi", lang: "hi" },
  { username: "kherun_hi", lang: "hi" },
  { username: "srishti_hi", lang: "hi" },
  { username: "kirti_hi", lang: "hi" },
  { username: "seema_hi", lang: "hi" },
  { username: "div_hi", lang: "hi" },
  { username: "pushpa_en", lang: "en" },
  { username: "shehla_en", lang: "en" },
  { username: "rishikesh_en", lang: "en" },
  { username: "pooja_en", lang: "en" },
  { username: "sumit_en", lang: "en" },
  { username: "apurva_en", lang: "en" },
  { username: "chithira_en", lang: "en" },
  { username: "denny_en", lang: "en" },
  { username: "denny_hi", lang: "hi" },
  { username: "denny_ta", lang: "ta" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userPayload = users.map((user) => {
      return {
        id: uuidv4(),
        role: "annotator",
        username: user.username,
        password: generatePassword(),
        lang: user.lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Users", userPayload);
    const doubleUserIds = await queryInterface.sequelize.query(
      `SELECT id from Users;`
    );
    const userIDs = doubleUserIds[0];
    console.log(userIDs);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
