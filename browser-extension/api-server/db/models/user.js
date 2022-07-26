"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.preference);
      user.hasMany(models.post);
    }
  }
  user.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      accessToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      status: DataTypes.ENUM("ACTIVE", "BLOCKED", "RESET"),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
