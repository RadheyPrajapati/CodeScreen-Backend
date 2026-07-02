import { Request, Response } from "express";
import { generateQuestionFromPrompt } from "../AI/queGenerate.js";
import { addQuestion, getQuestion, getAllQuestions } from "../services/question.service.js";

export const generateQue = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = {
      history: req.body?.history || [],

      roughQuestion: req.body?.roughQuestion || req.query?.roughQuestion,

      difficulty: req.body?.difficulty || req.query?.difficulty,

      constraintsLevel: req.body?.constraintsLevel || req.query?.constraintsLevel,

      testCaseCount: Number(req.body?.testCaseCount || req.query?.testCaseCount) || 3,
    };

    const response = await generateQuestionFromPrompt(payload);

    console.log(response);
    

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error?.message 
    });
  }
};

export const addQue = async (req:Request, res:Response) => {
  try{
    const data = { ...req.body };
    if (data.testCases && Array.isArray(data.testCases)) {
      data.testCases = data.testCases.map((tc: any, index: number) => ({
        testcaseId: Number(tc.testcaseId || tc.id || (index + 1)),
        input: String(tc.input || ''),
        output: String(tc.output || '')
      }));
    }
    const response = await addQuestion(data);
    res.json({ msg:"que added!", response});
  }
  catch(err){
    console.log(err);
  }
}

export const getQue = async (req:Request, res:Response) => {
  try{
    const response = await getQuestion(req.body.queId);
    res.json({response});
  }
  catch(err){
    console.log(err);
  }
}

export const listQues = async (req:Request, res:Response) => {
  try{
    const response = await getAllQuestions();
    res.json(response);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch question bank list" });
  }
}