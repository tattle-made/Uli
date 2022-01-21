"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			"UserPostAllocations",
			"order",
			Sequelize.INTEGER
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.removeColumn("UserPostAllocations", "order");
	},
};
