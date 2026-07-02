import { db } from "../db/index.js";
import { user } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import { sendEmail } from "./email.service.js";
import { storeOtp, fetchOtp, deleteOtp } from "./otp.service.js";
import bcrypt from "bcrypt";

type userType = {
    name:string,
    email:string,
    password:string,
    role: "candidate" | "interviewer",
}

export const createUser = async (data:userType) => {
    const { email, password, name, role } = data;
    const hashedPassword = await bcrypt.hash(password, 3);
    return await db.insert(user).values({ email, password: hashedPassword, name, role}).returning();
};

export const findUser = async (email: string) => {
    return await db.select().from(user).where(eq(user.email, email));
}

export const sendOtpForUpdatePassword = async (email: string) => {
    const otp = await storeOtp(email);

    await sendEmail({
    to: email,
    subject: "CodeScreen - Password Update OTP",
    text: `Your OTP for password update is ${otp}. It will expire in 5 minutes.`,

    html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">

        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;">

            <!-- Header -->
            <div style="background:#111827;padding:18px;text-align:center;">
            <h2 style="color:#ffffff;margin:0;">CodeScreen</h2>
            </div>

            <!-- Body -->
            <div style="padding:30px;text-align:center;">

            <h2 style="margin-bottom:10px;color:#111827;">
                Password Update OTP
            </h2>

            <p style="color:#555;font-size:14px;">
                Use the OTP below to complete your password update. This OTP is valid for 5 minutes.
            </p>

            <!-- OTP -->
            <div style="
                font-size:30px;
                font-weight:bold;
                letter-spacing:8px;
                margin:25px 0;
                padding:12px;
                border:1px solid #ddd;
                display:inline-block;
                color:#111827;
                background:#f9fafb;
            ">
                ${otp}
            </div>

            <p style="color:#888;font-size:12px;margin-top:15px;">
                Do not share this OTP with anyone.
            </p>

            <p style="color:#999;font-size:11px;margin-top:8px;">
                If you did not request this, you can safely ignore this email.
            </p>

            </div>

        </div>
        </div>
    `,
    });
 }

export const updatePassword = async (newPassword: string, email: string, userOtp: string) => {
    const actualOtp = await fetchOtp(email);
    
    if(userOtp !== actualOtp) return null;
    await deleteOtp(email);
    return await db.update(user).set({ password : newPassword }).where(eq(user.email, email));
}

export const deleteUser = async (userId: number) => {
    await db.delete(user).where(eq(user.id, userId));
}

export const getCandidates = async () => {
    return await db.select().from(user).where(eq(user.role, 'candidate'));
}
