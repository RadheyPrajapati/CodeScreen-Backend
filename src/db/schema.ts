import { pgTable, serial, jsonb, varchar, timestamp, pgEnum, integer, text, real } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ['candidate', 'interviewer']);
export const interviewStatusEnum = pgEnum("interviewStatus", ["scheduled", "ongoing", "completed"]);
export const difficultyEnum = pgEnum("difficulty", ["easy","medium","hard"]);
export const submissionStatusEnum = pgEnum("subStatus", ['passed','failed']);

export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length:100}).notNull(),
    email: varchar("email", {length:150}).notNull().unique(),
    password: text("password").notNull(),
    role: roleEnum("role").default("candidate"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const resume = pgTable("resume", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id),
    resumeUrl: text("resume_url").notNull(),
});

export const interview = pgTable("interview", {
    id: serial("id").primaryKey(),
    interviewerId: integer("interviewer_id").notNull().references(() => user.id),
    candidateId: integer("candidate_id").notNull().references(() => user.id),
    status: interviewStatusEnum("status").default("scheduled"),
    scheduledTime: timestamp("scheduled_time", { withTimezone: true,}).notNull(),
    roomId: text("room_id").unique().notNull(),
    meetingName: text("meeting_name").notNull(),
    askedQue: integer("asked_que_id").array()
});

export const queBank = pgTable("que_bank", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    inputFormat: jsonb("input_format").notNull(),
    outputFormat: text("output_format").notNull(),
    constraints: jsonb("constraints").notNull(),
    examples: jsonb("examples").notNull(),
    testCases: jsonb("test_cases").notNull(),
});

export const submission = pgTable("submission",{
    id: serial("id").primaryKey(),
    status: submissionStatusEnum('status').notNull(),
    code: text('code').notNull(),
    candidateId: integer("candidate_id").notNull().references(() => user.id),
    interviewId: integer('interview_id').notNull().references(() => interview.id),
    timeTaken: real("time_taken").notNull(),
    spaceTaken: real("space_taken").notNull(),
});

export const feedback = pgTable("feedback",{
    id: serial("id").primaryKey(),
    interviewId: integer('interview_id').notNull().references(() => interview.id),
    candidateId: integer("candidate_id").notNull().references(() => user.id),
    feedback: text('feedback').notNull(),
    rating: integer('rating')
});

