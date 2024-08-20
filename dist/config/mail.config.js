"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer = require("nodemailer");
// Set up nodemailer transporter
exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "creatorships02@gmail.com",
        pass: process.env.email_key_password,
    },
});
