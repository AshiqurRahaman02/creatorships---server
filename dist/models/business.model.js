"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class BusinessInfo extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            about: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            industry: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            total_employee: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            website: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            social: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "BusinessInfo",
        });
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
}
exports.default = BusinessInfo;
