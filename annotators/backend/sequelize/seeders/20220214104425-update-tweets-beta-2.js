"use strict";
const data = require("./external-beta-1/ext_beta_alllang_tweets.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // for (let i = 0; i < data.posts.length; i++) {
    //   let post = data.posts[i];
    //   console.log(post);
    //   queryInterface.bulkUpdate(
    //     "Posts",
    //     { text: post.tweet_edit },
    //     { e_twitter_id: post.tweet_id }
    //   );
    // }
    let updatePromises = data.posts.map((post) =>
      queryInterface.bulkUpdate(
        "Posts",
        { text: post.tweet_edit },
        { e_twitter_id: post.tweet_id }
      )
    );
    return Promise.all(updatePromises);
    // let emojiPost = data.posts.filter(
    //   (post) => post.tweet_id === "1402867864386904066"
    // );
    // console.log(emojiPost);
    // let updatePromise = emojiPost.map((post) => {
    //   return queryInterface.bulkUpdate(
    //     "Posts",
    //     { text: post.tweet_edit },
    //     { e_twitter_id: post.tweet_id }
    //   );
    // });
    // return Promise.all(updatePromise);
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
