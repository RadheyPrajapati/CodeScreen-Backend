import express from "express";
import {addQue, generateQue, getQue, listQues} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/generateQuestion", generateQue);
router.get("/getQuestion", getQue);
router.post("/addQuestion", addQue);
router.get("/list", listQues);

export default router;