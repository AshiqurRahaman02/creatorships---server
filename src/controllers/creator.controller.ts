import { Request, Response } from "express";
import { Op } from "sequelize";
import CreatorInfo from "../models/creator.model";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

// Create a new creator
export const createCreator = async (req: Request, res: Response) => {
	const { bio, phoneNo, location, languages, website, social } = req.body;

	try {
		const userId = req.user?.user_id;

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
		const newCreatorInfo = await CreatorInfo.create({
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
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Update creator information
export const updateCreator = async (req: Request, res: Response) => {
	const { bio, phoneNo, location, languages, website, social } = req.body;

	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}
		const creator = await CreatorInfo.findOne({ where: { user_id: userId } });
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

		await creator.save();
		res.status(200).json({
			isError: false,
			creator,
			message: "Creator updated successfully",
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Delete the creator information
export const deleteCreator = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.user_id;
		const creator = await CreatorInfo.findOne({ where: { user_id: userId } });
		if (!creator) {
			return res
				.status(404)
				.json({ isError: true, message: "Creator not found" });
		}

		await creator.destroy();
		res.status(200).json({
			isError: false,
			message: "Creator deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Get one creator information
export const getCreator = async (req: Request, res: Response) => {
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
			return res
				.status(404)
				.json({ isError: true, message: "Creator not found" });
		}

		res.status(200).json({ isError: false, creator });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Get all creator information
export const getAllCreators = async (req: Request, res: Response) => {
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
		res.status(200).json({ isError: false, creators });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Get creator information from search
export const searchCreators = async (req: Request, res: Response) => {
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

		res.status(200).json({ isError: false, creators });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};
