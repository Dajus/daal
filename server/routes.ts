import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { 
  insertAdminSchema, 
  insertAccessCodeSchema, 
  insertStudentSessionSchema,
  insertTestAttemptSchema,
  insertCertificateSchema,
  insertTheorySlideSchema,
  insertTestQuestionSchema,
  insertCourseSchema,
  insertCompanySchema
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for admin authentication
const authenticateAdmin = async (req: any, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
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

// Generate access code with course prefix
function generateCourseCode(courseName: string): string {
  const prefixes: Record<string, string> = {
    'Školení řidičů řídících služební vozidlo zaměstnavatele': 'DRIV',
    'Školení BOZP a PO': 'BOZP',
    'Theory test': 'THEO',
    'Školení zaměstnanců a OSVČ pro provádění práce ve výškách (PVV)': 'HEIG',
    'Hygiena a první pomoc': 'HYGI',
    'Nakládání s odpady': 'WAST',
    'Školení pro zdravotnické pracovníky - BRC': 'MEDB',
    'Školení pro nezdravotnické pracovníky - BRC': 'NONM',
    'Školení přepravy odpadu - BRC': 'TRAN',
    'Health and Safety (H&S) and Fire Protection (FP) training': 'HSFT',
    'Szkolenia BHP i PPOŻ': 'PLHS',
    'навчання з охорони праці (OHS) та протипожежного захисту (FP)': 'UAHS',
    'Přeprava nebezpečných věcí v praxi - Dohoda ADR': 'HADR'
  };
  
  const prefix = prefixes[courseName] || 'COUR';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/admin/login", async (req: Request, res: Response) => {
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

      // Update last login
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

  app.post("/api/auth/student/login", async (req: Request, res: Response) => {
    try {
      const { studentName, studentEmail, accessCode } = req.body;
      
      if (!studentName || !studentEmail || !accessCode) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const code = await storage.getAccessCodeByCode(accessCode);
      if (!code || !code.isActive) {
        return res.status(401).json({ message: "Invalid access code" });
      }

      // Check if code is expired
      const now = new Date();
      const validUntil = new Date(code.validUntil);
      if (validUntil < now) {
        return res.status(401).json({ message: "Access code has expired" });
      }

      // Check usage limits - count active sessions instead of total usage
      if (!code.unlimitedParticipants && code.maxParticipants) {
        const activeSessionsCount = await storage.getActiveSessionsCountForCode(code.id);
        if (activeSessionsCount >= code.maxParticipants) {
          return res.status(401).json({ message: "Maximum participants currently active for this code" });
        }
      }

      // Allow multiple users with same email but different names for classroom scenarios
      // Create or get existing student session by name+email+code combination
      let session = await storage.getStudentSessionByNameEmailAndCode(studentName, studentEmail, code.id);
      if (!session) {
        session = await storage.createStudentSession({
          accessCodeId: code.id,
          studentName,
          studentEmail,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || null
        });
      }

      const token = jwt.sign({ sessionId: session.id }, JWT_SECRET, { expiresIn: "7d" });
      
      res.json({
        token,
        session: {
          id: session.id,
          studentName: session.studentName,
          studentEmail: session.studentEmail,
          course: await storage.getCourse(code.courseId!),
          company: code.companyId ? await storage.getCompany(code.companyId) : null
        }
      });
    } catch (error) {
      console.error("Student login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/courses", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/companies", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/companies", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(data);
      res.json(company);
    } catch (error) {
      console.error("Create company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/courses", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(data);
      res.json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/access-codes", authenticateAdmin, async (req: any, res: Response) => {
    try {
      const data = insertAccessCodeSchema.parse(req.body);
      
      const course = await storage.getCourse(data.courseId!);
      if (!course) {
        return res.status(400).json({ message: "Course not found" });
      }

      // Generate multiple codes if specified
      const codeCount = data.maxParticipants && !data.unlimitedParticipants ? data.maxParticipants : 1;
      const codes = [];

      for (let i = 0; i < Math.min(codeCount, 100); i++) { // Limit to 100 codes max
        const code = generateCourseCode(course.name);
        const accessCode = await storage.createAccessCode({
          ...data,
          code,
          createdBy: req.admin.id
        } as any);
        codes.push(accessCode);
      }

      res.json(codes);
    } catch (error) {
      console.error("Create access codes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/access-codes", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const codes = await storage.getAllAccessCodes();
      res.json(codes);
    } catch (error) {
      console.error("Get access codes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Course content management
  app.get("/api/admin/courses/:courseId/theory", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const slides = await storage.getTheorySlidesByCourse(courseId);
      res.json(slides);
    } catch (error) {
      console.error("Get theory slides error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Image upload endpoint
  app.post("/api/admin/upload-image", authenticateAdmin, upload.single('image'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert buffer to base64 data URL for simplicity
      // In production, you'd want to upload to actual object storage
      const imageBase64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      const imageUrl = `data:${mimeType};base64,${imageBase64}`;

      res.json({ imageUrl });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/admin/courses/:courseId/theory", authenticateAdmin, async (req: Request, res: Response) => {
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

  app.put("/api/admin/theory/:slideId", authenticateAdmin, async (req: Request, res: Response) => {
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

  app.delete("/api/admin/theory/:slideId", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const slideId = parseInt(req.params.slideId);
      await storage.deleteTheorySlide(slideId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete theory slide error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/courses/:courseId/questions", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const questions = await storage.getTestQuestionsByCourse(courseId);
      res.json(questions);
    } catch (error) {
      console.error("Get test questions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/courses/:courseId/questions", authenticateAdmin, async (req: Request, res: Response) => {
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

  app.put("/api/admin/questions/:questionId", authenticateAdmin, async (req: Request, res: Response) => {
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

  app.delete("/api/admin/questions/:questionId", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      await storage.deleteTestQuestion(questionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete test question error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student routes (with session authentication)
  const authenticateStudent = async (req: any, res: Response, next: any) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
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

  app.get("/api/student/progress", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const course = await storage.getCourse(accessCode!.courseId!);
      const attempts = await storage.getTestAttemptsBySession(session.id);
      
      res.json({
        session,
        course,
        accessCode,
        attempts,
        theoryCompleted: !!session.theoryCompletedAt,
        testCompleted: attempts.length > 0,
        passed: attempts.some(a => a.passed)
      });
    } catch (error) {
      console.error("Get student progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/student/theory", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const slides = await storage.getTheorySlidesByCourse(accessCode!.courseId!);
      
      res.json(slides);
    } catch (error) {
      console.error("Get theory content error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/student/theory/complete", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const result = await storage.markTheoryComplete(session.id);
      
      res.json({ success: true, theoryToTest: result.theoryToTest });
    } catch (error) {
      console.error("Mark theory complete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/student/test", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const questions = await storage.getTestQuestionsByCourse(accessCode!.courseId!);
      
      // Randomize questions and options
      const shuffledQuestions = questions
        .sort(() => Math.random() - 0.5)
        .map(q => ({
          ...q,
          options: Array.isArray(q.options) ? (q.options as any[]).sort(() => Math.random() - 0.5) : q.options
        }));
      
      res.json(shuffledQuestions);
    } catch (error) {
      console.error("Get test questions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/student/test/submit", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const { answers, timeTakenSeconds } = req.body;
      
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const questions = await storage.getTestQuestionsByCourse(accessCode!.courseId!);
      const course = await storage.getCourse(accessCode!.courseId!);
      
      // Calculate score and track answer details
      let score = 0;
      let maxScore = 0;
      const answerDetails: Array<{
        questionId: number;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string | null;
      }> = [];
      
      questions.forEach(question => {
        const questionPoints = question.points || 1;
        maxScore += questionPoints;
        const userAnswer = answers[question.id];
        const correctAnswers = question.correctAnswers;
        
        let isCorrect = false;
        if (Array.isArray(correctAnswers)) {
          if (Array.isArray(userAnswer) && 
              userAnswer.length === correctAnswers.length &&
              userAnswer.every(a => correctAnswers.includes(a))) {
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
          selectedAnswer: Array.isArray(userAnswer) ? userAnswer.join(', ') : String(userAnswer || ''),
          correctAnswer: Array.isArray(correctAnswers) ? correctAnswers.join(', ') : String(correctAnswers || ''),
          isCorrect,
          explanation: question.explanation || null
        });
      });
      
      const percentage = (score / maxScore) * 100;
      const passed = percentage >= (course!.passingScore || 80);
      
      // Get attempt number
      const existingAttempts = await storage.getTestAttemptsBySession(session.id);
      const attemptNumber = existingAttempts.length + 1;
      
      if (attemptNumber > (course!.maxAttempts || 3)) {
        return res.status(400).json({ message: "Maximum attempts exceeded" });
      }
      
      const attempt = await storage.createTestAttempt({
        studentSessionId: session.id,
        answers: answers,
        score,
        maxScore,
        percentage: percentage.toString(),
        passed,
        timeTakenSeconds,
        startedAt: new Date(Date.now() - (timeTakenSeconds * 1000)),
        completedAt: new Date(),
        attemptNumber,
        ipAddress: req.ip
      });
      
      // Generate certificate if passed
      let certificate = null;
      if (passed) {
        const certificateNumber = `CERT-${accessCode!.code}-${Date.now()}`;
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
        attemptsRemaining: (course!.maxAttempts || 3) - attemptNumber
      });
    } catch (error) {
      console.error("Submit test error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/student/certificate", authenticateStudent, async (req: any, res: Response) => {
    try {
      const session = req.session;
      const certificate = await storage.getCertificateBySession(session.id);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      
      const accessCode = await storage.getAccessCode(session.accessCodeId);
      const course = await storage.getCourse(accessCode!.courseId!);
      const company = accessCode!.companyId ? await storage.getCompany(accessCode!.companyId) : null;
      
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

  // Certificate verification (public endpoint)
  app.get("/api/verify/:verificationCode", async (req: Request, res: Response) => {
    try {
      const { verificationCode } = req.params;
      const certificate = await storage.getCertificateByVerificationCode(verificationCode);
      
      if (!certificate || !certificate.isValid) {
        return res.status(404).json({ message: "Certificate not found or invalid" });
      }
      
      const session = await storage.getStudentSession(certificate.studentSessionId || 0);
      const accessCode = await storage.getAccessCode(session!.accessCodeId || 0);
      const course = await storage.getCourse(accessCode!.courseId!);
      const company = accessCode!.companyId ? await storage.getCompany(accessCode!.companyId) : null;
      
      res.json({
        valid: true,
        certificate,
        student: {
          name: session!.studentName
        },
        course: course!.name,
        company: company?.name,
        issuedAt: certificate.issuedAt
      });
    } catch (error) {
      console.error("Verify certificate error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
