"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  category.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
        slurId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        foreignKey: true,
        allowNull: false,
        },
      category : {
        type: DataTypes.ENUM(['gender', 'religion', 'caste']),
      },
    },
    {
      sequelize,
      modelName: "category",
    }
  );

  return category;
};
