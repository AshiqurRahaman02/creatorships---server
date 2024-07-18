import express from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import bodyParser from "body-parser";

import userRoutes from "./routes/user.routes";
import sequelize from "./config/sequelize.config";
import creatorRouter from "./routes/creator.routes";
import businessRouter from "./routes/business.routes";
import applicationRouter from "./routes/application.routes";
import chatRouter from "./routes/chat.routes";
import imageRouter from "./routes/image.routes";
import mailRouter from "./routes/mail.route";
import User from "./models/user.model";
require("dotenv").config();

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(
    fileupload({
        useTempFiles: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

// Routes
app.use("/user", userRoutes);
app.use("/creator", creatorRouter);
app.use("/business", businessRouter);
app.use("/application", applicationRouter);
app.use("/chat", chatRouter);
app.use("/image", imageRouter);
app.use("/mail", mailRouter);



sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Database & tables synced");
        // Start the server after syncing
        const PORT = process.env.PORT || 5151;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error("Error syncing database:", error);
    });
