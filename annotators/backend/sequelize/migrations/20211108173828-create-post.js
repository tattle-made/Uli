"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Posts", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			role: {
				type: Sequelize.ENUM("text", "image"),
			},
			text: {
				type: Sequelize.STRING(500),
			},
			urls: {
				type: Sequelize.STRING(500),
			},
			photos: {
				type: Sequelize.STRING(500),
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Posts");
	},
};
