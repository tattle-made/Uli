'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('slurs', 'language', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('slurs', 'language');
  },
};
