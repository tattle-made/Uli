"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn("Posts", "lang", {
				type: Sequelize.STRING,
			}),
			queryInterface.sequelize.query(
				"ALTER TABLE Posts MODIFY COLUMN role ENUM('text', 'image', 'gif', 'video')"
			),
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn("Posts", "lang"),
			queryInterface.sequelize.query(
				"ALTER TABLE Posts MODIFY COLUMN role ENUM('text', 'image')"
			),
		]);
	},
};
