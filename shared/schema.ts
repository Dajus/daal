import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
  decimal,
  jsonb,
  inet,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// Administrators
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: varchar('email', { length: 100 }),
  role: varchar('role', { length: 20 }).default('admin'),
  lastLogin: timestamp('last_login'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  abbreviation: varchar('abbreviation', { length: 10 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  passingScore: integer('passing_score').default(80),
  timeLimitMinutes: integer('time_limit_minutes'),
  maxAttempts: integer('max_attempts').default(3),
  maxQuestionsInTest: integer('max_questions_in_test'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Companies
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  contactEmail: varchar('contact_email', { length: 100 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  address: text('address'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// Company Admins
export const companyAdmins = pgTable('company_admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  companyId: integer('company_id')
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),
  email: varchar('email', { length: 100 }),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdBy: integer('created_by').references(() => admins.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Access codes
export const accessCodes = pgTable('access_codes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  companyId: integer('company_id').references(() => companies.id),
  maxParticipants: integer('max_participants'),
  unlimitedParticipants: boolean('unlimited_participants').default(false),
  theoryToTest: boolean('theory_to_test').default(true),
  validUntil: date('valid_until').notNull(),
  isActive: boolean('is_active').default(true),
  usageCount: integer('usage_count').default(0),
  createdBy: integer('created_by').references(() => admins.id),
  createdAt: timestamp('created_at').defaultNow(),
})

// Theory slides
export const theorySlides = pgTable('theory_slides', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }),
  content: text('content'), // Quill.js JSON format
  slideOrder: integer('slide_order').notNull(),
  mediaUrls: jsonb('media_urls').default('[]'),
  estimatedReadTime: integer('estimated_read_time').default(2),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Test questions
export const testQuestions = pgTable('test_questions', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 20 }).default('single_choice'),
  options: jsonb('options').notNull(),
  correctAnswers: jsonb('correct_answers').notNull(),
  explanation: text('explanation'),
  mediaUrl: text('media_url'),
  points: integer('points').default(1),
  difficultyLevel: varchar('difficulty_level', { length: 10 }).default('medium'),
  questionOrder: integer('question_order'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Student sessions
export const studentSessions = pgTable('student_sessions', {
  id: serial('id').primaryKey(),
  accessCodeId: integer('access_code_id').references(() => accessCodes.id),
  studentName: varchar('student_name', { length: 100 }).notNull(),
  studentEmail: varchar('student_email', { length: 100 }).notNull(),
  theoryStartedAt: timestamp('theory_started_at'),
  theoryCompletedAt: timestamp('theory_completed_at'),
  theoryProgress: jsonb('theory_progress').default('{}'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Test attempts
export const testAttempts = pgTable('test_attempts', {
  id: serial('id').primaryKey(),
  studentSessionId: integer('student_session_id').references(() => studentSessions.id, { onDelete: 'cascade' }),
  answers: jsonb('answers').notNull(),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(),
  passed: boolean('passed').notNull(),
  timeTakenSeconds: integer('time_taken_seconds'),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  attemptNumber: integer('attempt_number').default(1),
  ipAddress: inet('ip_address'),
})

// Certificates
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  studentSessionId: integer('student_session_id').references(() => studentSessions.id),
  testAttemptId: integer('test_attempt_id').references(() => testAttempts.id),
  certificateNumber: varchar('certificate_number', { length: 50 }).notNull().unique(),
  certificateUrl: text('certificate_url'),
  verificationCode: varchar('verification_code', { length: 100 }).notNull().unique(),
  qrCodeUrl: text('qr_code_url'),
  issuedAt: timestamp('issued_at').defaultNow(),
  isValid: boolean('is_valid').default(true),
})

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  userType: varchar('user_type', { length: 20 }),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: integer('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const adminRelations = relations(admins, ({ many }) => ({
  accessCodes: many(accessCodes),
}))

export const courseRelations = relations(courses, ({ many }) => ({
  accessCodes: many(accessCodes),
  theorySlides: many(theorySlides),
  testQuestions: many(testQuestions),
}))

export const companyRelations = relations(companies, ({ many }) => ({
  accessCodes: many(accessCodes),
  companyAdmins: many(companyAdmins),
}))

export const companyAdminRelations = relations(companyAdmins, ({ one }) => ({
  company: one(companies, {
    fields: [companyAdmins.companyId],
    references: [companies.id],
  }),
  createdByAdmin: one(admins, {
    fields: [companyAdmins.createdBy],
    references: [admins.id],
  }),
}))

export const accessCodeRelations = relations(accessCodes, ({ one, many }) => ({
  course: one(courses, {
    fields: [accessCodes.courseId],
    references: [courses.id],
  }),
  company: one(companies, {
    fields: [accessCodes.companyId],
    references: [companies.id],
  }),
  createdByAdmin: one(admins, {
    fields: [accessCodes.createdBy],
    references: [admins.id],
  }),
  studentSessions: many(studentSessions),
}))

export const studentSessionRelations = relations(studentSessions, ({ one, many }) => ({
  accessCode: one(accessCodes, {
    fields: [studentSessions.accessCodeId],
    references: [accessCodes.id],
  }),
  testAttempts: many(testAttempts),
  certificates: many(certificates),
}))

export const testAttemptRelations = relations(testAttempts, ({ one, many }) => ({
  studentSession: one(studentSessions, {
    fields: [testAttempts.studentSessionId],
    references: [studentSessions.id],
  }),
  certificates: many(certificates),
}))

// Insert schemas
export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
})

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
})

export const insertCompanyAdminSchema = createInsertSchema(companyAdmins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
})

export const insertAccessCodeSchema = createInsertSchema(accessCodes).omit({
  id: true,
  code: true,
  createdAt: true,
  usageCount: true,
})

export const insertTheorySlideSchema = createInsertSchema(theorySlides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertTestQuestionSchema = createInsertSchema(testQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertStudentSessionSchema = createInsertSchema(studentSessions).omit({
  id: true,
  createdAt: true,
})

export const insertTestAttemptSchema = createInsertSchema(testAttempts).omit({
  id: true,
})

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
})

// Types
export type Admin = typeof admins.$inferSelect
export type InsertAdmin = z.infer<typeof insertAdminSchema>

export type Course = typeof courses.$inferSelect
export type InsertCourse = z.infer<typeof insertCourseSchema>

export type Company = typeof companies.$inferSelect
export type InsertCompany = z.infer<typeof insertCompanySchema>

export type CompanyAdmin = typeof companyAdmins.$inferSelect
export type InsertCompanyAdmin = z.infer<typeof insertCompanyAdminSchema>

export type AccessCode = typeof accessCodes.$inferSelect
export type InsertAccessCode = z.infer<typeof insertAccessCodeSchema>

export type TheorySlide = typeof theorySlides.$inferSelect
export type InsertTheorySlide = z.infer<typeof insertTheorySlideSchema>

export type TestQuestion = typeof testQuestions.$inferSelect
export type InsertTestQuestion = z.infer<typeof insertTestQuestionSchema>

export type StudentSession = typeof studentSessions.$inferSelect
export type InsertStudentSession = z.infer<typeof insertStudentSessionSchema>

export type TestAttempt = typeof testAttempts.$inferSelect
export type InsertTestAttempt = z.infer<typeof insertTestAttemptSchema>

export type Certificate = typeof certificates.$inferSelect
export type InsertCertificate = z.infer<typeof insertCertificateSchema>
