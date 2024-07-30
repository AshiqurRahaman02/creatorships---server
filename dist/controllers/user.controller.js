"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createPortalSession = exports.updateUserSubscription = exports.createCheckoutSession = exports.updateUserLogo = exports.userLogin = exports.userRegister = exports.getUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe_secret_key = process.env.stripe_secret_key || null;
if (!stripe_secret_key) {
    throw new Error("Please provide a stripe secret key");
}
const stripe = new stripe_1.default(stripe_secret_key);
const YOUR_DOMAIN = process.env.public_domain || "http://localhost:3000";
// // Extend the Request type to include the user property
// declare global {
// 	namespace Express {
// 	  interface Request {
// 		redirect: string | null;
// 	  }
// 	}
//   }
const jwtSecretKey = process.env.jwt_secret_key;
/**
 * Retrieves a user by ID.
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @returns {Promise<void>} A promise that resolves to sending a response with the user data or an error message.
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield user_model_1.default.findOne({
            where: { user_id: userId },
            attributes: ["user_id", "name", "email", "logo", "type", "verified"],
        });
        if (!user) {
            res.status(404).json({ isError: true, message: "User not found" });
            return;
        }
        res.status(200).json({ isError: false, user });
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.getUser = getUser;
/**
 * Registers a new user.
 * @param {Request} req The request object containing user registration details.
 * @param {Response} res The response object to send the registration result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the registration result.
 */
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let user = yield user_model_1.default.findOne({ where: { email } });
        if (user) {
            res.status(201).json({
                isError: true,
                message: "Email already used in this website.",
            });
            return;
        }
        const hash = yield bcrypt_1.default.hash(password, 5);
        const newUser = yield user_model_1.default.create({ email, password: hash, name, type });
        res.status(201).json({
            isError: false,
            message: "Welcome to our website",
            token: jsonwebtoken_1.default.sign({ userId: newUser.user_id }, jwtSecretKey),
            user: newUser,
        });
    }
    catch (error) {
        res.status(404).json({ isError: true, message: error.message });
    }
});
exports.userRegister = userRegister;
/**
 * Logs in a user.
 * @param {Request} req The request object containing user login details.
 * @param {Response} res The response object to send the login result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the login result.
 */
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let user = yield user_model_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ isError: true, message: "User not found" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (match) {
            res.status(200).json({
                isError: false,
                message: "Welcome Back to our website",
                token: jsonwebtoken_1.default.sign({ userId: user.user_id }, jwtSecretKey),
                user,
            });
        }
        else {
            res.status(401).json({
                isError: true,
                message: "Invalid password",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ isError: true, message: error.message });
    }
});
exports.userLogin = userLogin;
/**
 * Updates a user's logo.
 * @param {Request} req The request object containing the new logo link.
 * @param {Response} res The response object to send the update result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the update result.
 */
const updateUserLogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { link } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        yield user_model_1.default.update({
            logo: link,
        }, {
            where: { user_id: userId },
        });
        // Retrieve the updated user
        const updatedUser = yield user_model_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.updateUserLogo = updateUserLogo;
/**
 * Creates a checkout session.
 * @param {Request} req The request object containing the plan type and product ID.
 * @param {Response} res The response object to send the session creation result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the session creation result.
 */
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planType, productId } = req.body;
        const session = yield stripe.checkout.sessions.create({
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
        }
        else {
            res.status(500).json({
                isError: true,
                message: "Failed to create checkout session URL.",
            });
        }
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.createCheckoutSession = createCheckoutSession;
/**
 * Updates a user's subscription details.
 * @param {Request} req The request object containing the session ID and plan type.
 * @param {Response} res The response object to send the update result.
 * @returns {Promise<void>} A promise that resolves to sending a response with the update result.
 */
const updateUserSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { session_id, plan_type } = req.body;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(500).json({
                isError: true,
                message: "Internal Server Error",
            });
            return;
        }
        const checkoutSession = yield stripe.checkout.sessions.retrieve(session_id);
        const stripeCustomerId = checkoutSession.customer;
        const stripeSubscriptionId = checkoutSession.subscription;
        const subscriptionStatus = checkoutSession.status;
        const subscriptionPlan = plan_type;
        if (!stripeSubscriptionId) {
            res.status(400).json({
                isError: true,
                message: "No subscription found in the session.",
            });
            return;
        }
        yield user_model_1.default.update({
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus,
            subscriptionPlan,
        }, {
            where: { user_id: userId },
        });
        // Retrieve the updated user
        const updatedUser = yield user_model_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.updateUserSubscription = updateUserSubscription;
// Create Portal Session
const createPortalSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.body;
        const checkoutSession = yield stripe.checkout.sessions.retrieve(session_id);
        const returnUrl = YOUR_DOMAIN;
        const portalSession = yield stripe.billingPortal.sessions.create({
            customer: checkoutSession.customer,
            return_url: returnUrl,
        });
        res.redirect(303, portalSession.url);
    }
    catch (error) {
        res.status(500).json({ isError: true, message: error.message });
    }
});
exports.createPortalSession = createPortalSession;
// Webhook Handler
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        }
        catch (err) {
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
});
exports.handleStripeWebhook = handleStripeWebhook;
