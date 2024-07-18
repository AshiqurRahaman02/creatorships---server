"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Application extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            businessId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            heading: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            pricing: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            start: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            experience: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            about: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            languages: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            benefits: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            no_of_openings: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Application',
        });
    }
    static associate(models) {
        this.belongsTo(models.BusinessInfo, { foreignKey: 'businessId', as: 'business' });
    }
}
exports.default = Application;
