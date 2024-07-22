import { Request, Response } from "express";
import Application from "../models/application.model";
import { Op } from "sequelize";
import BusinessInfo from "../models/business.model";
import User from "../models/user.model";
import CreatorInfo from "../models/creator.model";

// Create Application
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

		console.log(req.body, userId);

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

// Update Application
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

// Delete Application
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

// Get user applications
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
				.json({ isError: true, message: "Application not found" });
		}

		res.status(200).json({ isError: false, applications });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Get Application by ID
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

// Get All Applications
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

// Search Businesses
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
