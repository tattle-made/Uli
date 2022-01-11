"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const data = require("./posts_beta_4_en_tam_50_30.json");

/**
 * This seeder was used in the internal beta. it inserts 50 english posts in the db
 * and allocates it to all the english users in the db
 *
 * prereq : there are already some english users in the db
 */

const time_of_run = new Date();
// const time_of_run = new Date("2021-11-26T04:10:43.073Z");
console.log(time_of_run);

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// INSERT ENGLISH ANNOTATORS
		const users = await queryInterface.bulkInsert("Users", [
			{
				id: uuidv4(),
				role: "annotator",
				username: "tarunima",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "cheshta",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "ambika",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "brindaa",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "arnav",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "denny",
				password: generatePassword(),
				lang: "en",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
		]);
		const doubleUserIds = await queryInterface.sequelize.query(
			`SELECT id from Users where lang='en';`
		);
		const englishUserIDs = doubleUserIds[0];
		console.log(englishUserIDs);

		// INSERT TAMIL ANNOTATORS
		await queryInterface.bulkInsert("Users", [
			{
				id: uuidv4(),
				role: "annotator",
				username: "brindaa_ta",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "denny_ta",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "vvveerasekar",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "sonia.arunkumar",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "gracebanug",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "Bharathy10",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "dharinirj24",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
			{
				id: uuidv4(),
				role: "annotator",
				username: "atimsrainnav",
				password: generatePassword(),
				lang: "ta",
				createdAt: time_of_run,
				updatedAt: time_of_run,
			},
		]);
		const doubleTamilUserIds = await queryInterface.sequelize.query(
			`SELECT id from Users where lang='ta';`
		);
		const tamilUserIDs = doubleTamilUserIds[0];
		console.log(tamilUserIDs);

		// INSERT POSTS
		for (var i = 0; i < data.posts.length; i++) {
			const post = data.posts[i];
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

		// ALLOCATE POSTS TO TAMIL ANNOTATORS
		const doubleTamilPostIds = await queryInterface.sequelize.query(
			`SELECT id from Posts WHERE lang="ta";`
		);
		const tamilPostIDs = doubleTamilPostIds[0];
		console.log(`New tamil posts count : ${tamilPostIDs.length}`);
		console.log(`inserting for TA users`);
		for (var j = 0; j < tamilPostIDs.length; j++) {
			for (var i = 0; i < tamilUserIDs.length; i++) {
				await queryInterface.bulkInsert("UserPostAllocations", [
					{
						id: uuidv4(),
						userId: tamilUserIDs[i].id,
						postId: tamilPostIDs[j].id,
						status: "pending",
						createdAt: time_of_run,
						updatedAt: time_of_run,
					},
				]);
			}
		}
	},

	down: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.bulkDelete("Users", null, {}),
			await queryInterface.bulkDelete("Posts", null, {}),
			await queryInterface.bulkDelete("UserPostAllocations", null, {}),
		]);
	},
};
