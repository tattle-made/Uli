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
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      labelMeaning: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      appropriated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      appropriationContext: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "slur",
    }
  );

  return slur;
};
