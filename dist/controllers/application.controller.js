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
exports.searchApplications = exports.getAllApplications = exports.getApplication = exports.deleteApplication = exports.updateApplication = exports.createApplication = void 0;
const application_model_1 = __importDefault(require("../models/application.model"));
const sequelize_1 = require("sequelize");
const business_model_1 = __importDefault(require("../models/business.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Create Application
const createApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, heading, pricing, start, experience, about, languages, benefits, no_of_openings, } = req.body;
    try {
        const newApplication = yield application_model_1.default.create({
            businessId,
            heading,
            pricing,
            start,
            experience,
            about,
            languages,
            benefits,
            no_of_openings,
        });
        res.status(201).json({
            isError: false,
            message: "Application created successfully",
            application: newApplication,
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.createApplication = createApplication;
// Update Application
const updateApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { businessId, heading, pricing, start, experience, about, languages, benefits, no_of_openings, } = req.body;
    try {
        const application = yield application_model_1.default.findByPk(id);
        if (!application) {
            return res
                .status(404)
                .json({ isError: true, message: "Application not found" });
        }
        application.businessId = businessId;
        application.heading = heading;
        application.pricing = pricing;
        application.start = start;
        application.experience = experience;
        application.about = about;
        application.languages = languages;
        application.benefits = benefits;
        application.no_of_openings = no_of_openings;
        yield application.save();
        res.status(200).json({
            isError: false,
            message: "Application updated successfully",
            application,
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.updateApplication = updateApplication;
// Delete Application
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Application ID
    try {
        const application = yield application_model_1.default.findByPk(id);
        if (!application) {
            return res
                .status(404)
                .json({ isError: true, message: "Application not found" });
        }
        yield application.destroy();
        res.status(200).json({
            isError: false,
            message: "Application deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.deleteApplication = deleteApplication;
// Get Application by ID
const getApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const application = yield application_model_1.default.findOne({
            where: { id: id },
            include: [
                {
                    model: business_model_1.default,
                    as: "business",
                    attributes: [
                        "id",
                        "user_id",
                        "about",
                        "location",
                        "website",
                        "social",
                        "industry",
                        "total_employee",
                    ],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["user_id", "name", "verified", "logo"],
                        },
                    ],
                },
            ],
        });
        if (!application) {
            return res
                .status(404)
                .json({ isError: true, message: "Application not found" });
        }
        res.status(200).json({ isError: false, application });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getApplication = getApplication;
// Get All Applications
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield application_model_1.default.findAll({
            include: [
                {
                    model: business_model_1.default,
                    as: "business",
                    attributes: ["id", "user_id", "industry", "total_employee"],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["user_id", "name", "verified", "logo"],
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ isError: false, applications });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getAllApplications = getAllApplications;
// Search Businesses
const searchApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    try {
        const applications = yield application_model_1.default.findAll({
            include: [
                {
                    model: business_model_1.default,
                    as: "business",
                    attributes: ["id", "user_id", "industry", "total_employee"],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["user_id", "name", "verified", "logo"],
                            where: {
                                name: { [sequelize_1.Op.iLike]: `%${query}%` },
                            },
                        },
                    ],
                },
            ],
            where: {
                [sequelize_1.Op.or]: [{ heading: { [sequelize_1.Op.iLike]: `%${query}%` } }],
            },
        });
        res.status(200).json({ isError: false, applications });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.searchApplications = searchApplications;
