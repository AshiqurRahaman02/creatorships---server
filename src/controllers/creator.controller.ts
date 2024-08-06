import { Request, Response } from "express";
import { Op } from "sequelize";
import CreatorInfo from "../models/creator.model";
import User from "../models/user.model";
import dotenv from "dotenv";
import Application from "../models/application.model";

dotenv.config();

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
export const createCreator = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { bio, phoneNo, location, languages, website, social } = req.body;

	try {
		const userId = req.user?.user_id;

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
		const newCreatorInfo = await CreatorInfo.create({
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
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};

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
export const updateCreator = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { bio, phoneNo, location, languages, website, social } = req.body;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		const creator = await CreatorInfo.findOne({ where: { user_id: userId } });

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

		await creator.save();

		res.status(200).json({
			isError: false,
			creator,
			message: "Creator updated successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};

/**
 * Deletes the creator profile.
 *
 * @param {Request} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the creator deletion operation.
 */
export const deleteCreator = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		const creator = await CreatorInfo.findOne({ where: { user_id: userId } });

		if (!creator) {
			res.status(404).json({
				isError: true,
				message: "Creator not found",
			});
			return;
		}

		await creator.destroy();
		res.status(200).json({
			isError: false,
			message: "Creator deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};

/**
 * Get a single creator's information.
 *
 * @param {Request} req - The request object containing user parameters.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the creator's information.
 */
export const getCreator = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { userId } = req.params;

	try {
		const creator = await CreatorInfo.findOne({
			where: { user_id: userId },
			include: [
				{
					model: User,
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

		const applications = await Application.findAll({
			where: { userId },
			attributes: [
				"heading",
				"pricing",
				"endDate",
				"languages",
			],
		});

		res.status(200).json({
			isError: false,
			creator,
			applications,
		});
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};

/**
 * Get all creators' information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with all creators' information.
 */
export const getAllCreators = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const creators = await CreatorInfo.findAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["user_id", "name", "verified", "logo"],
				},
			],
		});

		res.status(200).json({
			isError: false,
			creators,
		});
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};

/**
 * Search for creators based on query parameters.
 *
 * @param {Request} req - The request object containing search query parameters.
 * @param {string} [req.params.query] - The query string to search for creator. Required in the request.
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the search results.
 */
export const searchCreators = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { query } = req.params;

	try {
		const creators = await CreatorInfo.findAll({
			where: {
				[Op.or]: [
					{ "$user.name$": { [Op.iLike]: `%${query}%` } },
					{ location: { [Op.iLike]: `%${query}%` } },
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

		res.status(200).json({
			isError: false,
			creators,
		});
	} catch (error: any) {
		res.status(500).json({
			isError: true,
			message: error.message,
		});
	}
};
