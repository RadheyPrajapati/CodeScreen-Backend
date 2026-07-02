import express from "express";
import {submission} from "../controllers/submission.controller.js"

const router = express.Router();

router.post('/', submission);

export default router;