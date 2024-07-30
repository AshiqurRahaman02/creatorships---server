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
exports.searchBusiness = exports.getAllBusiness = exports.getBusiness = exports.deleteBusiness = exports.updateBusiness = exports.createBusiness = void 0;
const sequelize_1 = require("sequelize");
const business_model_1 = __importDefault(require("../models/business.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Creates a new business information entry.
 *
 * @param {Request} req - The request object containing business details in `req.body`.
 * @param {number} [req.user.user_id] - The ID of the user creating the business. Required in the request.
 * @param {string} [req.body.location] - The location of the business. Required in the request.
 * @param {string} [req.body.about] - A description about the business. Required in the request.
 * @param {string} [req.body.industry] - The industry the business belongs to. Required in the request.
 * @param {number} [req.body.total_employee] - The total number of employees in the business. Required in the request.
 * @param {string} [req.body.website] - The website URL of the business. Required in the request.
 * @param {object[]} [req.body.social] - An array of social media links associated with the business. Optional.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the business creation operation.
 */
const createBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { location, about, industry, total_employee, website, social } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        if (!about || typeof about !== "string") {
            return res.status(400).json({
                isError: true,
                message: "About is required and must be a string",
            });
        }
        if (!industry || typeof industry !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Industry is required and must be a string",
            });
        }
        if (!location || typeof location !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Location is required and must be a string",
            });
        }
        if (typeof total_employee !== "number") {
            return res.status(400).json({
                isError: true,
                message: "Total employee must be a number",
            });
        }
        if (!website || typeof website !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Website is required and must be a string",
            });
        }
        if (social && !Array.isArray(social)) {
            return res.status(400).json({
                isError: true,
                message: "Social must be an array of objects",
            });
        }
        const newBusinessInfo = yield business_model_1.default.create({
            user_id: userId,
            location,
            about,
            industry,
            total_employee,
            website,
            social,
        });
        res.status(201).json({
            isError: false,
            message: "Business created successfully",
            business: newBusinessInfo,
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.createBusiness = createBusiness;
/**
 * Updates an existing business information entry.
 *
 * @param {Request} req - The request object containing updated business details in `req.body`.
 * @param {number} [req.user.user_id] - The ID of the user updating the business. Required in the request.
 * @param {string} [req.body.location] - The location of the business. Required in the request.
 * @param {string} [req.body.about] - A description about the business. Required in the request.
 * @param {string} [req.body.industry] - The industry the business belongs to. Required in the request.
 * @param {number} [req.body.total_employee] - The total number of employees in the business. Required in the request.
 * @param {string} [req.body.website] - The website URL of the business. Required in the request.
 * @param {object[]} [req.body.social] - An array of social media links associated with the business. Optional.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the business update operation.
 */
const updateBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { location, about, industry, total_employee, website, social } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const businessInfo = yield business_model_1.default.findOne({
            where: { user_id: userId },
        });
        if (!businessInfo) {
            return res
                .status(404)
                .json({ isError: true, message: "Business not found" });
        }
        if (!about || typeof about !== "string") {
            return res.status(400).json({
                isError: true,
                message: "About is required and must be a string",
            });
        }
        if (!industry || typeof industry !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Industry is required and must be a string",
            });
        }
        if (!location || typeof location !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Location is required and must be a string",
            });
        }
        if (typeof total_employee !== "number") {
            return res.status(400).json({
                isError: true,
                message: "Total employee must be a number",
            });
        }
        if (!website || typeof website !== "string") {
            return res.status(400).json({
                isError: true,
                message: "Website is required and must be a string",
            });
        }
        if (social && !Array.isArray(social)) {
            return res.status(400).json({
                isError: true,
                message: "Social must be an array of objects",
            });
        }
        businessInfo.location = location;
        businessInfo.about = about;
        businessInfo.industry = industry;
        businessInfo.total_employee = total_employee;
        businessInfo.website = website;
        businessInfo.social = social;
        yield businessInfo.save();
        res.status(200).json({
            isError: false,
            message: "Business updated successfully",
            business: businessInfo,
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.updateBusiness = updateBusiness;
/**
 * Deletes a business information entry.
 *
 * @param {Request} req - The request object containing the business ID in `req.params`.
 * @param {number} [req.user.user_id] - The ID of the user requesting the deletion. Required in the request.
 * @param {number} [req.params.id] - The ID of the business to be deleted. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the business deletion operation.
 */
const deleteBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // BusinessInfo ID
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const businessInfo = yield business_model_1.default.findOne({
            where: { user_id: userId },
        });
        if (!businessInfo) {
            return res
                .status(404)
                .json({ isError: true, message: "Business not found" });
        }
        yield businessInfo.destroy();
        res.status(200).json({
            isError: false,
            message: "Business deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.deleteBusiness = deleteBusiness;
/**
 * Retrieves information of a specific business.
 *
 * @param {Request} req - The request object containing the business ID in `req.params`.
 * @param {number} [req.params.userId] - The ID of the user whose business information is to be retrieved. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the business information.
 */
const getBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const businessInfo = yield business_model_1.default.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "email", "verified", "logo"],
                },
            ],
        });
        if (!businessInfo) {
            return res
                .status(404)
                .json({ isError: true, message: "Business not found" });
        }
        res.status(200).json({ isError: false, business: businessInfo });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getBusiness = getBusiness;
/**
 * Retrieves information of all businesses.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of all businesses.
 */
const getAllBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businesses = yield business_model_1.default.findAll({
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "verified", "logo"],
                },
            ],
        });
        res.status(200).json({ isError: false, businesses });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getAllBusiness = getAllBusiness;
/**
 * Searches for businesses based on a query string.
 *
 * @param {Request} req - The request object containing the search query in `req.params`.
 * @param {string} [req.params.query] - The query string to search for businesses. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of businesses that match the search query.
 */
const searchBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    try {
        const businesses = yield business_model_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { "$user.name$": { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { location: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { about: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { industry: { [sequelize_1.Op.iLike]: `%${query}%` } },
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
        res.status(200).json({ isError: false, businesses });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.searchBusiness = searchBusiness;
