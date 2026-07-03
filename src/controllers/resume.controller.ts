import {Request, Response} from "express";
import {uploadPdf as uplaodPdfService, getPdfUrl as getPdfUrlService, deletePdf as deletePdfService, getResumeByUserId as getResumeByUserIdService} from "../services/resume.service.js";

export const uplaodPdf = async (req:Request, res:Response) => {
    try{
        console.log("AT controller! pdf upload req arised !");
        const pdfBuffer = req.file?.buffer;

        if(!pdfBuffer) {
            return res.status(400).json({
                msg: "PDF not found",
            });
        }

        if(req.file?.mimetype !== "application/pdf") { 
            res.status(400).json({ message: "Only PDF files are allowed" });
            return;
        }

        const sizeMB = req.file!.size / (1024 * 1024);//mb

        if(sizeMB > 1) {
            res.status(400).json({msg: "file size should be under 1MB"});
            return;
        }

        const response = await uplaodPdfService(pdfBuffer, req.user!.userId);

        res.json({ msg: "Resume uploaded successfully!", response});
    }
    catch(err: any){
        console.log(err);
        res.status(500).json({ message: err.message });
    }

}

export const getPdfUrl = async (req:Request, res:Response) => {
    try{
        const resumeId = req.query.resumeId ? Number(req.query.resumeId) : Number(req.body.resumeId);

        const response = await getPdfUrlService(resumeId);

        res.json({msg: "got resume url successfully!", resumeUrl: response});
    }
    catch(err: any){
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export const deletePdf = async (req:Request, res:Response) => {
    try{
        const resumeId = req.query.resumeId ? Number(req.query.resumeId) : Number(req.body.resumeId);
        await deletePdfService(resumeId);
        
        res.json({msg: "resume deleted successfully!"});
    }
    catch(err: any){
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export const getMyResume = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const resumeData = await getResumeByUserIdService(userId);
        if (!resumeData) {
            return res.status(404).json({ message: "No resume found for this user" });
        }
        
        const signedUrl = await getPdfUrlService(resumeData.id);
        
        return res.json({
            message: "Resume retrieved successfully",
            resume: {
                id: resumeData.id,
                userId: resumeData.userId,
                resumeUrl: resumeData.resumeUrl,
                signedUrl
            }
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

export const getUserResume = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId || req.body.userId);
        if (!userId) {
            return res.status(400).json({ message: "userId parameter is required" });
        }
        
        const resumeData = await getResumeByUserIdService(userId);
        if (!resumeData) {
            return res.status(404).json({ message: "No resume found for this user" });
        }
        
        const signedUrl = await getPdfUrlService(resumeData.id);
        
        return res.json({
            message: "Resume retrieved successfully",
            resume: {
                id: resumeData.id,
                userId: resumeData.userId,
                resumeUrl: resumeData.resumeUrl,
                signedUrl
            }
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}
