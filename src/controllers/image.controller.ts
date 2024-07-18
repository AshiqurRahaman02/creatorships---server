import { Request, Response } from "express";
const cloudinary = require("cloudinary");

function uploadImageToCloudinary(file: any) {
	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(
			file.tempFilePath,
			(error: any, result: any) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			}
		);
	});
}

export const uploadImage = async (req: Request, res: Response) => {
	try {
		const { image }: any = req.files;
		const imageResult = await uploadImageToCloudinary(image);

		res.status(200).json({ isError: false, imageResult });
	} catch (error) {
		res.status(500).json({ error: "Error fetching the form" });
	}
};

