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
exports.searchCreators = exports.getAllCreators = exports.getCreator = exports.deleteCreator = exports.updateCreator = exports.createCreator = void 0;
const sequelize_1 = require("sequelize");
const creator_model_1 = __importDefault(require("../models/creator.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a new creator
const createCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bio, phoneNo, location, languages, website, social } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        if (typeof userId !== "number") {
            return res.status(201).json({
                isError: true,
                message: "Bio must be a string",
            });
        }
        if (bio && typeof bio !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Bio must be a string",
            });
        }
        if (phoneNo && typeof phoneNo !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Phone No must be a string",
            });
        }
        if (location && typeof location !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Location must be a string",
            });
        }
        if (languages && typeof languages !== "object") {
            return res.status(201).json({
                isError: true,
                message: "Languages must be an array of strings",
            });
        }
        if (website && typeof website !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Website must be a string",
            });
        }
        if (social && typeof social !== "object") {
            return res.status(201).json({
                isError: true,
                message: "Social must be an object",
            });
        }
        // Create new creator info
        const newCreatorInfo = yield creator_model_1.default.create({
            user_id: userId,
            bio,
            phone_number: phoneNo,
            location,
            languages,
            website,
            social,
        });
        res.status(201).json({ isError: false, creator: newCreatorInfo,
            message: "Creator created successfully", });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.createCreator = createCreator;
// Update creator information
const updateCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { bio, phoneNo, location, languages, website, social } = req.body;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const creator = yield creator_model_1.default.findOne({ where: { user_id: userId } });
        if (!creator) {
            return res
                .status(404)
                .json({ isError: true, message: "Creator not found" });
        }
        if (bio && typeof bio !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Bio must be a string",
            });
        }
        if (phoneNo && typeof phoneNo !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Phone No must be a string",
            });
        }
        if (location && typeof location !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Location must be a string",
            });
        }
        if (languages && typeof languages !== "object") {
            return res.status(201).json({
                isError: true,
                message: "Languages must be an array of strings",
            });
        }
        if (website && typeof website !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Website must be a string",
            });
        }
        if (social && typeof social !== "object") {
            return res.status(201).json({
                isError: true,
                message: "Social must be an object",
            });
        }
        // Update the creator info
        creator.bio = bio;
        creator.phone_number = phoneNo;
        creator.location = location;
        creator.languages = languages;
        creator.website = website;
        creator.social = social;
        yield creator.save();
        res.status(200).json({
            isError: false,
            creator,
            message: "Creator updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.updateCreator = updateCreator;
// Delete the creator information
const deleteCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.user_id;
        const creator = yield creator_model_1.default.findOne({ where: { user_id: userId } });
        if (!creator) {
            return res
                .status(404)
                .json({ isError: true, message: "Creator not found" });
        }
        yield creator.destroy();
        res.status(200).json({
            isError: false,
            message: "Creator deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.deleteCreator = deleteCreator;
// Get one creator information
const getCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const creator = yield creator_model_1.default.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "email", "verified", "logo"],
                },
            ],
        });
        if (!creator) {
            return res
                .status(404)
                .json({ isError: true, message: "Creator not found" });
        }
        res.status(200).json({ isError: false, creator });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getCreator = getCreator;
// Get all creator information
const getAllCreators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creators = yield creator_model_1.default.findAll({
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "verified", "logo"],
                },
            ],
        });
        res.status(200).json({ isError: false, creators });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getAllCreators = getAllCreators;
// Get creator information from search
const searchCreators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    try {
        const creators = yield creator_model_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { "$user.name$": { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { location: { [sequelize_1.Op.iLike]: `%${query}%` } },
                ],
            },
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "email", "verified", "logo"],
                },
            ],
        });
        res.status(200).json({ isError: false, creators });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.searchCreators = searchCreators;
