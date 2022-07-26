"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      accessToken: {
        type: Sequelize.STRING,
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "BLOCKED", "RESET"),
        defaultValue: "ACTIVE",
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
    await queryInterface.dropTable("users");
  },
};
