"use strict";
const { v4: uuidv4 } = require("uuid");
const generatePassword = require("password-generator");
const users = [{ username: "shivani_hi", lang: "hi" }];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userPayload = users.map((user) => {
      return {
        id: uuidv4(),
        role: "annotator",
        username: user.username,
        password: generatePassword(),
        lang: user.lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Users", userPayload);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
