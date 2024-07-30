import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import stripePackage from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe_secret_key = process.env.stripe_secret_key || null;
if (!stripe_secret_key) {
	throw new Error("Please provide a stripe secret key");
}
const stripe = new stripePackage(stripe_secret_key);
const YOUR_DOMAIN = process.env.public_domain || "http://localhost:3000";

// // Extend the Request type to include the user property
// declare global {
// 	namespace Express {
// 	  interface Request {
// 		redirect: string | null;
// 	  }
// 	}
//   }

const jwtSecretKey: string = process.env.jwt_secret_key!;

/**
 * Retrieves a user by ID.
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @returns {Promise<void>} A promise that resolves to sending a response with the user data or an error message.
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.id;

	try {
		const user = await User.findOne({
			where: { user_id: userId },
			attributes: ["user_id", "name", "email", "logo", "type", "verified"],
		});

		if (!user) {
			res.status(404).json({ isError: true, message: "User not found" });
			return;
		}

		res.status(200).json({ isError: false, user });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Registers a new user.
 * @param {Request} req The request object containing user registration details.
 * @param {Response} res The response object to send the registration result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the registration result.
 */
export const userRegister = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email, password, name, type } = req.body;
	try {
		if (!name || typeof name !== "string") {
			res.status(201).json({
				isError: true,
				message: "Name is required and must be a string",
			});
			return;
		}
		if (!email || typeof email !== "string") {
			res.status(201).json({
				isError: true,
				message: "Email is required and must be a string",
			});
			return;
		}
		if (!password || typeof password !== "string") {
			res.status(201).json({
				isError: true,
				message: "Password is required and must be a string",
			});
			return;
		}
		if (!type || (type && type !== "creator" && type !== "business")) {
			console.log(type);
			res.status(201).json({
				isError: true,
				message: "Type should be creator or business",
			});
			return;
		}

		let user = await User.findOne({ where: { email } });
		if (user) {
			res.status(201).json({
				isError: true,
				message: "Email already used in this website.",
			});
			return;
		}
		const hash = await bcrypt.hash(password, 5);
		const newUser = await User.create({ email, password: hash, name, type });
		res.status(201).json({
			isError: false,
			message: "Welcome to our website",
			token: jwt.sign({ userId: newUser.user_id }, jwtSecretKey),
			user: newUser,
		});
	} catch (error: any) {
		res.status(404).json({ isError: true, message: error.message });
	}
};

/**
 * Logs in a user.
 * @param {Request} req The request object containing user login details.
 * @param {Response} res The response object to send the login result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the login result.
 */
export const userLogin = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ where: { email } });
		if (!user) {
			res.status(404).json({ isError: true, message: "User not found" });
			return;
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			res.status(200).json({
				isError: false,
				message: "Welcome Back to our website",
				token: jwt.sign({ userId: user.user_id }, jwtSecretKey),
				user,
			});
		} else {
			res.status(401).json({
				isError: true,
				message: "Invalid password",
			});
		}
	} catch (error: any) {
		console.log(error);
		res.status(404).json({ isError: true, message: error.message });
	}
};

/**
 * Updates a user's logo.
 * @param {Request} req The request object containing the new logo link.
 * @param {Response} res The response object to send the update result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the update result.
 */
export const updateUserLogo = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { link } = req.body;
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		await User.update(
			{
				logo: link,
			},
			{
				where: { user_id: userId },
			}
		);

		// Retrieve the updated user
		const updatedUser = await User.findOne({
			where: { user_id: userId },
		});

		if (!updatedUser) {
			res.status(404).json({
				isError: true,
				message: "User not found.",
			});
			return;
		}

		// Send the response with the updated user
		res.status(200).json({
			isError: false,
			message: "Logo uploaded successfully.",
			user: updatedUser,
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Creates a checkout session.
 * @param {Request} req The request object containing the plan type and product ID.
 * @param {Response} res The response object to send the session creation result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the session creation result.
 */
export const createCheckoutSession = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { planType, productId } = req.body;

		const session = await stripe.checkout.sessions.create({
			billing_address_collection: "auto",
			line_items: [
				{
					price: productId,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${YOUR_DOMAIN}/plan/?success=true&session_id={CHECKOUT_SESSION_ID}&plan_type=${planType}`,
			cancel_url: `${YOUR_DOMAIN}/plan/?canceled=true`,
		});

		console.log(session.id);

		if (session.url) {
			res.status(200).json({
				isError: false,
				message: "session created",
				url: session.url,
			});
		} else {
			res.status(500).json({
				isError: true,
				message: "Failed to create checkout session URL.",
			});
		}
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

/**
 * Updates a user's subscription details.
 * @param {Request} req The request object containing the session ID and plan type.
 * @param {Response} res The response object to send the update result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the update result.
 */
export const updateUserSubscription = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { session_id, plan_type } = req.body;
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
			return;
		}

		const checkoutSession = await stripe.checkout.sessions.retrieve(
			session_id
		);

		const stripeCustomerId = checkoutSession.customer as string;
		const stripeSubscriptionId = checkoutSession.subscription as string;
		const subscriptionStatus = checkoutSession.status as string;
		const subscriptionPlan = plan_type;

		if (!stripeSubscriptionId) {
			res.status(400).json({
				isError: true,
				message: "No subscription found in the session.",
			});
			return;
		}

		await User.update(
			{
				stripeCustomerId,
				stripeSubscriptionId,
				subscriptionStatus,
				subscriptionPlan,
			},
			{
				where: { user_id: userId },
			}
		);

		// Retrieve the updated user
		const updatedUser = await User.findOne({
			where: { user_id: userId },
		});

		if (!updatedUser) {
			res.status(404).json({
				isError: true,
				message: "User not found.",
			});
			return;
		}

		// Send the response with the updated user
		res.status(200).json({
			isError: false,
			message: "Subscription details updated successfully.",
			user: updatedUser,
		});
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Create Portal Session
export const createPortalSession = async (req: Request, res: Response) => {
	try {
		const { session_id } = req.body;
		const checkoutSession = await stripe.checkout.sessions.retrieve(
			session_id
		);
		const returnUrl = YOUR_DOMAIN;

		const portalSession = await stripe.billingPortal.sessions.create({
			customer: checkoutSession.customer as string,
			return_url: returnUrl,
		});

		res.redirect(303, portalSession.url);
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

// Webhook Handler
export const handleStripeWebhook = async (req: Request, res: Response) => {
	let event = req.body;
	const endpointSecret = "whsec_12345";

	if (endpointSecret) {
		const signature = req.headers["stripe-signature"];

		if (!signature) {
			return res.status(500).json({
				isError: true,
				message: "Failed to create checkout session URL.",
			});
		}

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				endpointSecret
			);
		} catch (err: any) {
			console.log(`⚠️  Webhook signature verification failed.`, err.message);
			return res.sendStatus(400);
		}
	}

	let subscription;
	let status;

	switch (event.type) {
		case "customer.subscription.trial_will_end":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Subscription status is ${status}.`);
			break;
		case "customer.subscription.deleted":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Subscription status is ${status}.`);
			break;
		case "customer.subscription.created":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Subscription status is ${status}.`);
			break;
		case "customer.subscription.updated":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Subscription status is ${status}.`);
			break;
		case "entitlements.active_entitlement_summary.updated":
			subscription = event.data.object;
			console.log(`Active entitlement summary updated for ${subscription}.`);
			break;
		default:
			console.log(`Unhandled event type ${event.type}.`);
	}

	res.send();
};
