"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initialize(sequelize) {
        return super.init({
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("creator", "business", "admin"),
                allowNull: false,
            },
            verified: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            stripeCustomerId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            stripeSubscriptionId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            subscriptionStatus: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            subscriptionPlan: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'User',
        });
    }
}
exports.default = User;
