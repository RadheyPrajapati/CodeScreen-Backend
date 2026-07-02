import express from "express";
import { registerUser, loginUser, changePassword, sendOtp, listCandidates } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changePassword", changePassword);
router.post("/sendPasswordOtp", sendOtp);
router.get("/candidates", listCandidates);

export default router;