"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middlewares_1 = require("../middlewares/authentication.middlewares");
const userRouter = express_1.default.Router();
// User Routes
userRouter.post("/register", user_controller_1.userRegister);
userRouter.post("/login", user_controller_1.userLogin);
userRouter.get("/get-user/:id", user_controller_1.getUser);
userRouter.post('/create-checkout-session', authentication_middlewares_1.verifyToken, user_controller_1.createCheckoutSession);
userRouter.put('/update-user-session', authentication_middlewares_1.verifyToken, user_controller_1.updateUserSubscription);
// userRouter.post('/create-portal-session', createPortalSession);
// userRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
exports.default = userRouter;
