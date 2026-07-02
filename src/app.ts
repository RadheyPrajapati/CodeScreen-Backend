import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js"; 
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/question.routes.js";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import interviewRoutes from "./routes/interview.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/question", aiRoutes);
app.use("/resume", resumeRoutes);
app.use("/submission", submissionRoutes);
app.use("/interview", interviewRoutes);
app.use("/feedback", feedbackRoutes);


export default app;
