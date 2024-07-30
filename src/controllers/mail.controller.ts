import { Request, Response } from "express";
import { transporter } from "../config/mail.config";

/**
 * Sends an email using the provided request data.
 *
 * @param {Request} req - The request object containing email details.
 * @param {string} req.body.to - The recipient's email address. **Required**
 * @param {string} req.body.subject - The subject of the email. **Required**
 * @param {string} req.body.text - The plain text body of the email. **Required**
 * @param {string} req.body.html - The HTML body of the email. **Required**
 * @param {Response} res - The response object to send the result.
 * @returns {void} - Sends a JSON response with the result of the email sending operation.
 */
export const sendMail = (req: Request, res: Response): void => {
	const { to, subject, text, html } = req.body;

	if (!to || typeof to !== "string") {
		res.status(400).json({
			isError: true,
			message: "Recipient email (to) is required and must be a string",
		});
		return;
	}

	if (!subject || typeof subject !== "string") {
		res.status(400).json({
			isError: true,
			message: "Email subject is required and must be a string",
		});
		return;
	}

	if (!text || typeof text !== "string") {
		res.status(400).json({
			isError: true,
			message: "Email text body is required and must be a string",
		});
		return;
	}

	if (!html || typeof html !== "string") {
		res.status(400).json({
			isError: true,
			message: "Email HTML body is required and must be a string",
		});
		return;
	}

	// Set up email options
	const mailOptions = {
		from: "omniplex.vercel@gmail.com",
		to,
		subject,
		text,
		html,
	};

	// Send email
	transporter.sendMail(mailOptions, (error: any, info: any) => {
		if (error) {
			console.error(error);
			res.status(500).json({
				isError: true,
				message: "Error sending email",
			});
		} else {
			res.status(200).json({ isError: false, message: "Email sent" });
		}
	});
};
