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
const application_model_1 = __importDefault(require("../models/application.model"));
dotenv_1.default.config();
/**
 * Creates a new creator profile.
 *
 * @param {Request} req - The request object containing the creator information in `req.body`.
 * @param {string} [req.body.bio] - The bio of the creator. Optional.
 * @param {string} [req.body.phoneNo] - The phone number of the creator. Optional.
 * @param {string} [req.body.location] - The location of the creator. Optional.
 * @param {string[]} [req.body.languages] - The languages spoken by the creator. Optional.
 * @param {string} [req.body.website] - The website of the creator. Optional.
 * @param {object} [req.body.social] - The social media links of the creator. Optional.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the creator creation operation.
 */
const createCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bio, phoneNo, location, languages, website, social } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        if (typeof userId !== "number") {
            res.status(201).json({
                isError: true,
                message: "User ID must be a number",
            });
            return;
        }
        if (bio && typeof bio !== "string") {
            res.status(201).json({
                isError: true,
                message: "Bio must be a string",
            });
            return;
        }
        if (phoneNo && typeof phoneNo !== "string") {
            res.status(201).json({
                isError: true,
                message: "Phone No must be a string",
            });
            return;
        }
        if (location && typeof location !== "string") {
            res.status(201).json({
                isError: true,
                message: "Location must be a string",
            });
            return;
        }
        if (languages && !Array.isArray(languages)) {
            res.status(201).json({
                isError: true,
                message: "Languages must be an array of strings",
            });
            return;
        }
        if (website && typeof website !== "string") {
            res.status(201).json({
                isError: true,
                message: "Website must be a string",
            });
            return;
        }
        if (social && typeof social !== "object") {
            res.status(201).json({
                isError: true,
                message: "Social must be an object",
            });
            return;
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
        res.status(201).json({
            isError: false,
            creator: newCreatorInfo,
            message: "Creator created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.createCreator = createCreator;
/**
 * Updates the creator profile.
 *
 * @param {Request} req - The request object containing the creator information in `req.body`.
 * @param {string} [req.body.bio] - The bio of the creator. Optional.
 * @param {string} [req.body.phoneNo] - The phone number of the creator. Optional.
 * @param {string} [req.body.location] - The location of the creator. Optional.
 * @param {string[]} [req.body.languages] - The languages spoken by the creator. Optional.
 * @param {string} [req.body.website] - The website of the creator. Optional.
 * @param {object} [req.body.social] - The social media links of the creator. Optional.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the creator update operation.
 */
const updateCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bio, phoneNo, location, languages, website, social } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        const creator = yield creator_model_1.default.findOne({ where: { user_id: userId } });
        if (!creator) {
            res.status(404).json({
                isError: true,
                message: "Creator not found",
            });
            return;
        }
        if (bio && typeof bio !== "string") {
            res.status(201).json({
                isError: true,
                message: "Bio must be a string",
            });
            return;
        }
        if (phoneNo && typeof phoneNo !== "string") {
            res.status(201).json({
                isError: true,
                message: "Phone No must be a string",
            });
            return;
        }
        if (location && typeof location !== "string") {
            res.status(201).json({
                isError: true,
                message: "Location must be a string",
            });
            return;
        }
        if (languages && !Array.isArray(languages)) {
            res.status(201).json({
                isError: true,
                message: "Languages must be an array of strings",
            });
            return;
        }
        if (website && typeof website !== "string") {
            res.status(201).json({
                isError: true,
                message: "Website must be a string",
            });
            return;
        }
        if (social && typeof social !== "object") {
            res.status(201).json({
                isError: true,
                message: "Social must be an object",
            });
            return;
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
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.updateCreator = updateCreator;
/**
 * Deletes the creator profile.
 *
 * @param {Request} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the creator deletion operation.
 */
const deleteCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        const creator = yield creator_model_1.default.findOne({ where: { user_id: userId } });
        if (!creator) {
            res.status(404).json({
                isError: true,
                message: "Creator not found",
            });
            return;
        }
        yield creator.destroy();
        res.status(200).json({
            isError: false,
            message: "Creator deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.deleteCreator = deleteCreator;
/**
 * Get a single creator's information.
 *
 * @param {Request} req - The request object containing user parameters.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the creator's information.
 */
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
            res.status(404).json({
                isError: true,
                message: "Creator not found",
            });
            return;
        }
        const applications = yield application_model_1.default.findAll({
            where: { userId },
            attributes: [
                "heading",
                "pricing",
                "endDate",
                "experience",
                "languages",
            ],
        });
        res.status(200).json({
            isError: false,
            creator,
            applications,
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.getCreator = getCreator;
/**
 * Get all creators' information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with all creators' information.
 */
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
        res.status(200).json({
            isError: false,
            creators,
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.getAllCreators = getAllCreators;
/**
 * Search for creators based on query parameters.
 *
 * @param {Request} req - The request object containing search query parameters.
 * @param {string} [req.params.query] - The query string to search for creator. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the search results.
 */
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
        res.status(200).json({
            isError: false,
            creators,
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: error.message,
        });
    }
});
exports.searchCreators = searchCreators;
