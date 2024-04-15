import { createTransport } from "nodemailer";
import { env } from "$env/dynamic/private";

const mailer = createTransport({
    host: env.EMAIL_HOST,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
    },
});

export const sendMail = (
    to: string,
    subject: string,
    text: string,
    from = env.EMAIL_FROM,
) => mailer.sendMail({ from, to, subject, text });
