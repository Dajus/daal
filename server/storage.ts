import { 
  admins, 
  courses, 
  companies, 
  companyAdmins,
  accessCodes, 
  theorySlides, 
  testQuestions, 
  studentSessions, 
  testAttempts, 
  certificates,
  auditLogs,
  type Admin,
  type InsertAdmin,
  type Course,
  type InsertCourse,
  type Company,
  type InsertCompany,
  type CompanyAdmin,
  type InsertCompanyAdmin,
  type AccessCode,
  type InsertAccessCode,
  type TheorySlide,
  type InsertTheorySlide,
  type TestQuestion,
  type InsertTestQuestion,
  type StudentSession,
  type InsertStudentSession,
  type TestAttempt,
  type InsertTestAttempt,
  type Certificate,
  type InsertCertificate
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, gte, isNotNull, isNull, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdminLastLogin(id: number): Promise<void>;

  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;

  // Company operations
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Company Admin operations
  getAllCompanyAdmins(): Promise<CompanyAdmin[]>;
  getCompanyAdmin(id: number): Promise<CompanyAdmin | undefined>;
  getCompanyAdminByUsername(username: string): Promise<CompanyAdmin | undefined>;
  getCompanyAdminsByCompany(companyId: number): Promise<CompanyAdmin[]>;
  createCompanyAdmin(companyAdmin: InsertCompanyAdmin): Promise<CompanyAdmin>;
  updateCompanyAdminLastLogin(id: number): Promise<void>;
  deleteCompanyAdmin(id: number): Promise<void>;
  updateCompanyAdmin(id: number, companyAdmin: InsertCompanyAdmin): Promise<CompanyAdmin>;

  // Access code operations
  getAllAccessCodes(): Promise<AccessCode[]>;
  getAccessCode(id: number): Promise<AccessCode | undefined>;
  getAccessCodeByCode(code: string): Promise<AccessCode | undefined>;
  createAccessCode(accessCode: InsertAccessCode): Promise<AccessCode>;
  incrementAccessCodeUsage(id: number): Promise<void>;

  // Theory slide operations
  getTheorySlidesByCourse(courseId: number): Promise<TheorySlide[]>;
  createTheorySlide(slide: InsertTheorySlide): Promise<TheorySlide>;
  updateTheorySlide(id: number, slide: Partial<TheorySlide>): Promise<TheorySlide>;
  deleteTheorySlide(id: number): Promise<void>;

  // Test question operations
  getTestQuestionsByCourse(courseId: number): Promise<TestQuestion[]>;
  createTestQuestion(question: InsertTestQuestion): Promise<TestQuestion>;
  updateTestQuestion(id: number, question: Partial<TestQuestion>): Promise<TestQuestion>;
  deleteTestQuestion(id: number): Promise<void>;

  // Student session operations
  getStudentSession(id: number): Promise<StudentSession | undefined>;
  getStudentSessionByEmailAndCode(email: string, accessCodeId: number): Promise<StudentSession | undefined>;
  getStudentSessionByNameEmailAndCode(name: string, email: string, accessCodeId: number): Promise<StudentSession | undefined>;
  getActiveSessionsCountForCode(accessCodeId: number): Promise<number>;
  createStudentSession(session: InsertStudentSession): Promise<StudentSession>;
  markTheoryComplete(sessionId: number): Promise<{ theoryToTest: boolean }>;

  // Test attempt operations
  getTestAttemptsBySession(sessionId: number): Promise<TestAttempt[]>;
  createTestAttempt(attempt: InsertTestAttempt): Promise<TestAttempt>;

  // Certificate operations
  getCertificateBySession(sessionId: number): Promise<Certificate | undefined>;
  getCertificateByVerificationCode(verificationCode: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;

  // Analytics operations
  getAnalytics(): Promise<{
    activeCodes: number;
    totalCompletions: number;
    inProgress: number;
    successRate: number;
    popularCourses: Array<{
      name: string;
      completions: number;
      percentage: number;
    }>;
    companyPerformance: Array<{
      name: string;
      employeesTrained: number;
      successRate: number;
    }>;
  }>;
  
  getAnalyticsByCompany(companyId: number): Promise<{
    activeCodes: number;
    totalCompletions: number;
    inProgress: number;
    successRate: number;
    employeesTrained: number;
    coursesOffered: Array<{
      name: string;
      completions: number;
      percentage: number;
    }>;
    popularCourses: Array<{
      name: string;
      completions: number;
      percentage: number;
    }>;
    companyPerformance: Array<{
      name: string;
      employeesTrained: number;
      successRate: number;
    }>;
  }>;
  
  getCompanyAccessCodesDetailed(companyId: number): Promise<Array<{
    id: number;
    code: string;
    courseName: string;
    maxParticipants: number | null;
    validUntil: string;
    isActive: boolean;
    theoryToTest: boolean;
    usage: number;
    students: Array<{
      id: number;
      name: string;
      email: string;
      theoryCompletedAt: string | null;
      testScore: number | null;
      passed: boolean | null;
      certificateIssued: boolean;
      lastActivity: string;
    }>;
  }>>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  async updateAdminLastLogin(id: number): Promise<void> {
    await db.update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, id));
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db.update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    // Delete course with proper cascading order
    // Need to delete in specific order due to foreign key constraints
    
    // First get all access code IDs for this course
    const courseAccessCodes = await db.select({ id: accessCodes.id })
      .from(accessCodes)
      .where(eq(accessCodes.courseId, id));
    
    const accessCodeIds = courseAccessCodes.map(ac => ac.id);
    
    if (accessCodeIds.length > 0) {
      // Get all student session IDs that use these access codes
      const courseSessions = await db.select({ id: studentSessions.id })
        .from(studentSessions)
        .where(inArray(studentSessions.accessCodeId, accessCodeIds));
      
      const sessionIds = courseSessions.map(s => s.id);
      
      if (sessionIds.length > 0) {
        // Delete certificates first (they reference test attempts)
        await db.delete(certificates)
          .where(inArray(certificates.studentSessionId, sessionIds));
        
        // Then delete test attempts
        await db.delete(testAttempts)
          .where(inArray(testAttempts.studentSessionId, sessionIds));
      }
      
      // Delete student sessions
      await db.delete(studentSessions)
        .where(inArray(studentSessions.accessCodeId, accessCodeIds));
      
      // Delete access codes
      await db.delete(accessCodes).where(eq(accessCodes.courseId, id));
    }
    
    // Delete theory slides
    await db.delete(theorySlides).where(eq(theorySlides.courseId, id));
    
    // Delete test questions
    await db.delete(testQuestions).where(eq(testQuestions.courseId, id));
    
    // Finally delete the course itself
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Company operations
  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.isActive, true));
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  // Company Admin operations
  async getAllCompanyAdmins(): Promise<CompanyAdmin[]> {
    return await db.select().from(companyAdmins)
      .where(eq(companyAdmins.isActive, true))
      .orderBy(desc(companyAdmins.createdAt));
  }

  async getCompanyAdmin(id: number): Promise<CompanyAdmin | undefined> {
    const [companyAdmin] = await db.select().from(companyAdmins).where(eq(companyAdmins.id, id));
    return companyAdmin || undefined;
  }

  async getCompanyAdminByUsername(username: string): Promise<CompanyAdmin | undefined> {
    const [companyAdmin] = await db.select().from(companyAdmins)
      .where(and(eq(companyAdmins.username, username), eq(companyAdmins.isActive, true)));
    return companyAdmin || undefined;
  }

  async getCompanyAdminsByCompany(companyId: number): Promise<CompanyAdmin[]> {
    return await db.select().from(companyAdmins)
      .where(and(eq(companyAdmins.companyId, companyId), eq(companyAdmins.isActive, true)))
      .orderBy(desc(companyAdmins.createdAt));
  }

  async createCompanyAdmin(companyAdmin: InsertCompanyAdmin): Promise<CompanyAdmin> {
    const [newCompanyAdmin] = await db.insert(companyAdmins).values(companyAdmin).returning();
    return newCompanyAdmin;
  }

  async updateCompanyAdminLastLogin(id: number): Promise<void> {
    await db.update(companyAdmins)
      .set({ lastLogin: new Date() })
      .where(eq(companyAdmins.id, id));
  }

  async deleteCompanyAdmin(id: number): Promise<void> {
    await db.update(companyAdmins)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(companyAdmins.id, id));
  }

  async updateCompanyAdmin(id: number, companyAdmin: InsertCompanyAdmin): Promise<CompanyAdmin> {
    // If password is empty, don't update it
    const updateData = companyAdmin.passwordHash 
      ? { ...companyAdmin, updatedAt: new Date() }
      : { ...companyAdmin, passwordHash: undefined, updatedAt: new Date() };
    
    const [updatedCompanyAdmin] = await db.update(companyAdmins)
      .set(updateData)
      .where(eq(companyAdmins.id, id))
      .returning();
    return updatedCompanyAdmin;
  }

  // Access code operations
  async getAllAccessCodes(): Promise<AccessCode[]> {
    return await db.select().from(accessCodes)
      .where(eq(accessCodes.isActive, true))
      .orderBy(desc(accessCodes.createdAt));
  }

  async getAccessCode(id: number): Promise<AccessCode | undefined> {
    const [accessCode] = await db.select().from(accessCodes).where(eq(accessCodes.id, id));
    return accessCode || undefined;
  }

  async getAccessCodeByCode(code: string): Promise<AccessCode | undefined> {
    const [accessCode] = await db.select().from(accessCodes)
      .where(and(eq(accessCodes.code, code), eq(accessCodes.isActive, true)));
    return accessCode || undefined;
  }

  async createAccessCode(accessCode: any): Promise<AccessCode> {
    const [newAccessCode] = await db.insert(accessCodes).values(accessCode).returning();
    return newAccessCode;
  }

  async incrementAccessCodeUsage(id: number): Promise<void> {
    await db.update(accessCodes)
      .set({ usageCount: sql`usage_count + 1` })
      .where(eq(accessCodes.id, id));
  }

  // Theory slide operations
  async getTheorySlidesByCourse(courseId: number): Promise<TheorySlide[]> {
    return await db.select().from(theorySlides)
      .where(and(eq(theorySlides.courseId, courseId), eq(theorySlides.isActive, true)))
      .orderBy(theorySlides.slideOrder);
  }

  async createTheorySlide(slide: InsertTheorySlide): Promise<TheorySlide> {
    const [newSlide] = await db.insert(theorySlides).values(slide).returning();
    return newSlide;
  }

  async updateTheorySlide(id: number, slide: Partial<TheorySlide>): Promise<TheorySlide> {
    const [updatedSlide] = await db.update(theorySlides)
      .set({ ...slide, updatedAt: new Date() })
      .where(eq(theorySlides.id, id))
      .returning();
    return updatedSlide;
  }

  async deleteTheorySlide(id: number): Promise<void> {
    await db.update(theorySlides)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(theorySlides.id, id));
  }

  // Test question operations
  async getTestQuestionsByCourse(courseId: number): Promise<TestQuestion[]> {
    return await db.select().from(testQuestions)
      .where(and(eq(testQuestions.courseId, courseId), eq(testQuestions.isActive, true)))
      .orderBy(testQuestions.questionOrder);
  }

  async createTestQuestion(question: InsertTestQuestion): Promise<TestQuestion> {
    const [newQuestion] = await db.insert(testQuestions).values(question).returning();
    return newQuestion;
  }

  async updateTestQuestion(id: number, question: Partial<TestQuestion>): Promise<TestQuestion> {
    const [updatedQuestion] = await db.update(testQuestions)
      .set({ ...question, updatedAt: new Date() })
      .where(eq(testQuestions.id, id))
      .returning();
    return updatedQuestion;
  }

  async deleteTestQuestion(id: number): Promise<void> {
    await db.update(testQuestions)
      .set({ isActive: false })
      .where(eq(testQuestions.id, id));
  }

  // Student session operations
  async getStudentSession(id: number): Promise<StudentSession | undefined> {
    const [session] = await db.select().from(studentSessions).where(eq(studentSessions.id, id));
    return session || undefined;
  }

  async getStudentSessionByEmailAndCode(email: string, accessCodeId: number): Promise<StudentSession | undefined> {
    const [session] = await db.select().from(studentSessions)
      .where(and(
        eq(studentSessions.studentEmail, email),
        eq(studentSessions.accessCodeId, accessCodeId)
      ));
    return session || undefined;
  }

  async getStudentSessionByNameEmailAndCode(name: string, email: string, accessCodeId: number): Promise<StudentSession | undefined> {
    const [session] = await db.select().from(studentSessions)
      .where(and(
        eq(studentSessions.studentName, name),
        eq(studentSessions.studentEmail, email),
        eq(studentSessions.accessCodeId, accessCodeId)
      ));
    return session || undefined;
  }

  async getActiveSessionsCountForCode(accessCodeId: number): Promise<number> {
    // Count sessions that have started theory but not completed the course (no certificate)
    const [result] = await db
      .select({ count: count() })
      .from(studentSessions)
      .leftJoin(certificates, eq(certificates.studentSessionId, studentSessions.id))
      .where(and(
        eq(studentSessions.accessCodeId, accessCodeId),
        isNotNull(studentSessions.createdAt),
        isNull(certificates.id) // No certificate = still active
      ));
    return result.count;
  }

  async createStudentSession(session: InsertStudentSession): Promise<StudentSession> {
    const [newSession] = await db.insert(studentSessions).values(session).returning();
    return newSession;
  }

  async markTheoryComplete(sessionId: number): Promise<{ theoryToTest: boolean }> {
    // First, get the session and access code info
    const [sessionWithCode] = await db.select({
      sessionId: studentSessions.id,
      theoryToTest: accessCodes.theoryToTest,
      studentName: studentSessions.studentName,
      studentEmail: studentSessions.studentEmail,
      courseId: accessCodes.courseId,
      companyId: accessCodes.companyId
    })
    .from(studentSessions)
    .innerJoin(accessCodes, eq(accessCodes.id, studentSessions.accessCodeId))
    .where(eq(studentSessions.id, sessionId));

    if (!sessionWithCode) {
      throw new Error('Session not found');
    }

    // Mark theory as complete
    await db.update(studentSessions)
      .set({ theoryCompletedAt: new Date() })
      .where(eq(studentSessions.id, sessionId));

    const theoryToTest = sessionWithCode.theoryToTest ?? true;

    // If theory-to-test is disabled, automatically generate a certificate
    if (!theoryToTest) {
      // Check if certificate doesn't already exist
      const existingCertificate = await this.getCertificateBySession(sessionId);
      if (!existingCertificate) {
        const verificationCode = `CERT-${Date.now()}-${nanoid(8).toUpperCase()}`;
        await this.createCertificate({
          studentSessionId: sessionId,
          testAttemptId: null, // No test attempt for theory-only
          certificateNumber: `CERT-${sessionId}-${Date.now()}`,
          verificationCode,
          isValid: true
        });
      }
    }

    // Return the theoryToTest setting 
    return { theoryToTest };
  }

  // Test attempt operations
  async getTestAttemptsBySession(sessionId: number): Promise<TestAttempt[]> {
    return await db.select().from(testAttempts)
      .where(eq(testAttempts.studentSessionId, sessionId))
      .orderBy(desc(testAttempts.startedAt));
  }

  async createTestAttempt(attempt: InsertTestAttempt): Promise<TestAttempt> {
    const [newAttempt] = await db.insert(testAttempts).values(attempt).returning();
    return newAttempt;
  }

  // Certificate operations
  async getCertificateBySession(sessionId: number): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates)
      .where(and(
        eq(certificates.studentSessionId, sessionId),
        eq(certificates.isValid, true)
      ));
    return certificate || undefined;
  }

  async getCertificateByVerificationCode(verificationCode: string): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates)
      .where(and(
        eq(certificates.verificationCode, verificationCode),
        eq(certificates.isValid, true)
      ));
    return certificate || undefined;
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [newCertificate] = await db.insert(certificates).values(certificate).returning();
    return newCertificate;
  }

  // Analytics operations
  async getAnalytics() {
    // Get active codes count
    const [activeCodesResult] = await db.select({ count: count() })
      .from(accessCodes)
      .where(and(
        eq(accessCodes.isActive, true),
        gte(accessCodes.validUntil, new Date().toISOString().split('T')[0])
      ));

    // Get total completions
    const [completionsResult] = await db.select({ count: count() })
      .from(certificates)
      .where(eq(certificates.isValid, true));

    // Get in progress sessions
    const [inProgressResult] = await db.select({ count: count() })
      .from(studentSessions)
      .where(sql`theory_completed_at IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM ${certificates} WHERE student_session_id = ${studentSessions.id}
      )`);

    // Calculate success rate
    const [totalAttempts] = await db.select({ count: count() }).from(testAttempts);
    const [passedAttempts] = await db.select({ count: count() })
      .from(testAttempts)
      .where(eq(testAttempts.passed, true));

    const successRate = totalAttempts.count > 0 ? 
      Math.round((passedAttempts.count / totalAttempts.count) * 100) : 0;

    // Get popular courses
    const popularCoursesData = await db
      .select({
        courseName: courses.name,
        completions: count(certificates.id)
      })
      .from(certificates)
      .innerJoin(studentSessions, eq(certificates.studentSessionId, studentSessions.id))
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .innerJoin(courses, eq(accessCodes.courseId, courses.id))
      .where(eq(certificates.isValid, true))
      .groupBy(courses.id, courses.name)
      .orderBy(desc(count(certificates.id)))
      .limit(5);

    const maxCompletions = Math.max(...popularCoursesData.map(c => c.completions), 1);
    const popularCourses = popularCoursesData.map(course => ({
      name: course.courseName,
      completions: course.completions,
      percentage: Math.round((course.completions / maxCompletions) * 100)
    }));

    // Get company performance
    const companyPerformanceData = await db
      .select({
        companyName: companies.name,
        employeesTrained: count(sql`DISTINCT ${studentSessions.studentEmail}`),
        totalAttempts: count(testAttempts.id),
        passedAttempts: count(sql`CASE WHEN ${testAttempts.passed} THEN 1 END`)
      })
      .from(companies)
      .innerJoin(accessCodes, eq(companies.id, accessCodes.companyId))
      .innerJoin(studentSessions, eq(accessCodes.id, studentSessions.accessCodeId))
      .leftJoin(testAttempts, eq(studentSessions.id, testAttempts.studentSessionId))
      .groupBy(companies.id, companies.name)
      .orderBy(desc(count(sql`DISTINCT ${studentSessions.studentEmail}`)))
      .limit(5);

    const companyPerformance = companyPerformanceData.map(company => ({
      name: company.companyName,
      employeesTrained: company.employeesTrained,
      successRate: company.totalAttempts > 0 ? 
        Math.round((company.passedAttempts / company.totalAttempts) * 100) : 0
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

  async getAnalyticsByCompany(companyId: number) {
    // Get active codes count for this company
    const [activeCodesResult] = await db.select({ count: count() })
      .from(accessCodes)
      .where(and(
        eq(accessCodes.companyId, companyId),
        eq(accessCodes.isActive, true),
        gte(accessCodes.validUntil, new Date().toISOString().split('T')[0])
      ));

    // Get total completions for this company
    const [completionsResult] = await db.select({ count: count() })
      .from(certificates)
      .innerJoin(studentSessions, eq(certificates.studentSessionId, studentSessions.id))
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .where(and(
        eq(accessCodes.companyId, companyId),
        eq(certificates.isValid, true)
      ));

    // Get in progress sessions for this company
    const [inProgressResult] = await db.select({ count: count() })
      .from(studentSessions)
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .where(and(
        eq(accessCodes.companyId, companyId),
        isNotNull(studentSessions.theoryCompletedAt),
        sql`NOT EXISTS (
          SELECT 1 FROM ${certificates} WHERE student_session_id = ${studentSessions.id}
        )`
      ));

    // Get employees trained count for this company
    const [employeesTrainedResult] = await db.select({ 
      count: count(sql`DISTINCT ${studentSessions.studentEmail}`) 
    })
      .from(studentSessions)
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .where(eq(accessCodes.companyId, companyId));

    // Calculate success rate for this company
    const [totalAttempts] = await db.select({ count: count() })
      .from(testAttempts)
      .innerJoin(studentSessions, eq(testAttempts.studentSessionId, studentSessions.id))
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .where(eq(accessCodes.companyId, companyId));

    const [passedAttempts] = await db.select({ count: count() })
      .from(testAttempts)
      .innerJoin(studentSessions, eq(testAttempts.studentSessionId, studentSessions.id))
      .innerJoin(accessCodes, eq(studentSessions.accessCodeId, accessCodes.id))
      .where(and(
        eq(accessCodes.companyId, companyId),
        eq(testAttempts.passed, true)
      ));

    const successRate = totalAttempts.count > 0 ? 
      Math.round((passedAttempts.count / totalAttempts.count) * 100) : 0;

    // Get courses offered by this company
    const coursesOfferedData = await db
      .select({
        courseName: courses.name,
        completions: count(certificates.id)
      })
      .from(courses)
      .innerJoin(accessCodes, eq(courses.id, accessCodes.courseId))
      .leftJoin(studentSessions, eq(accessCodes.id, studentSessions.accessCodeId))
      .leftJoin(certificates, and(
        eq(studentSessions.id, certificates.studentSessionId),
        eq(certificates.isValid, true)
      ))
      .where(eq(accessCodes.companyId, companyId))
      .groupBy(courses.id, courses.name)
      .orderBy(desc(count(certificates.id)));

    const maxCompletions = Math.max(...coursesOfferedData.map(c => c.completions), 1);
    const coursesOffered = coursesOfferedData.map(course => ({
      name: course.courseName,
      completions: course.completions,
      percentage: Math.round((course.completions / maxCompletions) * 100)
    }));

    // Get company name for performance data
    const company = await this.getCompany(companyId);
    
    return {
      activeCodes: activeCodesResult.count,
      totalCompletions: completionsResult.count,
      inProgress: inProgressResult.count,
      successRate,
      employeesTrained: employeesTrainedResult.count,
      coursesOffered, // Keep original field name
      popularCourses: coursesOffered, // Add for frontend compatibility
      companyPerformance: [{
        name: company?.name || 'Your Company',
        employeesTrained: employeesTrainedResult.count,
        successRate
      }]
    };
  }

  async getCompanyAccessCodesDetailed(companyId: number) {
    // Get all access codes for this company with course information
    const accessCodesData = await db
      .select({
        id: accessCodes.id,
        code: accessCodes.code,
        courseName: courses.name,
        maxParticipants: accessCodes.maxParticipants,
        validUntil: accessCodes.validUntil,
        isActive: accessCodes.isActive,
        theoryToTest: accessCodes.theoryToTest,
        usage: sql<number>`CAST((
          SELECT COUNT(*) FROM ${studentSessions} 
          WHERE access_code_id = ${accessCodes.id}
        ) AS INTEGER)`
      })
      .from(accessCodes)
      .innerJoin(courses, eq(accessCodes.courseId, courses.id))
      .where(eq(accessCodes.companyId, companyId))
      .orderBy(desc(accessCodes.createdAt));

    // For each access code, get detailed student data
    const detailedCodes = await Promise.all(
      accessCodesData.map(async (accessCode) => {
        // Get basic student session data
        const basicStudentsData = await db
          .select({
            sessionId: studentSessions.id,
            name: studentSessions.studentName,
            email: studentSessions.studentEmail,
            theoryCompletedAt: studentSessions.theoryCompletedAt,
            createdAt: studentSessions.createdAt,
          })
          .from(studentSessions)
          .where(eq(studentSessions.accessCodeId, accessCode.id))
          .orderBy(desc(studentSessions.createdAt));

        // For each student, get their latest test attempt data separately to avoid Drizzle subquery bugs
        const studentsData = await Promise.all(
          basicStudentsData.map(async (student) => {
            // Get latest test attempt for this specific session
            const [latestTest] = await db
              .select({
                percentage: testAttempts.percentage,
                passed: testAttempts.passed,
                completedAt: testAttempts.completedAt
              })
              .from(testAttempts)
              .where(eq(testAttempts.studentSessionId, student.sessionId))
              .orderBy(desc(testAttempts.completedAt))
              .limit(1);

            // Check for certificate
            const [certificate] = await db
              .select({ 
                id: certificates.id,
                issuedAt: certificates.issuedAt
              })
              .from(certificates)
              .where(and(
                eq(certificates.studentSessionId, student.sessionId),
                eq(certificates.isValid, true)
              ))
              .limit(1);

            return {
              sessionId: student.sessionId,
              name: student.name,
              email: student.email,
              theoryCompletedAt: student.theoryCompletedAt,
              testCompletedAt: latestTest?.completedAt || null,
              certificateIssuedAt: certificate?.issuedAt || null,
              createdAt: student.createdAt,
              testScore: latestTest?.percentage || null,
              passed: latestTest?.passed || null,
              certificateIssued: !!certificate
            };
          })
        );

        const students = studentsData.map(student => ({
          id: student.sessionId,
          name: student.name,
          email: student.email,
          theoryCompletedAt: student.theoryCompletedAt,
          testCompletedAt: student.testCompletedAt,
          certificateIssuedAt: student.certificateIssuedAt,
          testScore: student.testScore,
          passed: student.passed,
          certificateIssued: student.certificateIssued,
          lastActivity: student.certificateIssuedAt || student.testCompletedAt || student.theoryCompletedAt || student.createdAt
        }));

        return {
          id: accessCode.id,
          code: accessCode.code,
          courseName: accessCode.courseName,
          maxParticipants: accessCode.maxParticipants,
          validUntil: accessCode.validUntil,
          isActive: accessCode.isActive ?? false,
          theoryToTest: accessCode.theoryToTest ?? false,
          usage: accessCode.usage,
          students
        };
      })
    );

    return detailedCodes;
  }
}

export const storage = new DatabaseStorage();
