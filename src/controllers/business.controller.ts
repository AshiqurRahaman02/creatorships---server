import { Request, Response } from "express";
import { Op } from "sequelize";
import BusinessInfo from "../models/business.model";
import User from "../models/user.model";

// Create Business
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

// Update Business
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

// Delete Business
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

// Get one business information
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

// Get all businesses information
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

// Search Businesses
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
