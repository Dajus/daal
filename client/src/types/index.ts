export interface Course {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
  description: string | null;
  isActive: boolean;
  passingScore: number;
  timeLimitMinutes: number | null;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AccessCode {
  id: number;
  code: string;
  courseId: number;
  companyId: number | null;
  maxParticipants: number | null;
  unlimitedParticipants: boolean;
  theoryToTest: boolean;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
  createdBy: number | null;
  createdAt: string;
}

export interface TheorySlide {
  id: number;
  courseId: number;
  title: string | null;
  content: string | null;
  slideOrder: number;
  mediaUrls: string[];
  estimatedReadTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestQuestion {
  id: number;
  courseId: number;
  questionText: string;
  questionType: string;
  options: any;
  correctAnswers: any;
  explanation: string | null;
  mediaUrl: string | null;
  points: number;
  difficultyLevel: string;
  questionOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSession {
  id: number;
  accessCodeId: number;
  studentName: string;
  studentEmail: string;
  theoryStartedAt: string | null;
  theoryCompletedAt: string | null;
  theoryProgress: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface TestAttempt {
  id: number;
  studentSessionId: number;
  answers: any;
  score: number;
  maxScore: number;
  percentage: string;
  passed: boolean;
  timeTakenSeconds: number | null;
  startedAt: string;
  completedAt: string | null;
  attemptNumber: number;
  ipAddress: string | null;
}

export interface Certificate {
  id: number;
  studentSessionId: number;
  testAttemptId: number | null;
  certificateNumber: string;
  certificateUrl: string | null;
  verificationCode: string;
  qrCodeUrl: string | null;
  issuedAt: string;
  isValid: boolean;
}

export interface Admin {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

export interface LoginResponse {
  token: string;
  admin?: Admin;
  session?: {
    id: number;
    studentName: string;
    studentEmail: string;
    course: Course;
    company: Company | null;
  };
}
