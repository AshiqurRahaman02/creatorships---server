import { Request, Response, NextFunction } from "express";
import { transporter } from "../config/mail.config";

export const sendMail = (req: Request, res: Response, next: NextFunction) => {
	const {  to, subject, text, html } = req.body;

	// Set up email options
	const mailOptions = {
		from: "omniplex.vercel@gmail.com",
		to,
		subject,
		text,
        html
	};

	// Send email
	transporter.sendMail(mailOptions, (error: any, info: any) => {
		if (error) {
			console.error(error);
			res.status(500).json({
				isError: true,
				massage: "Error sending email",
			});
		} else {
			console.log("Email sent: " + info.response);
			res.status(200).json({ isError: false, massage: "Email sent" });
		}
	});
};
