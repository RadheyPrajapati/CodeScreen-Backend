import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JwtPayload } from "../types/auth.types.js";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  try {
    const token = req.cookies?.token;

    if(!token) {
      res.status(401).json({ message: "No token",});
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET! ) as JwtPayload;
    req.user = decoded;
    next();

  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(401).json({ message: err.message,});
      return;
    }

    res.status(401).json({message: "Invalid token",});
  }
};