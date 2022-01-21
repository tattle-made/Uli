"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class UserPostAllocation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			UserPostAllocation.belongsTo(models.User, { foreignKey: "userId" });
			UserPostAllocation.belongsTo(models.Post, { foreignKey: "postId" });
		}
	}
	UserPostAllocation.init(
		{
			id: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			order: DataTypes.INTEGER,
			userId: DataTypes.STRING,
			postId: DataTypes.STRING,
			status: DataTypes.ENUM("pending", "completed", "corrupt"),
		},
		{
			sequelize,
			modelName: "UserPostAllocation",
		}
	);
	return UserPostAllocation;
};
