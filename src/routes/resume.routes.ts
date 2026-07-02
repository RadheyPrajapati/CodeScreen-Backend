import express from "express";
import multer from "multer";
import { uplaodPdf, getPdfUrl, deletePdf, getMyResume, getUserResume } from "../controllers/resume.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// frontend data : { resume : pdf } that resume pdf set as req.file by multer
router.post('/upload-resume', verifyToken, upload.single("resume"), uplaodPdf);
router.get('/get-resumeUrl', verifyToken, getPdfUrl);
router.get('/delete-resume', verifyToken, deletePdf);
router.get('/my-resume', verifyToken, getMyResume);
router.get('/user-resume', verifyToken, getUserResume);

export default router;