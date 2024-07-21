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

export const getUser = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const user = await User.findByPk(userId);

		if (!user) {
			return res
				.status(404)
				.json({ isError: true, message: "User not found" });
		}

		res.status(200).json({ isError: false, user });
	} catch (error: any) {
		res.status(500).json({ isError: true, message: error.message });
	}
};

export const userRegister = async (req: Request, res: Response) => {
	const { email, password, name, type } = req.body;
	try {
		if (!name || typeof name !== "string") {
			return res.status(201).json({
				isError: true,
				message: "Name is required and must be a string",
			});
		}
		if (!email || typeof email !== "string") {
			return res.status(201).json({
				isError: true,
				message: "Email is required and must be a string",
			});
		}
		if (!password || typeof password !== "string") {
			return res.status(201).json({
				isError: true,
				message: "Password is required and must be a string",
			});
		}
		if (!type || (type && type !== "creator" && type !== "business")) {
			console.log(type);
			return res.status(201).json({
				isError: true,
				message: "Type should be creator or business",
			});
		}

		let user = await User.findOne({ where: { email } });
		if (user) {
			return res.status(201).json({
				isError: true,
				message: "Email already used in this website.",
			});
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

export const userLogin = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ where: { email } });
		if (!user) {
			return res
				.status(404)
				.json({ isError: true, message: "User not found" });
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

export const updateUserLogo = async (req: Request, res: Response) => {
	const { link } = req.body;
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
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
			return res.status(404).json({
				isError: true,
				message: "User not found.",
			});
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

// Create Checkout Session
export const createCheckoutSession = async (req: Request, res: Response) => {
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

export const updateUserSubscription = async (req: Request, res: Response) => {
	const { session_id, plan_type } = req.body;
	try {
		const userId = req.user?.user_id;

		if (!userId) {
			return res.status(500).json({
				isError: true,
				message: "Internal Server Error",
			});
		}

		const checkoutSession = await stripe.checkout.sessions.retrieve(
			session_id
		);

		const stripeCustomerId = checkoutSession.customer as string;
		const stripeSubscriptionId = checkoutSession.subscription as string;
		const subscriptionStatus = checkoutSession.status as string;
		const subscriptionPlan = plan_type;

		if (!stripeSubscriptionId) {
			return res.status(400).json({
				isError: true,
				message: "No subscription found in the session.",
			});
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
			return res.status(404).json({
				isError: true,
				message: "User not found.",
			});
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
