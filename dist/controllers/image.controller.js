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
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
/**
 * Uploads an image file to Cloudinary.
 *
 * @param {any} file - The image file to upload.
 * @returns {Promise<any>} - A promise that resolves with the Cloudinary upload result or rejects with an error.
 */
function uploadImageToCloudinary(file) {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(file.tempFilePath, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
/**
 * Handles the image upload request, uploads the image to Cloudinary, and sends the response.
 *
 * @param {Request} req - The request object containing the image file in `req.files.image`.
 * @param {any} req.files.image - The image file to upload. **Required**
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the image upload operation.
 */
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image } = req.files;
        if (!image) {
            res.status(400).json({
                isError: true,
                message: "Image file is required",
            });
            return;
        }
        const imageResult = yield uploadImageToCloudinary(image);
        res.status(200).json({
            isError: false,
            imageResult,
            message: "Image uploaded",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            isError: true,
            message: "Error uploading image",
        });
    }
});
exports.uploadImage = uploadImage;
