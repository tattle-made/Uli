"use strict";
const { Model, Op } = require("sequelize");
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
        unique: true,
      },
      postId: DataTypes.STRING,
      key: DataTypes.STRING,
      value: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      hooks: {
        async afterUpsert(created, options) {
          console.log("annotation upserted");
          const { userId, postId } = created[0].dataValues;
          console.log({ userId, postId });
          const annotations = await sequelize.models.Annotation.findAll({
            where: {
              userId,
              postId,
            },
          });
          // console.log({ annotations });
          let requiredAnnotations = annotations.filter(
            (annotation) =>
              annotation.key === "question_1" ||
              annotation.key === "question_2" ||
              annotation.key === "question_3"
          );
          if (requiredAnnotations.length === 3) {
            console.log("THIS IS A COMPLETE ANNOTATION");
            const allocation =
              await sequelize.models.UserPostAllocation.findOne({
                where: {
                  userId,
                  postId,
                },
              });
            await allocation.update({ status: "completed" });
          }
        },
      },
      sequelize,
      modelName: "Annotation",
    }
  );
  return Annotation;
};
