import AppConfig from "../../../src/shared/config";
import nodemailer from "nodemailer";
import { transporter } from "./config";
import { SendMailerDto } from "../../domain/dtos/mailer/sendMailer.dto";

export class Mailer {
    private readonly transporter: nodemailer.Transporter;
    private readonly mailOptions: nodemailer.SendMailOptions;

    constructor() {
        this.transporter = transporter;
        this.mailOptions = {
            from: AppConfig.FROM_EMAIL,
            to: "",
            subject: "",
            cc: [],
            bcc: [],
            html: ""
        };
    }

    async sendMail(sendMailerDto: SendMailerDto): Promise<boolean>{
        try {
            this.mailOptions.to = sendMailerDto.to;
            this.mailOptions.subject = sendMailerDto.subject;
            this.mailOptions.cc = sendMailerDto.cc ?? [];
            this.mailOptions.bcc = sendMailerDto.cco ?? [];
            this.mailOptions.html = sendMailerDto.body;

            await this.transporter.sendMail(this.mailOptions);
            return true;
        } catch (error) {
            console.error("Failed to send email", error);
            return false;
        }
    }
}