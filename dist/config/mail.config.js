"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer = require("nodemailer");
// Set up nodemailer transporter
exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "omniplex.vercel@gmail.com",
        pass: process.env.omni_password,
    },
});
