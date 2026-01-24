interface SendMailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare class EmailService {
    private transporter;
    constructor();
    sendMail({ to, subject, text, html }: SendMailOptions): Promise<void>;
}
export {};
//# sourceMappingURL=EmailService.d.ts.map