import nodemailer from "nodemailer";
import "dotenv/config";

type SendEmailParams = { to: string; subject: string; html?: string; text?: string };

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_ID, pass: process.env.EMAIL_PASSWORD },
});

export const sendEmail = async ({ to, subject, html, text }: SendEmailParams): Promise<void> => {
  await transporter.sendMail({
    from: `"CodeScreen" <${process.env.EMAIL_ID}>`,
    to,
    subject,
    html,
    text,
  });
  console.log("\nEmail Sended! to : ", to);
  
};
