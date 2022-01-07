"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Sessions", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			userId: {
				type: Sequelize.STRING,
			},
			postId: {
				type: Sequelize.STRING,
			},
			postIndex: {
				type: Sequelize.INTEGER,
			},
			pageNum: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("Sessions");
	},
};
