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

export const sendHtmlMail = (
    to: string,
    subject: string,
    html: string,
    from = env.EMAIL_FROM,
) => mailer.sendMail({ from, to, subject, html });

export const sendActivationMail = (to: string, activationLink: string) =>
    sendHtmlMail(
        to,
        "Activate your account",
        `Click <a href="${activationLink}">here</a> to activate your account.`,
    );
