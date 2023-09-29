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
        type: DataTypes.STRING,
      },
      level_of_severity : {
        type: DataTypes.ENUM(['low', 'medium', 'high']),
      },
      casual : {
        type: DataTypes.BOOLEAN,
      },
      appropriated: {
        type: DataTypes.BOOLEAN,
      },
      appropriationContext: {
        type: DataTypes.BOOLEAN,
      },
      labelMeaning: {
        type: DataTypes.TEXT,
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
