import { Router } from "express";
import { createInterview, updateInterviewStatus, addAskedQuestion, listInterviews } from "../controllers/interview.controller.js";

const router = Router();

router.post("/create", createInterview);
router.patch("/status", updateInterviewStatus);
router.patch("/asked-question", addAskedQuestion);
router.get("/list", listInterviews);

export default router;