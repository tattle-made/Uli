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
      },
      level_of_severity : {
        type: Sequelize.ENUM(['low', 'medium', 'high']),
      },
      casual : {
        type: Sequelize.BOOLEAN,
      },
      appropriated: {
        type: Sequelize.BOOLEAN,
      },
      appropriationContext: {
        type: Sequelize.BOOLEAN,
      },
      labelMeaning: {
        type: Sequelize.TEXT,
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
