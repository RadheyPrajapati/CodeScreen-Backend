import { db } from "../db/index.js";
import { queBank } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import { getTableColumns } from "drizzle-orm";

const { testCases, ...queBankColumns } = getTableColumns(queBank);

type queType = {
    title: string,
    description: string,
    difficulty: "easy" | "medium" | "hard",
    inputFormat: object,
    outputFormat: string,
    constraints: Array<string>,
    examples: Array<object>,
    testCases: Array<object>,
}

export const addQuestion = async (data: queType) => {
    return await db.insert(queBank).values(data).returning();
}

export const getQuestion = async (queId: number) => {
    return (await db.select(queBankColumns).from(queBank).where(eq(queBank.id, queId)))[0];
}

export const getTestcases = async (queId: number) => {
    return (await db.select({testCases}).from(queBank).where(eq(queBank.id, queId)))[0];
}

export const getAllQuestions = async () => {
    return await db.select().from(queBank);
}
