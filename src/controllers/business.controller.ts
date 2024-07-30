import { Request, Response } from "express";
import { Op } from "sequelize";
import BusinessInfo from "../models/business.model";
import User from "../models/user.model";

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
export const createBusiness = async (req: Request, res: Response) => {
	const { location, about, industry, total_employee, website, social } =
		req.body;

	try {
		const userId = req.user?.user_id;

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

		const newBusinessInfo = await BusinessInfo.create({
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
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

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
export const updateBusiness = async (req: Request, res: Response) => {
	const { location, about, industry, total_employee, website, social } =
		req.body;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const businessInfo = await BusinessInfo.findOne({
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

		await businessInfo.save();

		res.status(200).json({
			isError: false,
			message: "Business updated successfully",
			business: businessInfo,
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Deletes a business information entry.
 *
 * @param {Request} req - The request object containing the business ID in `req.params`.
 * @param {number} [req.user.user_id] - The ID of the user requesting the deletion. Required in the request.
 * @param {number} [req.params.id] - The ID of the business to be deleted. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the business deletion operation.
 */
export const deleteBusiness = async (req: Request, res: Response) => {
	const { id } = req.params; // BusinessInfo ID

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const businessInfo = await BusinessInfo.findOne({
			where: { user_id: userId },
		});

		if (!businessInfo) {
			return res
				.status(404)
				.json({ isError: true, message: "Business not found" });
		}

		await businessInfo.destroy();

		res.status(200).json({
			isError: false,
			message: "Business deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Retrieves information of a specific business.
 *
 * @param {Request} req - The request object containing the business ID in `req.params`.
 * @param {number} [req.params.userId] - The ID of the user whose business information is to be retrieved. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the business information.
 */
export const getBusiness = async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		const businessInfo = await BusinessInfo.findOne({
			where: { user_id: userId },
			include: [
				{
					model: User,
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
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};
/**
 * Retrieves information of all businesses.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of all businesses.
 */
export const getAllBusiness = async (req: Request, res: Response) => {
	try {
		const businesses = await BusinessInfo.findAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["user_id", "name", "verified", "logo"],
				},
			],
		});

		res.status(200).json({ isError: false, businesses });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Searches for businesses based on a query string.
 *
 * @param {Request} req - The request object containing the search query in `req.params`.
 * @param {string} [req.params.query] - The query string to search for businesses. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the list of businesses that match the search query.
 */
export const searchBusiness = async (req: Request, res: Response) => {
	const { query } = req.params;

	try {
		const businesses = await BusinessInfo.findAll({
			where: {
				[Op.or]: [
					{ "$user.name$": { [Op.iLike]: `%${query}%` } },
					{ location: { [Op.iLike]: `%${query}%` } },
					{ about: { [Op.iLike]: `%${query}%` } },
					{ industry: { [Op.iLike]: `%${query}%` } },
				],
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["user_id", "name", "email", "verified", "logo"],
				},
			],
		});

		res.status(200).json({ isError: false, businesses });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};
