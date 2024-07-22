"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const creator_model_1 = __importDefault(require("../models/creator.model"));
const business_model_1 = __importDefault(require("../models/business.model"));
const application_model_1 = __importDefault(require("../models/application.model"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
// Sequelize configuration
const connectionString = process.env.connectionString || "";
const sequelize = new sequelize_1.Sequelize(connectionString, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
});
// Initialize models
user_model_1.default.initialize(sequelize);
creator_model_1.default.initialize(sequelize);
business_model_1.default.initialize(sequelize);
application_model_1.default.initialize(sequelize);
chat_model_1.default.initialize(sequelize);
// Define associations
user_model_1.default.hasOne(creator_model_1.default, { foreignKey: "user_id", as: "creatorInfo" });
creator_model_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
user_model_1.default.hasOne(business_model_1.default, { foreignKey: "user_id", as: "businessInfo" });
business_model_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
user_model_1.default.hasMany(application_model_1.default, {
    foreignKey: "userId",
    as: "applications",
});
application_model_1.default.belongsTo(user_model_1.default, {
    foreignKey: "userId",
    as: "user",
});
// This association is more complex and can be handled within your application logic
user_model_1.default.hasMany(chat_model_1.default, { foreignKey: "sender_id", as: "sentChats" });
user_model_1.default.hasMany(chat_model_1.default, { foreignKey: "receiver_id", as: "receivedChats" });
chat_model_1.default.belongsTo(user_model_1.default, { foreignKey: "sender_id", as: "sender" });
chat_model_1.default.belongsTo(user_model_1.default, { foreignKey: "receiver_id", as: "receiver" });
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // Synchronize models in order
        yield user_model_1.default.sync({ force: false }); // Force true for development, false for production
        yield creator_model_1.default.sync({ force: false });
        yield business_model_1.default.sync({ force: false });
        yield application_model_1.default.sync({ force: false });
        yield chat_model_1.default.sync({ force: false });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
syncDatabase();
exports.default = sequelize;
