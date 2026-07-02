import {Request, Response} from "express";
import {submitSolution} from "../services/submission.service.js"

export const submission = async (req:Request, res:Response) => {
    try{
        const {code, language, queId, candidateId, interviewId} = req.body;
        const response = await submitSolution(code, language, queId, candidateId, interviewId);
        res.json(response);
    }
    catch(err){
        console.log(err);
    }

}
