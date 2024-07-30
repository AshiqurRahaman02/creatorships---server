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
exports.searchApplications = exports.getAllApplications = exports.getApplication = exports.getUserApplications = exports.deleteApplication = exports.updateApplication = exports.createApplication = void 0;
const application_model_1 = __importDefault(require("../models/application.model"));
const sequelize_1 = require("sequelize");
const business_model_1 = __importDefault(require("../models/business.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const creator_model_1 = __importDefault(require("../models/creator.model"));
/**
 * Creates a new application.
 *
 * @param {Request} req - The request object containing application details in `req.body`.
 * @param {string} req.body.heading - The heading of the application. Required.
 * @param {number} req.body.pricing - The pricing of the application. Required.
 * @param {Date} req.body.endDate - The end date of the application. Required.
 * @param {string} req.body.experience - The experience required for the application. Required.
 * @param {string} req.body.about - The description of the application. Required.
 * @param {string[]} req.body.languages - The languages required for the application. Required.
 * @param {string[]} req.body.benefits - The benefits provided by the application. Required.
 * @param {number} req.body.no_of_openings - The number of openings available. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the details of the created application.
 */
const createApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { heading, pricing, endDate, experience, about, languages, benefits, no_of_openings, } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const newApplication = yield application_model_1.default.create({
            userId,
            heading,
            pricing,
            endDate,
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
/**
 * Updates an existing application by ID.
 *
 * @param {Request} req - The request object containing application ID in `req.params` and updated details in `req.body`.
 * @param {string} [req.params.id] - The ID of the application to be updated. Required.
 * @param {string} [req.body.heading] - The new heading of the application. Optional.
 * @param {number} [req.body.pricing] - The new pricing of the application. Optional.
 * @param {Date} [req.body.endDate] - The new end date of the application. Optional.
 * @param {string} [req.body.experience] - The new experience required. Optional.
 * @param {string} [req.body.about] - The new description of the application. Optional.
 * @param {string[]} [req.body.languages] - The new languages required. Optional.
 * @param {string[]} [req.body.benefits] - The new benefits provided. Optional.
 * @param {number} [req.body.no_of_openings] - The new number of openings. Optional.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the details of the updated application.
 */
const updateApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { heading, pricing, endDate, experience, about, languages, benefits, no_of_openings, } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const application = yield application_model_1.default.findByPk(id);
        if (!application) {
            return res
                .status(404)
                .json({ isError: true, message: "Application not found" });
        }
        application.userId = userId;
        application.heading = heading;
        application.pricing = pricing;
        application.endDate = endDate;
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
/**
 * Deletes an application by ID.
 *
 * @param {Request} req - The request object containing application ID in `req.params`.
 * @param {string} [req.params.id] - The ID of the application to be deleted. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response indicating successful deletion.
 */
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
/**
 * Retrieves all applications for the authenticated user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of applications for the authenticated user.
 */
const getUserApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
        }
        const applications = yield application_model_1.default.findAll({
            where: { userId },
        });
        if (!applications) {
            return res
                .status(404)
                .json({ isError: true, message: "Applications not found" });
        }
        res.status(200).json({ isError: false, applications });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getUserApplications = getUserApplications;
/**
 * Retrieves an application by ID.
 *
 * @param {Request} req - The request object containing application ID in `req.params`.
 * @param {string} [req.params.id] - The ID of the application to retrieve. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the details of the requested application and associated user details.
 */
const getApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const application = yield application_model_1.default.findOne({
            where: { id: id },
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: [
                        "user_id",
                        "name",
                        "email",
                        "type",
                        "verified",
                        "logo",
                    ],
                },
            ],
        });
        if (!application) {
            return res
                .status(404)
                .json({ isError: true, message: "Application not found" });
        }
        let details;
        if (application.user.type === "creator") {
            details = yield creator_model_1.default.findOne({
                where: { user_id: application.userId },
            });
        }
        else {
            details = yield business_model_1.default.findOne({
                where: { user_id: application.userId },
            });
        }
        res.status(200).json({ isError: false, application, details });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getApplication = getApplication;
/**
 * Retrieves all applications.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of all applications.
 */
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield application_model_1.default.findAll({
            include: [
                {
                    model: user_model_1.default,
                    as: "user",
                    attributes: ["user_id", "name", "verified", "logo"],
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
/**
 * Searches for applications based on a query string.
 *
 * @param {Request} req - The request object containing the search query in `req.params`.
 * @param {string} [req.params.query] - The query string to search for applications. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of applications that match the search query.
 */
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
