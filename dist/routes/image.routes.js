"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../controllers/image.controller");
const authentication_middlewares_1 = require("../middlewares/authentication.middlewares");
const imageRouter = (0, express_1.Router)();
imageRouter.post("/upload", authentication_middlewares_1.verifyToken, image_controller_1.uploadImage);
exports.default = imageRouter;
