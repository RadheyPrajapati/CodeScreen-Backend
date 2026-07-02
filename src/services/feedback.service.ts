import { db } from "../db/index.js";
import { feedback } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const addFeedback = async (
    interviewId:number,
    candidateId:number,
    feedbackText:string,
    rating:number
) => {
    return await db.insert(feedback).values({
        interviewId,
        candidateId,
        feedback: feedbackText,
        rating
    }).returning();
}

export const getFeedbackById = async (feedbackId:number) => {
    return await db.select().from(feedback).where(eq(feedback.id, feedbackId));
}

export const getFeedbackByInterviewId = async (interviewId:number) => {
    const results = await db.select().from(feedback).where(eq(feedback.interviewId, interviewId));
    return results[0] || null;
}