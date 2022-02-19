"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const data = require("./posts_beta_5_en.json");
const { Op } = require("sequelize");

console.log(data.length);

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const doubleUserIds = await queryInterface.sequelize.query(
      `SELECT id from Users where lang='en';`
    );
    const englishUserIDs = doubleUserIds[0];
    console.log(englishUserIDs);

    // INSERT POSTS
    for (var i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      if (post.tweet.length >= 500) {
        continue;
      }
      await queryInterface.bulkInsert("Posts", [
        {
          id: uuidv4(),
          e_twitter_id: post.tweet_id,
          lang: post.language,
          role: post.content_type,
          text: post.tweet,
          urls: "",
          photos: post.image_url.slice(1, post.image_url.length - 1),
          createdAt: time_of_run,
          updatedAt: time_of_run,
        },
      ]);
    }

    // ALLOCATE POSTS TO ENLISH ANNOTATORS
    const doubleEnglishPostIds = await queryInterface.sequelize.query(
      `SELECT id from Posts WHERE lang="en";`
    );
    const englishPostIDs = doubleEnglishPostIds[0];
    console.log(`New english posts count : ${englishPostIDs.length}`);
    console.log(`inserting for EN users`);
    for (var j = 0; j < englishPostIDs.length; j++) {
      for (var i = 0; i < englishUserIDs.length; i++) {
        await queryInterface.bulkInsert("UserPostAllocations", [
          {
            id: uuidv4(),
            userId: englishUserIDs[i].id,
            postId: englishPostIDs[j].id,
            status: "pending",
            createdAt: time_of_run,
            updatedAt: time_of_run,
          },
        ]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "Posts",
      { createdAt: { [Op.gte]: time_of_run } },
      {}
    );
    await queryInterface.bulkDelete(
      "UserPostAllocations",
      { createdAt: { [Op.gte]: time_of_run } },
      {}
    );
  },
};
