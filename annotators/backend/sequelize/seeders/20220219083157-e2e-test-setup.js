"use strict";
const { v4: uuidv4 } = require("uuid");
const data = require("./e2e-test-data/tweets.json");
const allocation_data = require("./e2e-test-data/allocation.json");

const users = [
  {
    username: "tattle_annotator_en",
    lang: "en",
    role: "annotator",
    password: "r4&BTq",
  },
  {
    username: "tattle_annotator_en_2",
    lang: "en",
    role: "annotator",
    password: "Pt5#-!",
  },
  {
    username: "tattle_annotator_hi",
    lang: "hi",
    role: "annotator",
    password: "Vk5$%r",
  },
  {
    username: "tattle_annotator_hi_2",
    lang: "hi",
    role: "annotator",
    password: "?DSq2t",
  },
  {
    username: "tattle_annotator_ta",
    lang: "ta",
    role: "annotator",
    password: "+B2CuN",
  },
  {
    username: "tattle_annotator_ta_2",
    lang: "ta",
    role: "annotator",
    password: "w5WD*^",
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userPayload = users.map((user) => {
      return {
        id: uuidv4(),
        role: user.role,
        username: user.username,
        password: user.password,
        lang: user.lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Users", userPayload);
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

    // INSERT POSTS
    for (var i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      if (post.tweet_edit.length >= 500) {
        continue;
      }
      await queryInterface.bulkInsert("Posts", [
        {
          id: uuidv4(),
          e_twitter_id: post.tweet_id,
          lang: post.language,
          role: post.content_type,
          text: post.tweet_edit,
          urls: "",
          photos: post.image_url.slice(1, post.image_url.length - 1),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
    const doublePostIDs = await queryInterface.sequelize.query(
      `SELECT id, e_twitter_id from Posts`
    );
    const postIDs = doublePostIDs[0];
    let postTwitterIDToID = {};
    postIDs.map((postID) => {
      postTwitterIDToID[postID.e_twitter_id] = postID.id;
    });

    for (let i = 0; i < allocation_data.posts.length; i++) {
      let order_offset = i;
      let currentAllocation = allocation_data.posts[i];
      let payloads = ["user_id_1", "user_id_2"].map((userfield) => {
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
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Posts", null, {});
    await queryInterface.bulkDelete("UserPostAllocations", null, {});
  },
};
