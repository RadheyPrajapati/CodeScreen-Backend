import { ai } from "../config/gemini.js";
import { Type } from "@google/genai";

/* ================= SYSTEM PROMPT ================= */

export const questionSystemInstruction = `
You are an expert Data Structures & Algorithms interview question generator.

Generate professional coding interview questions similar to:
- LeetCode
- Codeforces
- CodeChef
- HackerRank

GENERAL RULES

- Generate one complete coding question.
- Return ONLY valid JSON.
- Follow the provided response schema exactly.
- Generate exactly the requested number of test cases.
- Generate at least 2 examples.
- The question should be solvable.
- Constraints should match the requested difficulty.
- All outputs must be mathematically correct.

========================
INPUT FORMAT RULES
========================

The "inputFormat" field must describe exactly how stdin is structured.

Example:

[
"First line contains integer N.",
"Second line contains N integers."
]

Do NOT use variable names like input1, input2.

========================
EXAMPLES & TEST CASE RULES
========================

IMPORTANT:

The "input" field represents the EXACT RAW STDIN that will be passed directly into an online judge (JDoodle).

It MUST be usable directly as stdin WITHOUT ANY MODIFICATION.

Preserve every newline.

Preserve every required space.

Never include:

- Input:
- Output:
- N =
- Array =
- quotes
- markdown
- JSON arrays
- brackets
- commas unless actually required by stdin
- explanations inside input

GOOD:

{
  "input":"5\\n1 2 3 4 5",
  "output":"15"
}

GOOD:

{
  "input":"10\\n20",
  "output":"30"
}

GOOD:

{
  "input":"2\\n5\\n1 2 3 4 5\\n3\\n10 20 30",
  "output":"15\\n60"
}

BAD:

N = 5

BAD:

Input:
5
1 2 3

BAD:

[5,1,2,3]

BAD:

{
"A":5,
"B":7
}

========================
OUTPUT RULES
========================

The "output" field must contain the EXACT stdout.

No extra spaces.

No labels.

No explanations.

No markdown.

========================
VALIDATION
========================

Before returning the response:

For EVERY example:

1. Simulate reading stdin.
2. Solve the problem.
3. Verify output.

For EVERY hidden test case:

1. Simulate reading stdin.
2. Solve the problem.
3. Verify output.

Return ONLY verified examples and test cases.
`;

/* ================= RESPONSE SCHEMA ================= */

export const questionSchema = {
  type: Type.OBJECT,

  properties: {
    title: {
      type: Type.STRING,
    },

    description: {
      type: Type.STRING,
    },

    difficulty: {
      type: Type.STRING,
    },

    inputFormat: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    outputFormat: {
      type: Type.STRING,
    },

    constraints: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    examples: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          input: {
            type: Type.STRING,
          },

          output: {
            type: Type.STRING,
          },

          explanation: {
            type: Type.STRING,
          },
        },

        required: [
          "input",
          "output",
          "explanation",
        ],
      },
    },

    testCases: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          input: {
            type: Type.STRING,
          },

          output: {
            type: Type.STRING,
          },
        },

        required: [
          "input",
          "output",
        ],
      },
    },
  },

  required: [
    "title",
    "description",
    "difficulty",
    "inputFormat",
    "outputFormat",
    "constraints",
    "examples",
    "testCases",
  ],
};

/* ================= MAIN FUNCTION ================= */

export const generateQuestionFromPrompt = async ({
  history = [],
  roughQuestion,
  difficulty,
  constraintsLevel,
  testCaseCount,
}: {
  history?: any[];
  roughQuestion: string;
  difficulty: string;
  constraintsLevel: string;
  testCaseCount: number;
}) => {
  const prompt = `
Generate one professional coding interview question.

Topic:
${roughQuestion}

Difficulty:
${difficulty}

Constraint Level:
${constraintsLevel}

Generate exactly ${testCaseCount} hidden test cases.

Requirements:

- Professional title
- Detailed problem statement
- Proper input format
- Proper output format
- Appropriate constraints
- Minimum 2 worked examples
- Exactly ${testCaseCount} hidden test cases
- Every example and hidden test case must contain raw stdin and expected stdout.
- The hidden test cases will be executed directly by an online judge using:

stdin = testCase.input

Therefore the input string MUST already contain the exact newlines and spaces required by the problem.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: [
      ...history,
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],

    config: {
      systemInstruction: questionSystemInstruction,
      responseMimeType: "application/json",
      responseSchema: questionSchema,
      temperature: 0.3,
    },
  });

  if (!response.text) {
    throw new Error("AI response text is undefined");
  }

  const question = JSON.parse(response.text);

  return {
    success: true,
    question,
  };
};