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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary = require("cloudinary");
function uploadImageToCloudinary(file) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file.tempFilePath, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image } = req.files;
        const imageResult = yield uploadImageToCloudinary(image);
        res.status(200).json({ isError: false, imageResult });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching the form" });
    }
});
exports.uploadImage = uploadImage;
