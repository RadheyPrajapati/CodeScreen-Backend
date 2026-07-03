import { getTestcases } from "./question.service.js";
import { db } from "../db/index.js";
import { submission } from "../db/schema.js";

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

interface JDoodleResult {
    output: string;
    error: string | null;
    cpuTime: string;
    memory: string;
}

interface TestCase {
    testcaseId: number;
    input: string;
    output: string;
}

interface TestCaseResult {
    testcaseId: number;
    testcaseResult: JDoodleResult;
    status: "passed" | "failed";
}

const normalize = (text: unknown): string =>
    String(text ?? "")
        .replace(/\r/g, "")
        .trimEnd();

const executeCode = async (
    code: string,
    language: string,
    stdin: string
): Promise<JDoodleResult> => {
    const response = await fetch(JDOODLE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: code,
            language,
            versionIndex: "0",
            stdin,
        }),
    });

    if (!response.ok) {
        throw new Error(`JDoodle API Error: ${response.status}`);
    }

    const result = await response.json();

    return {
        output: result.output ?? "",
        error: result.error ?? null,
        cpuTime: result.cpuTime ?? "0",
        memory: result.memory ?? "0",
    };
};

export const submitSolution = async (
    code: string,
    language: string,
    queId: number,
    candidateId: number,
    interviewId: number
) => {
    console.log("QUE_ID", queId);
    console.log("language:" language);
    const { testCases } = (await getTestcases(queId)) as {
        testCases: TestCase[];
    };
    
    const results: TestCaseResult[] = [];

    let passedTestCases = 0;
    let totalTime = 0;
    let totalMemory = 0;
    let overallStatus: "passed" | "failed" = "passed";

    for (const testcase of testCases) {
        const executionResult = await executeCode(
            code,
            language,
            testcase.input
        );

        const passed =
            !executionResult.error &&
            normalize(executionResult.output) ===
                normalize(testcase.output);

        if (passed) {
            passedTestCases++;
        } else {
            overallStatus = "failed";
        }

        totalTime += Number(executionResult.cpuTime);
        totalMemory += Number(executionResult.memory);

        results.push({
            testcaseId: testcase.testcaseId,
            testcaseResult: executionResult,
            status: passed ? "passed" : "failed",
        });
    }

    const averageTime =
        results.length > 0 ? totalTime / results.length : 0;

    const averageMemory =
        results.length > 0 ? totalMemory / results.length : 0;

    await db.insert(submission).values({
        status: overallStatus,
        code,
        candidateId,
        interviewId,
        timeTaken: averageTime,
        spaceTaken: averageMemory,
    });

    return {
        results,
        noOfPassedTestCases: passedTestCases,
        totalTestCases: results.length,
        status: overallStatus,
    };
};
