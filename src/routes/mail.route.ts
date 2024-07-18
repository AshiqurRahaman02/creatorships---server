import express from "express";
import { sendMail } from "../controllers/mail.controller";

const mailRouter = express.Router();

// Send mail
mailRouter.post("/send-mail", sendMail)

export default mailRouter