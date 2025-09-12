import { useEffect, useState, useCallback } from 'react'
import { Switch, Route, useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logout, isAuthenticated, getAuthHeaders } from '@/lib/auth'
import { LogOut, GraduationCap } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import ProgressCard from '@/components/student/ProgressCard.tsx'
import TheoryViewer from '@/components/student/TheoryViewer.tsx'
import TestInterface from '@/components/student/TestInterface.tsx'
import CertificateViewer from '@/components/student/CertificateViewer'
import { t } from '@/lib/translations'
import { LoadingScreen, LoadingOverlay } from '@/components/ui/spinner'

interface StudentProgress {
  session: {
    id: number
    studentName: string
    studentEmail: string
    theoryStartedAt: string | null
    theoryCompletedAt: string | null
  }
  course: {
    id: number
    name: string
    description: string
    passingScore: number
    maxAttempts: number
  }
  accessCode: {
    code: string
    theoryToTest: boolean
  }
  attempts: Array<{
    id: number
    score: number
    maxScore: number
    percentage: string
    passed: boolean
    attemptNumber: number
    completedAt: string
  }>
  theoryCompleted: boolean
  testCompleted: boolean
  passed: boolean
}

// Navigation component
const Navigation = ({
  studentName,
  onLogout,
  isLoggingOut,
}: {
  studentName: string
  onLogout: () => void
  isLoggingOut: boolean
}) => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">DAAL</span>
          </div>
          <Badge className="ml-4 bg-emerald-600 text-white">{t('student')}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={onLogout}
            variant="outline"
            disabled={isLoggingOut}
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
      </div>
    </div>
  </nav>
)

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <LoadingScreen title={t('loading')} description="Načítání vašeho pokroku" />
  </div>
)

// Error state component
const ErrorState = ({ onBackClick }: { onBackClick: () => void }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-600 dark:text-red-400 mb-4">{t('error')}</p>
      <Button onClick={onBackClick}>{t('back')}</Button>
    </div>
  </div>
)

// Dashboard header component
const DashboardHeader = ({ studentName, courseName }: { studentName: string; courseName: string }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      {t('welcomeBack')}, {studentName}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-1">{courseName}</p>
  </div>
)

// Main dashboard content
const DashboardContent = ({ progress }: { progress: StudentProgress }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <DashboardHeader studentName={progress.session.studentName} courseName={progress.course.name} />
    <ProgressCard progress={progress} />
  </div>
)

// Routes configuration
const useRoutesConfig = (progress: StudentProgress) => [
  {
    path: '/student/theory',
    component: <TheoryViewer progress={progress} />,
  },
  {
    path: '/student/test',
    component: <TestInterface progress={progress} />,
  },
  {
    path: '/student/certificate',
    component: <CertificateViewer progress={progress} />,
  },
]

// Content router component
const ContentRouter = ({ progress }: { progress: StudentProgress }) => {
  const routes = useRoutesConfig(progress)

  return (
    <div className="pt-24">
      <Switch>
        {routes.map((route, index) => (
          <Route key={index} path={route.path}>
            {route.component}
          </Route>
        ))}
        <Route>
          <DashboardContent progress={progress} />
        </Route>
      </Switch>
    </div>
  )
}

// Custom hook for student progress
const useStudentProgress = () => {
  return useQuery<StudentProgress>({
    queryKey: ['/api/student/progress'],
    queryFn: async () => {
      const response = await fetch('/api/student/progress', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch progress')
      return response.json()
    },
  })
}

// Custom hook for authentication
const useAuthRedirect = () => {
  const [location, setLocation] = useLocation()

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/')
    }
  }, [setLocation])

  return { setLocation }
}

// Custom hook for logout
const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { setLocation } = useAuthRedirect()

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout(() => setLocation('/'))
    }, 1500)
  }, [setLocation])

  return { isLoggingOut, handleLogout }
}

const StudentDashboard = () => {
  const { setLocation } = useAuthRedirect()
  const { isLoggingOut, handleLogout } = useLogout()
  const { data: progress, isLoading, error } = useStudentProgress()

  // Handle back navigation
  const handleBackClick = useCallback(() => {
    setLocation('/')
  }, [setLocation])

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !progress) {
    return <ErrorState onBackClick={handleBackClick} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation studentName={progress.session.studentName} onLogout={handleLogout} isLoggingOut={isLoggingOut} />

      <ContentRouter progress={progress} />

      {/* Loading Overlay for Logout */}
      {isLoggingOut && <LoadingOverlay title="Odhlašování..." description="Přesměrování na hlavní stránku" />}
    </div>
  )
}

export default StudentDashboard
