"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const data = require("./posts-beta-test.json");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = await queryInterface.bulkInsert("Users", [
			{
				id: uuidv4(),
				role: "annotator",
				username: "tarunima",
				password: generatePassword(),
				lang: "en",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "cheshta",
				password: generatePassword(),
				lang: "en",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "arnav",
				password: generatePassword(),
				lang: "en",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "brinda",
				password: generatePassword(),
				lang: "en",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
		const doubleUserIds = await queryInterface.sequelize.query(
			`SELECT id from Users;`
		);
		const userIDs = doubleUserIds[0];

		const posts = await Promise.all(
			data.posts.map(async (post) => {
				await queryInterface.bulkInsert("Posts", [
					{
						id: uuidv4(),
						role: "text",
						text: post.tweet,
						urls: post.urls.slice(1, post.urls.length - 1),
						photos: post.photos.slice(1, post.photos.length - 1),
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				]);
			})
		);

		const doublePostIds = await queryInterface.sequelize.query(
			`SELECT id from Posts;`
		);
		const postIDs = doublePostIds[0];

		for (var i = 0; i < postIDs.length; i++) {
			for (var j = 0; j < userIDs.length; j++) {
				await queryInterface.bulkInsert("UserPostAllocations", [
					{
						id: uuidv4(),
						userId: userIDs[j].id,
						postId: postIDs[i].id,
						status: "pending",
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				]);
			}
		}
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Users", null, {});
		await queryInterface.bulkDelete("Posts", null, {});
		await queryInterface.bulkDelete("UserPostAllocations", null, {});
	},
};
