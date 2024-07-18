import cloudinary from "cloudinary";
require("dotenv").config();

export const cloudinaryConnection = cloudinary.v2.config({
	cloud_name: process.env.cloudinary_cloudName,
	api_key: process.env.cloudinary_apiKey,
	api_secret: process.env.cloudinary_apiSecret,
});

module.exports = { cloudinaryConnection };
