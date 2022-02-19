"use strict";
const { v4: uuidv4 } = require("uuid");
const allocation_data = require("./external-beta-2/allocations_ext_beta_2.json");
const { Op } = require("sequelize");

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);
console.log(time_of_run.toISOString().split("T")[0].split("-").join(""));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const doubleUserIds = await queryInterface.sequelize.query(
      `SELECT id, username from Users;`
    );
    const userIDs = doubleUserIds[0];
    console.log(userIDs);
    let userNameToID = {};
    userIDs.map((userID) => {
      userNameToID[userID.username] = userID.id;
    });
    console.log(userNameToID);

    const doublePostIDs = await queryInterface.sequelize.query(
      `SELECT id, e_twitter_id from Posts`
    );
    const postIDs = doublePostIDs[0];
    let postTwitterIDToID = {};
    postIDs.map((postID) => {
      postTwitterIDToID[postID.e_twitter_id] = postID.id;
    });

    // ALLOCATE POSTS
    const ORDER_OFFSET = 552;
    for (let i = 0; i < allocation_data.posts.length; i++) {
      let order_offset = i + ORDER_OFFSET;
      let currentAllocation = allocation_data.posts[i];
      let payloads = ["user_id_1", "user_id_2"].map((userfield) => {
        return {
          id: uuidv4(),
          userId: userNameToID[currentAllocation[userfield]],
          postId: postTwitterIDToID[currentAllocation.tweet_id],
          status: "pending",
          order: order_offset,
          createdAt: time_of_run,
          updatedAt: time_of_run,
        };
      });
      await queryInterface.bulkInsert("UserPostAllocations", payloads);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "UserPostAllocations",
      { createdAt: { [Op.gte]: time_of_run } },
      {}
    );
  },
};
