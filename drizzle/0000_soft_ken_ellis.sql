CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."interviewStatus" AS ENUM('scheduled', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('candidate', 'interviewer');--> statement-breakpoint
CREATE TYPE "public"."subStatus" AS ENUM('passed', 'failed');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"interview_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"feedback" text NOT NULL,
	"rating" integer
);
--> statement-breakpoint
CREATE TABLE "interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"interviewer_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"status" "interviewStatus" DEFAULT 'scheduled',
	"scheduled_time" timestamp with time zone NOT NULL,
	"room_id" text NOT NULL,
	"asked_que_id" integer[],
	CONSTRAINT "interview_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
CREATE TABLE "que_bank" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"input_format" jsonb NOT NULL,
	"output_format" text NOT NULL,
	"constraints" jsonb NOT NULL,
	"examples" jsonb NOT NULL,
	"test_cases" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"resume_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "subStatus" NOT NULL,
	"code" text NOT NULL,
	"candidate_id" integer NOT NULL,
	"interview_id" integer NOT NULL,
	"time_taken" real NOT NULL,
	"space_taken" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" varchar(20) NOT NULL,
	"role" "role" DEFAULT 'candidate',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_candidate_id_user_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_interviewer_id_user_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_candidate_id_user_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_candidate_id_user_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE no action ON UPDATE no action;