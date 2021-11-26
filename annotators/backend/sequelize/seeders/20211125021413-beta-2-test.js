"use strict";
const { v4: uuidv4 } = require("uuid");
const { Op } = require("Sequelize");
const generatePassword = require("password-generator");
const data_en = require("./posts_beta_2_english_100.json");
const data_ta = require("./posts_beta_2_tamil_30.json");

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T03:07:14.977Z");
console.log(time_of_run);

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("Users", [
			{
				id: uuidv4(),
				role: "annotator",
				username: "brinda_ta",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
		]);
		const doubleUserIds = await queryInterface.sequelize.query(
			`SELECT id from Users order by createdAt;`
		);
		const userIDs = doubleUserIds[0];
		console.log(userIDs);

		const others = userIDs.slice(0, userIDs.length - 1);
		const brinda_ta = userIDs[4];

		console.log({ others });
		console.log({ brinda_ta });

		for (var i = 0; i < data_en.posts.length; i++) {
			await queryInterface.bulkInsert("Posts", [
				{
					id: uuidv4(),
					lang: "en",
					role: data_en.posts[i].content_type,
					text: data_en.posts[i].tweet,
					urls: "",
					photos: data_en.posts[i].image_url,
					createdAt: time_of_run,
					updatedAt: time_of_run,
				},
			]);
		}

		for (var i = 0; i < data_ta.posts.length; i++) {
			await queryInterface.bulkInsert("Posts", [
				{
					id: uuidv4(),
					lang: "ta",
					role: data_ta.posts[i].content_type,
					text: data_ta.posts[i].tweet,
					urls: "",
					photos: data_ta.posts[i].image_url,
					createdAt: time_of_run,
					updatedAt: time_of_run,
				},
			]);
		}

		const doublePostIds = await queryInterface.sequelize.query(
			`SELECT id from Posts WHERE createdAt >= ${
				time_of_run.toISOString().split(":")[0].split("T")[0]
			} AND lang="en";`
		);
		const postIDs = doublePostIds[0];
		console.log(`New english posts count : ${postIDs.length}`);
		console.log(`inserting for en users`);
		for (var j = 0; j < postIDs.length; j++) {
			for (var i = 0; i < 4; i++) {
				await queryInterface.bulkInsert("UserPostAllocations", [
					{
						id: uuidv4(),
						userId: others[i].id,
						postId: postIDs[j].id,
						status: "pending",
						createdAt: time_of_run,
						updatedAt: time_of_run,
					},
				]);
			}
		}

		const doubleTamilPostIds = await queryInterface.sequelize.query(
			`SELECT id from Posts WHERE createdAt >= ${
				time_of_run.toISOString().split(":")[0].split("T")[0]
			} AND lang="ta";`
		);
		const tamilPostIDs = doubleTamilPostIds[0];
		console.log(`New tamil posts count : ${tamilPostIDs.length}`);
		console.log(`inserting for tamil user`);
		for (var i = 0; i < tamilPostIDs.length; i++) {
			await queryInterface.bulkInsert("UserPostAllocations", [
				{
					id: uuidv4(),
					userId: brinda_ta.id,
					postId: postIDs[i].id,
					status: "pending",
					createdAt: time_of_run,
					updatedAt: time_of_run,
				},
			]);
		}
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete(
			"Users",
			{ createdAt: { [Op.gte]: time_of_run } },
			{}
		);
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
