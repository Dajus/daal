var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accessCodeRelations: () => accessCodeRelations,
  accessCodes: () => accessCodes,
  adminRelations: () => adminRelations,
  admins: () => admins,
  auditLogs: () => auditLogs,
  certificates: () => certificates,
  companies: () => companies,
  companyRelations: () => companyRelations,
  courseRelations: () => courseRelations,
  courses: () => courses,
  insertAccessCodeSchema: () => insertAccessCodeSchema,
  insertAdminSchema: () => insertAdminSchema,
  insertCertificateSchema: () => insertCertificateSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertCourseSchema: () => insertCourseSchema,
  insertStudentSessionSchema: () => insertStudentSessionSchema,
  insertTestAttemptSchema: () => insertTestAttemptSchema,
  insertTestQuestionSchema: () => insertTestQuestionSchema,
  insertTheorySlideSchema: () => insertTheorySlideSchema,
  studentSessionRelations: () => studentSessionRelations,
  studentSessions: () => studentSessions,
  testAttemptRelations: () => testAttemptRelations,
  testAttempts: () => testAttempts,
  testQuestions: () => testQuestions,
  theorySlides: () => theorySlides
});
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
  inet
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: varchar("email", { length: 100 }),
  role: varchar("role", { length: 20 }).default("admin"),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  abbreviation: varchar("abbreviation", { length: 10 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  passingScore: integer("passing_score").default(80),
  timeLimitMinutes: integer("time_limit_minutes"),
  maxAttempts: integer("max_attempts").default(3),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  contactEmail: varchar("contact_email", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var accessCodes = pgTable("access_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  companyId: integer("company_id").references(() => companies.id),
  maxParticipants: integer("max_participants"),
  unlimitedParticipants: boolean("unlimited_participants").default(false),
  theoryToTest: boolean("theory_to_test").default(true),
  validUntil: date("valid_until").notNull(),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  createdBy: integer("created_by").references(() => admins.id),
  createdAt: timestamp("created_at").defaultNow()
});
var theorySlides = pgTable("theory_slides", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }),
  content: text("content"),
  // Quill.js JSON format
  slideOrder: integer("slide_order").notNull(),
  mediaUrls: jsonb("media_urls").default("[]"),
  estimatedReadTime: integer("estimated_read_time").default(2),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var testQuestions = pgTable("test_questions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 20 }).default("single_choice"),
  options: jsonb("options").notNull(),
  correctAnswers: jsonb("correct_answers").notNull(),
  explanation: text("explanation"),
  mediaUrl: text("media_url"),
  points: integer("points").default(1),
  difficultyLevel: varchar("difficulty_level", { length: 10 }).default("medium"),
  questionOrder: integer("question_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var studentSessions = pgTable("student_sessions", {
  id: serial("id").primaryKey(),
  accessCodeId: integer("access_code_id").references(() => accessCodes.id),
  studentName: varchar("student_name", { length: 100 }).notNull(),
  studentEmail: varchar("student_email", { length: 100 }).notNull(),
  theoryStartedAt: timestamp("theory_started_at"),
  theoryCompletedAt: timestamp("theory_completed_at"),
  theoryProgress: jsonb("theory_progress").default("{}"),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});
var testAttempts = pgTable("test_attempts", {
  id: serial("id").primaryKey(),
  studentSessionId: integer("student_session_id").references(() => studentSessions.id, { onDelete: "cascade" }),
  answers: jsonb("answers").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  passed: boolean("passed").notNull(),
  timeTakenSeconds: integer("time_taken_seconds"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  attemptNumber: integer("attempt_number").default(1),
  ipAddress: inet("ip_address")
});
var certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentSessionId: integer("student_session_id").references(() => studentSessions.id),
  testAttemptId: integer("test_attempt_id").references(() => testAttempts.id),
  certificateNumber: varchar("certificate_number", { length: 50 }).notNull().unique(),
  certificateUrl: text("certificate_url"),
  verificationCode: varchar("verification_code", { length: 100 }).notNull().unique(),
  qrCodeUrl: text("qr_code_url"),
  issuedAt: timestamp("issued_at").defaultNow(),
  isValid: boolean("is_valid").default(true)
});
var auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userType: varchar("user_type", { length: 20 }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: integer("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});
var adminRelations = relations(admins, ({ many }) => ({
  accessCodes: many(accessCodes)
}));
var courseRelations = relations(courses, ({ many }) => ({
  accessCodes: many(accessCodes),
  theorySlides: many(theorySlides),
  testQuestions: many(testQuestions)
}));
var companyRelations = relations(companies, ({ many }) => ({
  accessCodes: many(accessCodes)
}));
var accessCodeRelations = relations(accessCodes, ({ one, many }) => ({
  course: one(courses, {
    fields: [accessCodes.courseId],
    references: [courses.id]
  }),
  company: one(companies, {
    fields: [accessCodes.companyId],
    references: [companies.id]
  }),
  createdByAdmin: one(admins, {
    fields: [accessCodes.createdBy],
    references: [admins.id]
  }),
  studentSessions: many(studentSessions)
}));
var studentSessionRelations = relations(studentSessions, ({ one, many }) => ({
  accessCode: one(accessCodes, {
    fields: [studentSessions.accessCodeId],
    references: [accessCodes.id]
  }),
  testAttempts: many(testAttempts),
  certificates: many(certificates)
}));
var testAttemptRelations = relations(testAttempts, ({ one, many }) => ({
  studentSession: one(studentSessions, {
    fields: [testAttempts.studentSessionId],
    references: [studentSessions.id]
  }),
  certificates: many(certificates)
}));
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true
});
var insertAccessCodeSchema = createInsertSchema(accessCodes).omit({
  id: true,
  code: true,
  createdAt: true,
  usageCount: true
});
var insertTheorySlideSchema = createInsertSchema(theorySlides).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTestQuestionSchema = createInsertSchema(testQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertStudentSessionSchema = createInsertSchema(studentSessions).omit({
  id: true,
  createdAt: true
});
var insertTestAttemptSchema = createInsertSchema(testAttempts).omit({
  id: true
});
var insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, count, sql, and, gte, isNotNull, isNull } from "drizzle-orm";
var DatabaseStorage = class {
  // Admin operations
  async getAdmin(id) {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || void 0;
  }
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || void 0;
  }
  async createAdmin(admin) {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }
  async updateAdminLastLogin(id) {
    await db.update(admins).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(admins.id, id));
  }
  // Course operations
  async getAllCourses() {
    return await db.select().from(courses).where(eq(courses.isActive, true));
  }
  async getCourse(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || void 0;
  }
  async createCourse(course) {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  // Company operations
  async getAllCompanies() {
    return await db.select().from(companies).where(eq(companies.isActive, true));
  }
  async getCompany(id) {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || void 0;
  }
  async createCompany(company) {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }
  // Access code operations
  async getAllAccessCodes() {
    return await db.select().from(accessCodes).where(eq(accessCodes.isActive, true)).orderBy(desc(accessCodes.createdAt));
  }
  async getAccessCode(id) {
    const [accessCode] = await db.select().from(accessCodes).where(eq(accessCodes.id, id));
    return accessCode || void 0;
  }
  async getAccessCodeByCode(code) {
    const [accessCode] = await db.select().from(accessCodes).where(and(eq(accessCodes.code, code), eq(accessCodes.isActive, true)));
    return accessCode || void 0;
  }
  async createAccessCode(accessCode) {
    const [newAccessCode] = await db.insert(accessCodes).values(accessCode).returning();
    return newAccessCode;
  }
  async incrementAccessCodeUsage(id) {
    await db.update(accessCodes).set({ usageCount: sql`usage_count + 1` }).where(eq(accessCodes.id, id));
  }
  // Theory slide operations
  async getTheorySlidesByCourse(courseId) {
    return await db.select().from(theorySlides).where(and(eq(theorySlides.courseId, courseId), eq(theorySlides.isActive, true))).orderBy(theorySlides.slideOrder);
  }
  async createTheorySlide(slide) {
    const [newSlide] = await db.insert(theorySlides).values(slide).returning();
    return newSlide;
  }
  async updateTheorySlide(id, slide) {
    const [updatedSlide] = await db.update(theorySlides).set({ ...slide, updatedAt: /* @__PURE__ */ new Date() }).where(eq(theorySlides.id, id)).returning();
    return updatedSlide;
  }
  async deleteTheorySlide(id) {
    await db.update(theorySlides).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(theorySlides.id, id));
  }
  // Test question operations
  async getTestQuestionsByCourse(courseId) {
    return await db.select().from(testQuestions).where(and(eq(testQuestions.courseId, courseId), eq(testQuestions.isActive, true))).orderBy(testQuestions.questionOrder);
  }
  async createTestQuestion(question) {
    const [newQuestion] = await db.insert(testQuestions).values(question).returning();
    return newQuestion;
  }
  async updateTestQuestion(id, question) {
    const [updatedQuestion] = await db.update(testQuestions).set({ ...question, updatedAt: /* @__PURE__ */ new Date() }).where(eq(testQuestions.id, id)).returning();
    return updatedQuestion;
  }
  async deleteTestQuestion(id) {
    await db.update(testQuestions).set({ isActive: false }).where(eq(testQuestions.id, id));
  }
  // Student session operations
  async getStudentSession(id) {
    const [session] = await db.select().from(studentSessions).where(eq(studentSessions.id, id));
    return session || void 0;
  }
  async getStudentSessionByEmailAndCode(email, accessCodeId) {
    const [session] = await db.select().from(studentSessions).where(and(
      eq(studentSessions.studentEmail, email),
      eq(studentSessions.accessCodeId, accessCodeId)
    ));
    return session || void 0;
  }
  async getStudentSessionByNameEmailAndCode(name, email, accessCodeId) {
    const [session] = await db.select().from(studentSessions).where(and(
      eq(studentSessions.studentName, name),
      eq(studentSessions.studentEmail, email),
      eq(studentSessions.accessCodeId, accessCodeId)
    ));
    return session || void 0;
  }
  async getActiveSessionsCountForCode(accessCodeId) {
    const [result] = await db.select({ count: count() }).from(studentSessions).leftJoin(certificates, eq(certificates.studentSessionId, studentSessions.id)).where(and(
      eq(studentSessions.accessCodeId, accessCodeId),
      isNotNull(studentSessions.createdAt),
      isNull(certificates.id)
      // No certificate = still active
    ));
    return result.count;
  }
  async createStudentSession(session) {
    const [newSession] = await db.insert(studentSessions).values(session).returning();
    return newSession;
  }
  async markTheoryComplete(sessionId) {
    await db.update(studentSessions).set({ theoryCompletedAt: /* @__PURE__ */ new Date() }).where(eq(studentSessions.id, sessionId));
  }
  // Test attempt operations
  async getTestAttemptsBySession(sessionId) {
    return await db.select().from(testAttempts).where(eq(testAttempts.studentSessionId, sessionId)).orderBy(desc(testAttempts.startedAt));
  }
  async createTestAttempt(attempt) {
    const [newAttempt] = await db.insert(testAttempts).values(attempt).returning();
    return newAttempt;
  }
  // Certificate operations
  async getCertificateBySession(sessionId) {
    const [certificate] = await db.select().from(certificates).where(and(
      eq(certificates.studentSessionId, sessionId),
      eq(certificates.isValid, true)
    ));
    return certificate || void 0;
  }
  async getCertificateByVerificationCode(verificationCode) {
    const [certificate] = await db.select().from(certificates).where(and(
      eq(certificates.verificationCode, verificationCode),
      eq(certificates.isValid, true)
    ));
    return certificate || void 0;
  }
  async createCertificate(certificate) {
    const [newCertificate] = await db.insert(certificates).values(certificate).returning();
    return newCertificate;
  }
  // Analytics operations
  async getAnalytics() {
    const [activeCodesResult] = await db.select({ count: count() }).from(accessCodes).where(and(
      eq(accessCodes.isActive, true),
      gte(accessCodes.validUntil, (/* @__PURE__ */ new Date()).toISOString().split("T")[0])
    ));
    const [completionsResult] = await db.select({ count: count() }).from(certificates).where(eq(certificates.isValid, true));
    const [inProgressResult] = await db.select({ count: count() }).from(studentSessions).where(sql`theory_completed_at IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM ${certificates} WHERE student_session_id = ${studentSessions.id}
      )`);
    const [totalAttempts] = await db.select({ count: count() }).from(testAttempts);
    const [passedAttempts] = await db.select({ count: count() }).from(testAttempts).where(eq(testAttempts.passed, true));
    const successRate = totalAttempts.count > 0 ? Math.round(passedAttempts.count / totalAttempts.count * 100) : 0;
    const popularCoursesData = await db.select({
      courseName: courses.name,
      completions: count(certificates.id)
    }).from(certificates).innerJoin(studentSessions, eq(certificates.studentSessionId, studentSessions.id)).innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id)).innerJoin(courses, eq(accessCodes.courseId, courses.id)).where(eq(certificates.isValid, true)).groupBy(courses.id, courses.name).orderBy(desc(count(certificates.id))).limit(5);
    const maxCompletions = Math.max(...popularCoursesData.map((c) => c.completions), 1);
    const popularCourses = popularCoursesData.map((course) => ({
      name: course.courseName,
      completions: course.completions,
      percentage: Math.round(course.completions / maxCompletions * 100)
    }));
    const companyPerformanceData = await db.select({
      companyName: companies.name,
      employeesTrained: count(sql`DISTINCT ${studentSessions.studentEmail}`),
      totalAttempts: count(testAttempts.id),
      passedAttempts: count(sql`CASE WHEN ${testAttempts.passed} THEN 1 END`)
    }).from(companies).innerJoin(accessCodes, eq(companies.id, accessCodes.companyId)).innerJoin(studentSessions, eq(accessCodes.id, studentSessions.accessCodeId)).leftJoin(testAttempts, eq(studentSessions.id, testAttempts.studentSessionId)).groupBy(companies.id, companies.name).orderBy(desc(count(sql`DISTINCT ${studentSessions.studentEmail}`))).limit(5);
    const companyPerformance = companyPerformanceData.map((company) => ({
      name: company.companyName,
      employeesTrained: company.employeesTrained,
      successRate: company.totalAttempts > 0 ? Math.round(company.passedAttempts / company.totalAttempts * 100) : 0
    }));
    return {
      activeCodes: activeCodesResult.count,
      totalCompletions: completionsResult.count,
      inProgress: inProgressResult.count,
      successRate,
      popularCourses,
      companyPerformance
    };
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await storage.getAdmin(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
function generateCourseCode(courseName) {
  const prefixes = {
    "\u0160kolen\xED \u0159idi\u010D\u016F \u0159\xEDd\xEDc\xEDch slu\u017Eebn\xED vozidlo zam\u011Bstnavatele": "DRIV",
    "\u0160kolen\xED BOZP a PO": "BOZP",
    "Theory test": "THEO",
    "\u0160kolen\xED zam\u011Bstnanc\u016F a OSV\u010C pro prov\xE1d\u011Bn\xED pr\xE1ce ve v\xFD\u0161k\xE1ch (PVV)": "HEIG",
    "Hygiena a prvn\xED pomoc": "HYGI",
    "Nakl\xE1d\xE1n\xED s odpady": "WAST",
    "\u0160kolen\xED pro zdravotnick\xE9 pracovn\xEDky - BRC": "MEDB",
    "\u0160kolen\xED pro nezdravotnick\xE9 pracovn\xEDky - BRC": "NONM",
    "\u0160kolen\xED p\u0159epravy odpadu - BRC": "TRAN",
    "Health and Safety (H&S) and Fire Protection (FP) training": "HSFT",
    "Szkolenia BHP i PPO\u017B": "PLHS",
    "\u043D\u0430\u0432\u0447\u0430\u043D\u043D\u044F \u0437 \u043E\u0445\u043E\u0440\u043E\u043D\u0438 \u043F\u0440\u0430\u0446\u0456 (OHS) \u0442\u0430 \u043F\u0440\u043E\u0442\u0438\u043F\u043E\u0436\u0435\u0436\u043D\u043E\u0433\u043E \u0437\u0430\u0445\u0438\u0441\u0442\u0443 (FP)": "UAHS",
    "P\u0159eprava nebezpe\u010Dn\xFDch v\u011Bc\xED v praxi - Dohoda ADR": "HADR"
  };
  const prefix = prefixes[courseName] || "COUR";
  const timestamp2 = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}${timestamp2}${random}`.toUpperCase();
}
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      await storage.updateAdminLastLogin(admin.id);
      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "24h" });
      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/student/login", async (req, res) => {
    try {
      const { studentName, studentEmail, accessCode } = req.body;
      if (!studentName || !studentEmail || !accessCode) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const code = await storage.getAccessCodeByCode(accessCode);
      if (!code || !code.isActive) {
        return res.status(401).json({ message: "Invalid access code" });
      }
      const now = /* @__PURE__ */ new Date();
      const validUntil = new Date(code.validUntil);
      if (validUntil < now) {
        return res.status(401).json({ message: "Access code has expired" });
      }
      if (!code.unlimitedParticipants && code.maxParticipants) {
        const activeSessionsCount = await storage.getActiveSessionsCountForCode(code.id);
        if (activeSessionsCount >= code.maxParticipants) {
          return res.status(401).json({ message: "Maximum participants currently active for this code" });
        }
      }
      let session = await storage.getStudentSessionByNameEmailAndCode(studentName, studentEmail, code.id);
      if (!session) {
        session = await storage.createStudentSession({
          accessCodeId: code.id,
          studentName,
          studentEmail,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || null
        });
      }
      const token = jwt.sign({ sessionId: session.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({
        token,
        session: {
          id: session.id,
          studentName: session.studentName,
          studentEmail: session.studentEmail,
          course: await storage.getCourse(code.courseId),
          company: code.companyId ? await storage.getCompany(code.companyId) : null
        }
      });
    } catch (error) {
      console.error("Student login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/courses", authenticateAdmin, async (req, res) => {
    try {
      const courses2 = await storage.getAllCourses();
      res.json(courses2);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/companies", authenticateAdmin, async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      res.json(companies2);
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/companies", authenticateAdmin, async (req, res) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(data);
      res.json(company);
    } catch (error) {
      console.error("Create company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/courses", authenticateAdmin, async (req, res) => {
    try {
      const data = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(data);
      res.json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/access-codes", authenticateAdmin, async (req, res) => {
    try {
      const data = insertAccessCodeSchema.parse(req.body);
      const course = await storage.getCourse(data.courseId);
      if (!course) {
        return res.status(400).json({ message: "Course not found" });
      }
      const codeCount = data.maxParticipants && !data.unlimitedParticipants ? data.maxParticipants : 1;
      const codes = [];
      for (let i = 0; i < Math.min(codeCount, 100); i++) {
        const code = generateCourseCode(course.name);
        const accessCode = await storage.createAccessCode({
          ...data,
          code,
          createdBy: req.admin.id
        });
        codes.push(accessCode);
      }
      res.json(codes);
    } catch (error) {
      console.error("Create access codes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/access-codes", authenticateAdmin, async (req, res) => {
    try {
      const codes = await storage.getAllAccessCodes();
      res.json(codes);
    } catch (error) {
      console.error("Get access codes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/courses/:courseId/theory", authenticateAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const slides = await storage.getTheorySlidesByCourse(courseId);
      res.json(slides);
    } catch (error) {
      console.error("Get theory slides error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/upload-image", authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const imageBase64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      const imageUrl = `data:${mimeType};base64,${imageBase64}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  app2.post("/api/admin/courses/:courseId/theory", authenticateAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const data = insertTheorySlideSchema.parse({ ...req.body, courseId });
      const slide = await storage.createTheorySlide(data);
      res.json(slide);
    } catch (error) {
      console.error("Create theory slide error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/admin/theory/:slideId", authenticateAdmin, async (req, res) => {
    try {
      const slideId = parseInt(req.params.slideId);
      const data = req.body;
      const slide = await storage.updateTheorySlide(slideId, data);
      res.json(slide);
    } catch (error) {
      console.error("Update theory slide error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/theory/:slideId", authenticateAdmin, async (req, res) => {
    try {
      const slideId = parseInt(req.params.slideId);
      await storage.deleteTheorySlide(slideId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete theory slide error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/courses/:courseId/questions", authenticateAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const questions = await storage.getTestQuestionsByCourse(courseId);
      res.json(questions);
    } catch (error) {
      console.error("Get test questions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/admin/courses/:courseId/questions", authenticateAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const data = insertTestQuestionSchema.parse({ ...req.body, courseId });
      const question = await storage.createTestQuestion(data);
      res.json(question);
    } catch (error) {
      console.error("Create test question error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.put("/api/admin/questions/:questionId", authenticateAdmin, async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const data = req.body;
      const question = await storage.updateTestQuestion(questionId, data);
      res.json(question);
    } catch (error) {
      console.error("Update test question error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/admin/questions/:questionId", authenticateAdmin, async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      await storage.deleteTestQuestion(questionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete test question error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const authenticateStudent = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const session = await storage.getStudentSession(decoded.sessionId);
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
      }
      req.session = session;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  app2.get("/api/student/progress", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const course = await storage.getCourse(accessCode.courseId);
      const attempts = await storage.getTestAttemptsBySession(session.id);
      res.json({
        session,
        course,
        accessCode,
        attempts,
        theoryCompleted: !!session.theoryCompletedAt,
        testCompleted: attempts.length > 0,
        passed: attempts.some((a) => a.passed)
      });
    } catch (error) {
      console.error("Get student progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/student/theory", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const slides = await storage.getTheorySlidesByCourse(accessCode.courseId);
      res.json(slides);
    } catch (error) {
      console.error("Get theory content error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/student/theory/complete", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      await storage.markTheoryComplete(session.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark theory complete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/student/test", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const questions = await storage.getTestQuestionsByCourse(accessCode.courseId);
      const shuffledQuestions = questions.sort(() => Math.random() - 0.5).map((q) => ({
        ...q,
        options: Array.isArray(q.options) ? q.options.sort(() => Math.random() - 0.5) : q.options
      }));
      res.json(shuffledQuestions);
    } catch (error) {
      console.error("Get test questions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/student/test/submit", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      const { answers, timeTakenSeconds } = req.body;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const questions = await storage.getTestQuestionsByCourse(accessCode.courseId);
      const course = await storage.getCourse(accessCode.courseId);
      let score = 0;
      let maxScore = 0;
      const answerDetails = [];
      questions.forEach((question) => {
        const questionPoints = question.points || 1;
        maxScore += questionPoints;
        const userAnswer = answers[question.id];
        const correctAnswers = question.correctAnswers;
        let isCorrect = false;
        if (Array.isArray(correctAnswers)) {
          if (Array.isArray(userAnswer) && userAnswer.length === correctAnswers.length && userAnswer.every((a) => correctAnswers.includes(a))) {
            score += questionPoints;
            isCorrect = true;
          }
        } else {
          if (userAnswer === correctAnswers) {
            score += questionPoints;
            isCorrect = true;
          }
        }
        answerDetails.push({
          questionId: question.id,
          selectedAnswer: Array.isArray(userAnswer) ? userAnswer.join(", ") : String(userAnswer || ""),
          correctAnswer: Array.isArray(correctAnswers) ? correctAnswers.join(", ") : String(correctAnswers || ""),
          isCorrect,
          explanation: question.explanation || null
        });
      });
      const percentage = score / maxScore * 100;
      const passed = percentage >= (course.passingScore || 80);
      const existingAttempts = await storage.getTestAttemptsBySession(session.id);
      const attemptNumber = existingAttempts.length + 1;
      if (attemptNumber > (course.maxAttempts || 3)) {
        return res.status(400).json({ message: "Maximum attempts exceeded" });
      }
      const attempt = await storage.createTestAttempt({
        studentSessionId: session.id,
        answers,
        score,
        maxScore,
        percentage: percentage.toString(),
        passed,
        timeTakenSeconds,
        startedAt: new Date(Date.now() - timeTakenSeconds * 1e3),
        completedAt: /* @__PURE__ */ new Date(),
        attemptNumber,
        ipAddress: req.ip
      });
      let certificate = null;
      if (passed) {
        const certificateNumber = `CERT-${accessCode.code}-${Date.now()}`;
        const verificationCode = Math.random().toString(36).substring(2, 15);
        certificate = await storage.createCertificate({
          studentSessionId: session.id,
          testAttemptId: attempt.id,
          certificateNumber,
          verificationCode
        });
      }
      res.json({
        attempt: {
          ...attempt,
          answers: answerDetails
        },
        certificate,
        passed,
        score,
        maxScore,
        percentage,
        attemptsRemaining: (course.maxAttempts || 3) - attemptNumber
      });
    } catch (error) {
      console.error("Submit test error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/student/certificate", authenticateStudent, async (req, res) => {
    try {
      const session = req.session;
      const certificate = await storage.getCertificateBySession(session.id);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const course = await storage.getCourse(accessCode.courseId);
      const company = accessCode.companyId ? await storage.getCompany(accessCode.companyId) : null;
      res.json({
        certificate,
        course,
        company,
        student: {
          name: session.studentName,
          email: session.studentEmail
        }
      });
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/verify/:verificationCode", async (req, res) => {
    try {
      const { verificationCode } = req.params;
      const certificate = await storage.getCertificateByVerificationCode(verificationCode);
      if (!certificate || !certificate.isValid) {
        return res.status(404).json({ message: "Certificate not found or invalid" });
      }
      const session = await storage.getStudentSession(certificate.studentSessionId || 0);
      const accessCode = await storage.getAccessCode(session.accessCodeId || 0);
      const course = await storage.getCourse(accessCode.courseId);
      const company = accessCode.companyId ? await storage.getCompany(accessCode.companyId) : null;
      res.json({
        valid: true,
        certificate,
        student: {
          name: session.studentName
        },
        course: course.name,
        company: company?.name,
        issuedAt: certificate.issuedAt
      });
    } catch (error) {
      console.error("Verify certificate error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
