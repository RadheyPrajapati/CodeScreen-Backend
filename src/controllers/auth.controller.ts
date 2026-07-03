import {Request, Response} from "express";
import {createUser, findUser, updatePassword, getCandidates} from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import { sendOtpForUpdatePassword } from "../services/user.service.js";
import { sendEmail } from "../services/email.service.js";
import bcrypt from "bcrypt";

export const registerUser = async (req:Request, res:Response) => {
    try{
        const existingUser = await findUser(req.body.email);
        if(existingUser.length==1) res.json({ msg: "email id exists!"});
        const user = await createUser(req.body);
        await sendEmail({
            to: req.body.email,
            subject: "Welcome to CodeScreen 🎉",
            text: `Hi ${req.body.name}, welcome to CodeScreen. Your account has been created successfully. Your role is ${req.body.role}.`,
            html: `
                <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">

                <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaeaea;">

                    <!-- Header -->
                    <div style="background:#111827;padding:20px;text-align:center;">
                    <h2 style="color:#ffffff;margin:0;">CodeScreen</h2>
                    </div>

                    <!-- Body -->
                    <div style="padding:30px;">

                    <h2 style="color:#111827;margin-bottom:10px;">
                        Welcome, ${req.body.name} 👋
                    </h2>

                    <p style="color:#555;font-size:14px;line-height:1.6;">
                        Your account has been successfully created on <b>CodeScreen</b>.
                    </p>

                    <!-- User Info Box -->
                    <div style="
                        margin:20px 0;
                        padding:15px;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        background:#f9fafb;
                    ">

                        <p style="margin:5px 0;color:#111827;">
                        <b>Email:</b> ${req.body.email}
                        </p>

                        <p style="margin:5px 0;color:#111827;">
                        <b>Role:</b> ${req.body.role}
                        </p>

                    </div>

                    <p style="color:#555;font-size:14px;line-height:1.6;">
                        You can now access your dashboard and start using CodeScreen services.
                    </p>

                    <p style="color:#888;font-size:12px;margin-top:20px;">
                        If this wasn’t you, please contact support immediately.
                    </p>

                    </div>

                    <!-- Footer -->
                    <div style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#777;">
                    © ${new Date().getFullYear()} CodeScreen. All rights reserved.
                    </div>

                </div>
                </div>
            `,
        });
        res.json({msg: "user registered successfully!", user});
    }
    catch(err){
        console.log(err);
    }
}

export const loginUser = async (req:Request, res:Response) => {
    try {
        const user = await findUser(req.body.email);
        if(user.length==0) res.json({ msg: "email or password is inavalid!"});

        const paylaod = {
            userId: user[0].id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role
        }

        const isMatch = await bcrypt.compare(req.body.password, user[0].password);

        if(isMatch){
            const token = jwt.sign(
                paylaod,
                process.env.JWT_SECRET!, {
                expiresIn: '1h',
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24*60*60*1000
            });

            res.json({
                msg: "user logged in successfully!",
                user:{
                id: user[0].id,
                email: user[0].email,
                name: user[0].name,
                role: user[0].role
                }
            });
        }

        res.json({msg: "email or password is inavalid!"});
    }
    catch(err) {
        console.log(err);
    }
}

export const sendOtp = async (req:Request, res:Response) => {
    try{
        const {email} = req.body;
        await sendOtpForUpdatePassword(email);
        res.json({msg: "otp sended!"});
    }
    catch(err){
        console.log(err);
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try{
        const {email, newPassword, otp} = req.body;
        const existingUser = await findUser(email);
        if(existingUser.length==0) res.json({ msg: "email id doesnot exist!"});

        const response = await updatePassword(newPassword, email, otp);
        if(response===null) res.json({msg: "Wrong OTP!"});
        res.json({msg: "Password changed successfully!"});
    }
    catch(err){
        console.log(err);
    }
}

export const listCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await getCandidates();
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}
