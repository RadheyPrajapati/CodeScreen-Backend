import { Request, Response } from "express";
import { addFeedback, getFeedbackByInterviewId } from "../services/feedback.service.js";

export const createFeedback = async (req:Request,res:Response) => {
    try{
        const { interviewId,candidateId,feedback,rating } = req.body;
        return res.status(201).json(await addFeedback(interviewId,candidateId,feedback,rating));
    }
    catch(error:any){
        return res.status(500).json({ message:error.message });
    }
}

export const fetchFeedbackById = async (req:Request,res:Response) => {
    try{
        const interviewId = req.query.interviewId ? Number(req.query.interviewId) : Number(req.body.interviewId);
        
        if (interviewId) {
            const feed = await getFeedbackByInterviewId(interviewId);
            return res.status(200).json({ response: feed });
        }
        
        return res.status(400).json({ message: "interviewId is required" });
    }
    catch(error:any){
        return res.status(500).json({ message:error.message });
    }
}