"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Annotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Annotation.belongsTo(models.User, { foreignKey: "userId" });
      Annotation.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  Annotation.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      postId: DataTypes.STRING,
      key: DataTypes.STRING,
      value: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Annotation",
    }
  );
  return Annotation;
};
