import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { interview, queBank, user } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import { sendEmail } from "./email.service.js";

export const addInterview =  async (interviewerId:number, candidateId:number, scheduledTime:Date, meetingName: string, askedQue?: number[]) => {
    const roomId = nanoid(10);

    const response = await db.insert(interview).values({interviewerId, candidateId, roomId, scheduledTime, meetingName, askedQue: askedQue || []}).returning();

    const candidate = await db.select().from(user).where(eq(user.id, candidateId));
    const candidateName = candidate[0].name;
    const candidateEmail = candidate[0].email;

    const interviewer = await db.select().from(user).where(eq(user.id, interviewerId));
    const interviewerName = interviewer[0].name;
    const interviewerEmail = interviewer[0].email;
    
    await sendEmail({
    to: candidateEmail,
    subject: "Interview Scheduled",
    html: `
        <p>Dear ${candidateName},</p>

        <p>Your interview has been scheduled.</p>

        <p>
        <strong>Meeting:</strong> ${meetingName}<br/>
        <strong>Scheduled Time:</strong> ${scheduledTime}<br/>
        <strong>Interviewer Name:</strong> ${interviewerName}<br/>
        </p>

        <p>We look forward to speaking with you.</p>

        <p>Regards,<br/>CodeScreen Team</p>
    `,
    text: `
    Dear ${candidateName},

    Your interview has been scheduled.

    Meeting: ${meetingName}
    Scheduled Time: ${scheduledTime}

    We look forward to speaking with you.

    Regards,
    CodeScreen Team
    `,
    });

    await sendEmail({
    to: interviewerEmail,
    subject: "Interview Assigned",
    html: `
        <p>Dear ${interviewerName},</p>

        <p>An interview has been assigned to you.</p>

        <p>
        <strong>Meeting:</strong> ${meetingName}<br/>
        <strong>Scheduled Time:</strong> ${scheduledTime}<br/>
        <strong>Candidate Name:</strong> ${candidateName}<br/>
        </p>

        <p>Please be available at the scheduled time.</p>

        <p>Regards,<br/>CodeScreen Team</p>
    `,
    text: `
    Dear ${interviewerName},

    An interview has been assigned to you.

    Meeting: ${meetingName}
    Scheduled Time: ${scheduledTime}

    Please be available at the scheduled time.

    Regards,
    CodeScreen Team
    `,
    });

    return response;
}

export const changeInterviewStatus = async (interviewId:number, status:("scheduled"|"ongoing"|"completed")) => {
    return await db.update(interview).set({status}).where(eq(interview.id,interviewId)).returning();
}

export const changeAskedQues = async (interviewId:number, queId:number) => {
    const queData = await db.select().from(queBank).where(eq(queBank.id, queId));
    if(queData.length==0) throw Error('Question Id is invalid!');
    else{
        let askedQueList:Array<number>|null = ((await db.select({ askedQue: interview.askedQue }).from(interview).where(eq(interview.id, interviewId)))[0]).askedQue;
        if(askedQueList===null) askedQueList = [queId];
        else{
            for(const questionId of askedQueList){
                if(queId==questionId) throw Error('Dupliacte question id!');
            }
            askedQueList.push(queId);
        }
        return await db.update(interview).set({ askedQue: askedQueList }).where(eq(interview.id, interviewId)).returning();
    }
}

export const getAllInterviews = async () => {
    const interviews = await db.select().from(interview);
    const users = await db.select().from(user);
    
    return interviews.map(i => {
        const interviewer = users.find(u => u.id === i.interviewerId);
        const candidate = users.find(u => u.id === i.candidateId);
        return {
            id: i.id,
            interviewerId: i.interviewerId,
            interviewerName: interviewer ? interviewer.name : 'Interviewer',
            interviewerEmail: interviewer ? interviewer.email : 'interviewer@codescreen.com',
            candidateId: i.candidateId,
            candidateName: candidate ? candidate.name : 'Candidate',
            candidateEmail: candidate ? candidate.email : 'candidate@codescreen.com',
            status: i.status,
            scheduledTime: i.scheduledTime,
            roomId: i.roomId,
            meetingName: i.meetingName,
            askedQue: i.askedQue || []
        };
    });
}




