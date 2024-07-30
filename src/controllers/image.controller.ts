import { Request, Response } from "express";
import cloudinary from "cloudinary";

/**
 * Uploads an image file to Cloudinary.
 *
 * @param {any} file - The image file to upload.
 * @returns {Promise<any>} - A promise that resolves with the Cloudinary upload result or rejects with an error.
 */
function uploadImageToCloudinary(file: any): Promise<any> {
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

/**
 * Handles the image upload request, uploads the image to Cloudinary, and sends the response.
 *
 * @param {Request} req - The request object containing the image file in `req.files.image`.
 * @param {any} req.files.image - The image file to upload. **Required**
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the image upload operation.
 */
export const uploadImage = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { image }: any = req.files;

		if (!image) {
			res.status(400).json({
				isError: true,
				message: "Image file is required",
			});
			return;
		}

		const imageResult = await uploadImageToCloudinary(image);

		res.status(200).json({
			isError: false,
			imageResult,
			message: "Image uploaded",
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({
			isError: true,
			message: "Error uploading image",
		});
	}
};
