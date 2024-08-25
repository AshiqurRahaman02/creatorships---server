import express from "express";
import { sendBulkEmail, sendMail } from "../controllers/mail.controller";

const mailRouter = express.Router();

// Send mail
mailRouter.post("/send-mail", sendMail)

mailRouter.post("/send-bulk-mail", sendBulkEmail)

export default mailRouter