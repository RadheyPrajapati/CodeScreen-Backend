// import nodemailer from "nodemailer";
// import "dotenv/config";

// type SendEmailParams = { to: string; subject: string; html?: string; text?: string };

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.EMAIL_ID, pass: process.env.EMAIL_PASSWORD },
// });

// export const sendEmail = async ({ to, subject, html, text }: SendEmailParams): Promise<void> => {
//   await transporter.sendMail({
//     from: `"CodeScreen" <${process.env.EMAIL_ID}>`,
//     to,
//     subject,
//     html,
//     text,
//   });
//   console.log("\nEmail Sended! to : ", to);
  
// };

import nodemailer from "nodemailer";
import "dotenv/config";

type SendEmailParams = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

// Validate environment variables
if (!process.env.EMAIL_ID || !process.env.EMAIL_PASSWORD) {
  throw new Error(
    "EMAIL_ID or EMAIL_PASSWORD is missing. Please check your environment variables."
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<void> => {
  try {
    console.log("=================================");
    console.log("Preparing to send email...");
    console.log("To:", to);
    console.log("From:", process.env.EMAIL_ID);

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP connection verified.");

    const info = await transporter.sendMail({
      from: `"CodeScreen" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("Failed to send email.");
    console.error(error);
    console.error("=================================");
    throw error;
  }
};
