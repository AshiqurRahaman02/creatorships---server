const nodemailer = require("nodemailer");

// Set up nodemailer transporter
export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "omniplex.vercel@gmail.com",
		pass: process.env.omni_password,
	},
});
