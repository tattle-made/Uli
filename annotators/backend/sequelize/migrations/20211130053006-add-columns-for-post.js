"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Posts", "e_twitter_id", {
			type: Sequelize.STRING,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Posts", "e_twitter_id");
	},
};
