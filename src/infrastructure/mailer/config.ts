import AppConfig from "../../../src/shared/config";
import nodemailer from "nodemailer";

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: AppConfig.EMAIL_HOST,
    port: AppConfig.EMAIL_PORT,
    auth: {
        user: AppConfig.EMAIL_USER,
        pass: AppConfig.EMAIL_PASS
    }
} as nodemailer.TransportOptions)