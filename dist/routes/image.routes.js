"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../controllers/image.controller");
const imageRouter = (0, express_1.Router)();
imageRouter.post("/upload", image_controller_1.uploadImage);
exports.default = imageRouter;
