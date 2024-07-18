import { Sequelize } from "sequelize";
import User from "../models/user.model";
import CreatorInfo from "../models/creator.model";
import BusinessInfo from "../models/business.model";
import Application from "../models/application.model";
import Chat from "../models/chat.model";

// Sequelize configuration
const connectionString = process.env.connectionString || "";

const sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
});

// Initialize models
User.initialize(sequelize);
CreatorInfo.initialize(sequelize);
BusinessInfo.initialize(sequelize);
Application.initialize(sequelize);
Chat.initialize(sequelize);

// Define associations
User.hasOne(CreatorInfo, { foreignKey: "user_id", as: "creatorInfo" });
CreatorInfo.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(BusinessInfo, { foreignKey: "user_id", as: "businessInfo" });
BusinessInfo.belongsTo(User, { foreignKey: "user_id", as: "user" });

BusinessInfo.hasMany(Application, {
    foreignKey: "business_id",
    as: "applications",
});
Application.belongsTo(BusinessInfo, {
    foreignKey: "business_id",
    as: "businessInfo",
});

// This association is more complex and can be handled within your application logic
User.hasMany(Chat, { foreignKey: 'sender_id', as: 'sentChats' });
User.hasMany(Chat, { foreignKey: 'receiver_id', as: 'receivedChats' });
Chat.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Chat.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Synchronize models in order
        await User.sync({ force: false }); // Force true for development, false for production
        await CreatorInfo.sync({ force: false });
        await BusinessInfo.sync({ force: false });
        await Application.sync({ force: false });
        await Chat.sync({ force: false });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncDatabase();

export default sequelize;
