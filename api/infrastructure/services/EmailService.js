"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendMail({ to, subject, text, html }) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM, // sender address
                to,
                subject,
                text,
                html,
            });
            console.log("Message sent: %s", info.messageId);
        }
        catch (error) {
            console.error("Error sending email:", error);
            // Don't throw error to avoid leaking implementation details to user response, 
            // but in a production app you might want to handle this more gracefully.
            // For now, logging is enough as the use case returns generic success message.
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map