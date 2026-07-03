import {supabase} from '../config/supabase.js';
import { db } from "../db/index.js";
import { resume } from "../db/schema.js";
import { eq } from 'drizzle-orm';

type resumeType = {
    id:number,
    userId:number,
    resumeUrl:string
} | null;

export const uploadPdf = async (pdfBuffer: any, userId: number): Promise<resumeType> => {

    console.log("pdf upload got!!");
    
    const { data, error } = await supabase.storage
    .from("resumes")
    .upload(`resumes/${Date.now()}.pdf`, pdfBuffer, {
        contentType: "application/pdf",
    });

    if (error){
        throw new Error("supabase uplaod pdf err : " + error.message);
    };

    return (await db.insert(resume).values({userId, resumeUrl: data.path}).returning())[0];
}

export const getPdfUrl = async (resumeId: number): Promise<string> => {
    
    const resumeData = await db.select().from(resume).where(eq(resume.id, resumeId));

    if(resumeData.length==0) throw new Error("resume id doesnot exist!");

    const path = resumeData[0].resumeUrl;

    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path , 60*60*12 );

    if (error) throw new Error(error.message);

    return data.signedUrl;
}

export const deletePdf = async (resumeId: number) => {
    const resumeData = await db.select().from(resume).where(eq(resume.id, resumeId));

    console.log(resumeId, typeof resumeId);
    

    await db.delete(resume).where(eq(resume.id, resumeId));

    if(resumeData.length==0) throw new Error("resume id doesnot exist!");

    const path = resumeData[0].resumeUrl;

    const { data, error } = await supabase.storage.from("resumes").remove([path]);

    if(error) throw new Error(error.message);
}

export const getResumeByUserId = async (userId: number): Promise<resumeType> => {
    const results = await db.select().from(resume).where(eq(resume.userId, userId));
    return results[0] || null;
}
