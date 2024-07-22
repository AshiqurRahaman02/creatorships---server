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
// Create Business
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
            return res.status(201).json({
                isError: true,
                message: "About is required and must be a string",
            });
        }
        if (!industry || typeof industry !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Industry No is required and must be a string",
            });
        }
        if (!location || typeof location !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Location is required and must be a string",
            });
        }
        if (!total_employee || typeof total_employee !== "number") {
            return res.status(201).json({
                isError: true,
                message: "Total employee is required and must be a number",
            });
        }
        if (!website || typeof website !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Website is required and must be a string",
            });
        }
        if (social && typeof social !== "object") {
            return res.status(201).json({
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
// Update Business
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
            return res.status(201).json({
                isError: true,
                message: "About is required and must be a string",
            });
        }
        if (!industry || typeof industry !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Industry No is required and must be a string",
            });
        }
        if (!location || typeof location !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Location is required and must be a string",
            });
        }
        if (!total_employee || typeof total_employee !== "number") {
            return res.status(201).json({
                isError: true,
                message: "Total employee is required and must be a number",
            });
        }
        if (!website || typeof website !== "string") {
            return res.status(201).json({
                isError: true,
                message: "Website is required and must be a string",
            });
        }
        if (social && typeof social !== "object") {
            return res.status(201).json({
                isError: true,
                message: "Social must be an object",
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
// Delete Business
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
// Get one business information
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
// Get all businesses information
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
// Search Businesses
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
