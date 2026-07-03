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
import dns from "node:dns";
import nodemailer from "nodemailer";
import "dotenv/config";

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

type SendEmailParams = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
  logger: true,
  debug: true,
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
    console.log("Node Version:", process.version);
    console.log("To:", to);
    console.log("From:", process.env.EMAIL_ID);

    const info = await transporter.sendMail({
      from: `"CodeScreen" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("=================================");
  } catch (error: any) {
    console.error("=================================");
    console.error("❌ Failed to send email");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Command:", error?.command);
    console.error("Response:", error?.response);
    console.error("Stack:", error?.stack);
    console.error("=================================");
    throw error;
  }
};
