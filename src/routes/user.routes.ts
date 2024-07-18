import express from "express";
import {
	userRegister,
	userLogin,
	getUser,
	createCheckoutSession,
	createPortalSession,
	handleStripeWebhook,
	updateUserSubscription,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/authentication.middlewares";

const userRouter = express.Router();

// User Routes
userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/get-user/:id", getUser);


userRouter.post('/create-checkout-session',verifyToken, createCheckoutSession);
userRouter.put('/update-user-session',verifyToken, updateUserSubscription);
// userRouter.post('/create-portal-session', createPortalSession);
// userRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default userRouter;
