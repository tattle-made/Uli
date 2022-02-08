"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const data = require("./external-beta-1/ext_beta_alllang_tweets.json");
const allocation_data = require("./external-beta-1/ext_beta_alllang_annotators.json");

console.log(new Date());

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
