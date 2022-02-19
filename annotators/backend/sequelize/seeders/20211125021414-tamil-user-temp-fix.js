"use strict";
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const generatePassword = require("password-generator");
const data_ta = require("./posts_beta_2_tamil_30.json");

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const doubleUserId = await queryInterface.sequelize.query(
      `SELECT id from Users WHERE username="brinda_ta";`
    );
    const user = doubleUserId[0];
    console.log({ brinda: user });

    const doubleTamilPostIds = await queryInterface.sequelize.query(
      `SELECT id from Posts WHERE lang="ta";`
    );
    const tamilPostIDs = doubleTamilPostIds[0];
    console.log(`New tamil posts count : ${tamilPostIDs.length}`);
    console.log(`inserting for tamil user`);
    for (var i = 0; i < tamilPostIDs.length; i++) {
      await queryInterface.bulkInsert("UserPostAllocations", [
        {
          id: uuidv4(),
          userId: user[0].id,
          postId: tamilPostIDs[i].id,
          status: "pending",
          createdAt: time_of_run,
          updatedAt: time_of_run,
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
