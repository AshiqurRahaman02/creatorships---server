import { Request, Response } from "express";
import Application from "../models/application.model";
import { Op } from "sequelize";
import BusinessInfo from "../models/business.model";
import User from "../models/user.model";
import CreatorInfo from "../models/creator.model";

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
export const createApplication = async (req: Request, res: Response) => {
	const {
		heading,
		pricing,
		endDate,
		experience,
		about,
		languages,
		benefits,
		no_of_openings,
	} = req.body;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const newApplication = await Application.create({
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
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

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
export const updateApplication = async (req: Request, res: Response) => {
	const { id } = req.params;
	const {
		heading,
		pricing,
		endDate,
		experience,
		about,
		languages,
		benefits,
		no_of_openings,
	} = req.body;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const application = await Application.findByPk(id);

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

		await application.save();

		res.status(200).json({
			isError: false,
			message: "Application updated successfully",
			application,
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Deletes an application by ID.
 *
 * @param {Request} req - The request object containing application ID in `req.params`.
 * @param {string} [req.params.id] - The ID of the application to be deleted. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response indicating successful deletion.
 */
export const deleteApplication = async (req: Request, res: Response) => {
	const { id } = req.params; // Application ID

	try {
		const application = await Application.findByPk(id);

		if (!application) {
			return res
				.status(404)
				.json({ isError: true, message: "Application not found" });
		}

		await application.destroy();

		res.status(200).json({
			isError: false,
			message: "Application deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Retrieves all applications for the authenticated user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of applications for the authenticated user.
 */
export const getUserApplications = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const applications = await Application.findAll({
			where: { userId },
		});

		if (!applications) {
			return res
				.status(404)
				.json({ isError: true, message: "Applications not found" });
		}

		res.status(200).json({ isError: false, applications });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Retrieves an application by ID.
 *
 * @param {Request} req - The request object containing application ID in `req.params`.
 * @param {string} [req.params.id] - The ID of the application to retrieve. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the details of the requested application and associated user details.
 */
export const getApplication = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const application = await Application.findOne({
			where: { id: id },
			include: [
				{
					model: User,
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
			details = await CreatorInfo.findOne({
				where: { user_id: application.userId },
			});
		} else {
			details = await BusinessInfo.findOne({
				where: { user_id: application.userId },
			});
		}

		res.status(200).json({ isError: false, application, details });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Retrieves all applications.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of all applications.
 */
export const getAllApplications = async (req: Request, res: Response) => {
	try {
		const applications = await Application.findAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["user_id", "name", "verified", "logo"],
				},
			],
		});

		res.status(200).json({ isError: false, applications });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Searches for applications based on a query string.
 *
 * @param {Request} req - The request object containing the search query in `req.params`.
 * @param {string} [req.params.query] - The query string to search for applications. Required.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of applications that match the search query.
 */
export const searchApplications = async (req: Request, res: Response) => {
	const { query } = req.params;

	try {
		const applications = await Application.findAll({
			include: [
				{
					model: BusinessInfo,
					as: "business",
					attributes: ["id", "user_id", "industry", "total_employee"],
					include: [
						{
							model: User,
							as: "user",
							attributes: ["user_id", "name", "verified", "logo"],
							where: {
								name: { [Op.iLike]: `%${query}%` },
							},
						},
					],
				},
			],
			where: {
				[Op.or]: [{ heading: { [Op.iLike]: `%${query}%` } }],
			},
		});

		res.status(200).json({ isError: false, applications });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};
