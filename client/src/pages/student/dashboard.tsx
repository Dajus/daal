import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout, isAuthenticated, getAuthHeaders } from "@/lib/auth";
import { LogOut, GraduationCap } from "lucide-react";
import ProgressCard from "@/components/student/progress-card";
import TheoryViewer from "@/components/student/theory-viewer";
import TestInterface from "@/components/student/test-interface";
import CertificateViewer from "@/components/student/certificate-viewer";
import { t } from "@/lib/translations";

interface StudentProgress {
  session: {
    id: number;
    studentName: string;
    studentEmail: string;
    theoryStartedAt: string | null;
    theoryCompletedAt: string | null;
  };
  course: {
    id: number;
    name: string;
    description: string;
    passingScore: number;
    maxAttempts: number;
  };
  accessCode: {
    code: string;
    theoryToTest: boolean;
  };
  attempts: Array<{
    id: number;
    score: number;
    maxScore: number;
    percentage: string;
    passed: boolean;
    attemptNumber: number;
    completedAt: string;
  }>;
  theoryCompleted: boolean;
  testCompleted: boolean;
  passed: boolean;
}

export default function StudentDashboard() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const { data: progress, isLoading, error } = useQuery<StudentProgress>({
    queryKey: ['/api/student/progress'],
    queryFn: async () => {
      const response = await fetch('/api/student/progress', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    }
  });

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('error')}</p>
          <Button onClick={() => setLocation('/')}>{t('back')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">DAAL</span>
              </div>
              <Badge className="ml-4 bg-emerald-600 text-white">{t('student')}</Badge>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <Switch>
          <Route path="/student/theory">
            <TheoryViewer progress={progress} />
          </Route>
          <Route path="/student/test">
            <TestInterface progress={progress} />
          </Route>
          <Route path="/student/certificate">
            <CertificateViewer progress={progress} />
          </Route>
          <Route>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('welcomeBack')}, {progress.session.studentName}
                </h1>
                <p className="text-gray-600 mt-1">{progress.course.name}</p>
              </div>

              {/* Progress Card */}
              <ProgressCard progress={progress} />
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
