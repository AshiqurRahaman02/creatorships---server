"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class CreatorInfo extends sequelize_1.Model {
    static initialize(sequelize) {
        return super.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users", // should be the name of the User table
                    key: "user_id",
                },
            },
            bio: {
                type: sequelize_1.DataTypes.TEXT,
            },
            phone_number: {
                type: sequelize_1.DataTypes.STRING,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
            },
            languages: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            },
            website: {
                type: sequelize_1.DataTypes.STRING,
            },
            social: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
            },
        }, {
            sequelize,
            modelName: "CreatorInfo",
        });
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}
exports.default = CreatorInfo;
