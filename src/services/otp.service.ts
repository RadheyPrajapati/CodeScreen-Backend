import { emit } from "cluster";
import redis from "../config/redis.js";
import crypto from "crypto";

export const storeOtp = async (email: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const key = `otp:${email.toLowerCase()}`;

  await redis.set(key, otp, {EX: 300});

  return otp;
}

export const fetchOtp = async (email: string) => {
  const key = `otp:${email.toLowerCase()}`;

  const otp = await redis.get(key);

  return otp;
}

export const deleteOtp = async (email: string) => {
  await redis.del(`otp:${email.toLowerCase()}`);
}
