"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Annotation);
      User.belongsToMany(models.Post, {
        through: models.UserPostAllocation,
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role: DataTypes.ENUM("admin", "editor", "annotator"),
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      lang: DataTypes.ENUM("hi", "en", "ta"),
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
