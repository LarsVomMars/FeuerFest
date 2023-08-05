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

// TODO: Mail Templates
export async function sendMail(
    to: string,
    subject: string,
    text: string,
    from = env.EMAIL_FROM,
) {
    await mailer.sendMail({
        from,
        to,
        subject,
        text,
    });
}

export async function sendMailWithHTML(
    to: string,
    subject: string,
    html: string,
    from = env.EMAIL_FROM,
) {
    await mailer.sendMail({
        from,
        to,
        subject,
        html,
    });
}
