"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class preference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  preference.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.STRING,
      email: DataTypes.STRING,
      language: DataTypes.STRING,
      slurList: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "preference",
    }
  );
  return preference;
};
