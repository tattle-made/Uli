"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const data = require("./posts_beta_6_en.json");

console.log(data.length);

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);
console.log(time_of_run.toISOString().split("T")[0].split("-").join(""));

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
					lang: post.lang,
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
			`SELECT id from Posts WHERE lang="en" and createdAt>=${time_of_run
				.toISOString()
				.split("T")[0]
				.split("-")
				.join("")};`
		);
		const englishPostIDs = doubleEnglishPostIds[0];
		console.log(`New english posts count : ${englishPostIDs.length}`);
		console.log(`inserting for EN users`);
		for (var j = 0; j < englishPostIDs.length; j++) {
			let order_offset = 0;
			let payloads = englishUserIDs.map((user) => {
				return {
					id: uuidv4(),
					userId: user.id,
					postId: englishPostIDs[j].id,
					status: "pending",
					order: order_offset + j,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
			});
			await queryInterface.bulkInsert("UserPostAllocations", payloads);
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
