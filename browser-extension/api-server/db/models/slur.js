"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class slur extends Model {
     /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      slur.hasMany(models.category, {
        foreignKey: "slurId",
        as: "categories",
        });
    }
  }

  slur.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        foreignKey: true,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "slur",
    }
  );

  return slur;
};
