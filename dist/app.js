"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const sequelize_config_1 = __importDefault(require("./config/sequelize.config"));
const creator_routes_1 = __importDefault(require("./routes/creator.routes"));
const business_routes_1 = __importDefault(require("./routes/business.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const image_routes_1 = __importDefault(require("./routes/image.routes"));
const mail_route_1 = __importDefault(require("./routes/mail.route"));
require("dotenv").config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
// Routes
app.use("/user", user_routes_1.default);
app.use("/creator", creator_routes_1.default);
app.use("/business", business_routes_1.default);
app.use("/application", application_routes_1.default);
app.use("/chat", chat_routes_1.default);
app.use("/image", image_routes_1.default);
app.use("/mail", mail_route_1.default);
sequelize_config_1.default
    .sync({ force: false })
    .then(() => {
    console.log("Database & tables synced");
    // Start the server after syncing
    const PORT = process.env.PORT || 5151;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error syncing database:", error);
});
