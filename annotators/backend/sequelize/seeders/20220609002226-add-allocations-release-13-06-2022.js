"use strict";
const { v4: uuidv4 } = require("uuid");
const allocation_data = require("./release-data-13-06-2022/allocation.json");

console.log(new Date());

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
    const ORDER_OFFSET = 24785;
    for (let i = 0; i < allocation_data.posts.length; i++) {
      let order_offset = i + ORDER_OFFSET;
      let currentAllocation = allocation_data.posts[i];
      let payloads = ["user_id_1"].map((userfield) => {
        return {
          id: uuidv4(),
          userId: userNameToID[currentAllocation[userfield]],
          postId: postTwitterIDToID[currentAllocation.tweet_id],
          status: "pending",
          order: order_offset,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      await queryInterface.bulkInsert("UserPostAllocations", payloads);
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
