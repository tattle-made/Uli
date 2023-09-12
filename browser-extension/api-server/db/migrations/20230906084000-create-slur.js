'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('slurs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model:'users', 
          key: 'id',
        }
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      labelMeaning: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      appropriated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      appropriationContext: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('slurs');
  },
};
