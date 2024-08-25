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
		from: "creatorships02@gmail.com",
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

const getText = (name: string) => {
	return `
	Dear ${name},

I hope this email finds you well. I'm reaching out to introduce you to Creatorships, a platform designed to bridge the gap between businesses like yours and talented creators who can help elevate your brand.

In today's competitive market, authentic and impactful promotion is key. Creatorships makes it easy for you to discover and collaborate with creators who align with your brand values and goals. Whether you're looking to boost your social media presence, create engaging content, or launch a targeted campaign, Creatorships has the right talent for you.

Join us and start connecting with creators who can bring fresh perspectives and innovative ideas to your business. It's free to sign up, and our user-friendly interface ensures that you can find the perfect match quickly and efficiently.

We would love to have you on board!

Warm regards,
Ashiqur Rahaman,
Partnership Development Specialist,
ashiqur999999@gmail.com
Creatorships
 `;
};
const getHtml = (name: string) => {
	return `
		<body style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; font-size: 16px;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #444; font-size: 22px;">Dear ${name},</h2>
        <p style="font-size: 17px;">I hope this email finds you well. I'm reaching out to introduce you to <strong>Creatorships</strong>, a platform designed to bridge the gap between businesses like yours and talented creators who can help elevate your brand.</p>
        <p style="font-size: 17px;">In today's competitive market, authentic and impactful promotion is key. Creatorships makes it easy for you to discover and collaborate with creators who align with your brand values and goals. Whether you're looking to boost your social media presence, create engaging content, or launch a targeted campaign, Creatorships has the right talent for you.</p>
        <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border-left: 4px solid #007BFF; font-size: 18px;">
            <strong>Join us</strong> and start connecting with creators who can bring fresh perspectives and innovative ideas to your business. It's free to sign up, and our user-friendly interface ensures that you can find the perfect match quickly and efficiently.
        </p>
        <p style="text-align: center; font-size: 18px;">
            <a href="https://creator-ships.vercel.app/" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 18px; color: #fff; background-color: #007BFF; border-radius: 5px; text-decoration: none;">Get Started</a>
        </p>
        <p style="font-size: 16px;">We would love to have you on board!</p>
        <p style="font-size: 16px;">Warm regards,<br>
        <strong>Ashiqur Rahaman</strong><br>
        Partnership Development Specialist<br>
        <a href="mailto:ashiqur999999@gmail.com" style="color: #007BFF; text-decoration: none; font-size: 18px;">ashiqur999999@gmail.com</a><br>
        <strong>Creatorships</strong></p>
    </div>
</body>

	`;
};

const sendColdEmail = (
	email: string,
	name: string
): Promise<{ isError: boolean; message: string }> => {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: "creatorships02@gmail.com",
			to: email,
			subject:
				"Connect with Top Creators to Boost Your Brand on Creatorships",
			text: getText(name),
			html: getHtml(name),
		};

		// Send email
		transporter.sendMail(mailOptions, (error: any, info: any) => {
			if (error) {
				console.error(error);
				resolve({
					isError: true,
					message: "Error sending email",
				});
			} else {
				resolve({
					isError: false,
					message: "Email sent",
				});
			}
		});
	});
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendBulkEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { emails = [] } = req.body;

	try {
		let count = 0;
		for (let i = 0; i < emails.length; i++) {
			let { email, name } = emails[i];

			if (email && name) {
				try {
					let response = await sendColdEmail(email, name);

					if (response.isError) {
						count++;
					}
				} catch (error) {
					console.error("Error sending email to", email, error);
					count++;
				}
			} else {
				count++;
			}

			// Introduce a delay between each email
			await delay(5000); // Delay of 5 seconds
		}

		if (count === emails.length) {
			res.status(401).json({
				isError: true,
				message: "Failed to send any emails",
			});
		} else {
			res.status(200).json({
				isError: false,
				message: `Email sent successfully to ${
					emails.length - count
				} recipients`,
			});
		}
	} catch (error) {
		res.status(500).json({
			isError: true,
			message: "Error processing bulk email request",
		});
	}
};
