import { Request, Response } from "express";
import Application from "../models/application.model";
import { Op } from "sequelize";
import BusinessInfo from "../models/business.model";
import User from "../models/user.model";

// Create Application
export const createApplication = async (req: Request, res: Response) => {
	const {
		businessId,
		heading,
		pricing,
		start,
		experience,
		about,
		languages,
		benefits,
		no_of_openings,
	} = req.body;

	try {
		const newApplication = await Application.create({
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
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Update Application
export const updateApplication = async (req: Request, res: Response) => {
	const { id } = req.params;
	const {
		businessId,
		heading,
		pricing,
		start,
		experience,
		about,
		languages,
		benefits,
		no_of_openings,
	} = req.body;

	try {
		const application = await Application.findByPk(id);

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

// Get Application by ID
export const getApplication = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const application = await Application.findOne({
			where: { id: id },
			include: [
				{
					model: BusinessInfo,
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
							model: User,
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
					model: BusinessInfo,
					as: "business",
					attributes: ["id", "user_id", "industry", "total_employee"],
					include: [
						{
							model: User,
							as: "user",
							attributes: ["user_id", "name", "verified", "logo"],
						},
					],
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
