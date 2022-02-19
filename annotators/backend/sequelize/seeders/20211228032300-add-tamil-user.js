"use strict";
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const generatePassword = require("password-generator");

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        role: "annotator",
        username: "shanmathi",
        password: generatePassword(),
        lang: "ta",
        createdAt: time_of_run,
        updatedAt: time_of_run,
      },
    ]);
    const doubleTamilUserIds = await queryInterface.sequelize.query(
      `SELECT id from Users where username='shanmathi';`
    );
    const tamilUserIDs = doubleTamilUserIds[0];
    console.log(tamilUserIDs);

    // ALLOCATE POSTS TO TAMIL ANNOTATORS
    const doubleTamilPostIds = await queryInterface.sequelize.query(
      `SELECT id from Posts WHERE lang="ta";`
    );
    const tamilPostIDs = doubleTamilPostIds[0];
    console.log(`New tamil posts count : ${tamilPostIDs.length}`);
    console.log(`inserting for TA users`);
    for (var j = 0; j < tamilPostIDs.length; j++) {
      for (var i = 0; i < tamilUserIDs.length; i++) {
        await queryInterface.bulkInsert("UserPostAllocations", [
          {
            id: uuidv4(),
            userId: tamilUserIDs[i].id,
            postId: tamilPostIDs[j].id,
            status: "pending",
            createdAt: time_of_run,
            updatedAt: time_of_run,
          },
        ]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete("Users", null, {}),
      await queryInterface.bulkDelete("Posts", null, {}),
      await queryInterface.bulkDelete("UserPostAllocations", null, {}),
      await queryInterface.bulkDelete(
        "UserPostAllocations",
        { createdAt: { [Op.gte]: time_of_run } },
        {}
      ),
    ]);
  },
};
