CREATE TABLE "access_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"course_id" integer,
	"company_id" integer,
	"max_participants" integer,
	"unlimited_participants" boolean DEFAULT false,
	"theory_to_test" boolean DEFAULT true,
	"valid_until" date NOT NULL,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "access_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"email" varchar(100),
	"role" varchar(20) DEFAULT 'admin',
	"last_login" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"user_type" varchar(20),
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50),
	"entity_id" integer,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_session_id" integer,
	"test_attempt_id" integer,
	"certificate_number" varchar(50) NOT NULL,
	"certificate_url" text,
	"verification_code" varchar(100) NOT NULL,
	"qr_code_url" text,
	"issued_at" timestamp DEFAULT now(),
	"is_valid" boolean DEFAULT true,
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number"),
	CONSTRAINT "certificates_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"contact_email" varchar(100),
	"contact_phone" varchar(20),
	"address" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "company_admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"company_id" integer NOT NULL,
	"email" varchar(100),
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "company_admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"abbreviation" varchar(10) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"passing_score" integer DEFAULT 80,
	"time_limit_minutes" integer,
	"max_attempts" integer DEFAULT 3,
	"max_questions_in_test" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "student_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_code_id" integer,
	"student_name" varchar(100) NOT NULL,
	"student_email" varchar(100) NOT NULL,
	"theory_started_at" timestamp,
	"theory_completed_at" timestamp,
	"theory_progress" jsonb DEFAULT '{}',
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_session_id" integer,
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"max_score" integer NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"passed" boolean NOT NULL,
	"time_taken_seconds" integer,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"attempt_number" integer DEFAULT 1,
	"ip_address" "inet"
);
--> statement-breakpoint
CREATE TABLE "test_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"question_text" text NOT NULL,
	"question_type" varchar(20) DEFAULT 'single_choice',
	"options" jsonb NOT NULL,
	"correct_answers" jsonb NOT NULL,
	"explanation" text,
	"media_url" text,
	"points" integer DEFAULT 1,
	"difficulty_level" varchar(10) DEFAULT 'medium',
	"question_order" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "theory_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"title" varchar(200),
	"content" text,
	"slide_order" integer NOT NULL,
	"media_urls" jsonb DEFAULT '[]',
	"estimated_read_time" integer DEFAULT 2,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_student_session_id_student_sessions_id_fk" FOREIGN KEY ("student_session_id") REFERENCES "public"."student_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_test_attempt_id_test_attempts_id_fk" FOREIGN KEY ("test_attempt_id") REFERENCES "public"."test_attempts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_access_code_id_access_codes_id_fk" FOREIGN KEY ("access_code_id") REFERENCES "public"."access_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_student_session_id_student_sessions_id_fk" FOREIGN KEY ("student_session_id") REFERENCES "public"."student_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theory_slides" ADD CONSTRAINT "theory_slides_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;