"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryConnection = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
require("dotenv").config();
exports.cloudinaryConnection = cloudinary_1.default.v2.config({
    cloud_name: process.env.cloudinary_cloudName,
    api_key: process.env.cloudinary_apiKey,
    api_secret: process.env.cloudinary_apiSecret,
});
module.exports = { cloudinaryConnection: exports.cloudinaryConnection };
