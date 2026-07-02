import { Router } from "express";
import { createFeedback, fetchFeedbackById } from "../controllers/feedback.controller.js";

const router = Router();

router.post("/create", createFeedback);
router.get("/get", fetchFeedbackById);

export default router;