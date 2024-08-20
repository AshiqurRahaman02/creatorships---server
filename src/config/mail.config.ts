const nodemailer = require("nodemailer");

// Set up nodemailer transporter
export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "creatorships02@gmail.com",
		pass: process.env.email_key_password,
	},
});
