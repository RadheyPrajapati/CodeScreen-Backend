import { Request, Response } from "express";
import { addInterview, changeInterviewStatus, changeAskedQues, getAllInterviews } from "../services/interview.service.js";

export const createInterview = async (req: Request, res: Response) => {
    try {
        const { interviewerId, candidateId, isoScheduledTime, meetingName, askedQue } = req.body;
        const scheduledTime = new Date(isoScheduledTime);
        const interview = await addInterview(interviewerId, candidateId, scheduledTime, meetingName, askedQue);
        return res.status(201).json({ success: true, interview });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateInterviewStatus = async (req: Request, res: Response) => {
    try {
        const { interviewId, status } = req.body;
        const interview = await changeInterviewStatus(interviewId, status);
        return res.status(200).json({ success: true, interview });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const addAskedQuestion = async (req: Request, res: Response) => {
    try {
        const { interviewId, queId } = req.body;
        const interview = await changeAskedQues(interviewId, queId);
        return res.status(200).json({ success: true, interview });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const listInterviews = async (req: Request, res: Response) => {
    try {
        const interviews = await getAllInterviews();
        return res.status(200).json(interviews);
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};