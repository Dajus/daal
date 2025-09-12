import { useLocation } from 'wouter'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import TheoryViewer from '@/components/student/TheoryViewer.tsx'

// Page header component
const PageHeader = ({ onBackClick }: { onBackClick: () => void }) => (
  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Button
        onClick={onBackClick}
        variant="ghost"
        className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
      >
        <ArrowLeft className="h-4 w-4" />
        Zpět na dashboard
      </Button>
    </div>
  </div>
)

// Main content wrapper
const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
)

// Custom hook for navigation
const useNavigation = () => {
  const [, setLocation] = useLocation()

  const navigateToStudentDashboard = useCallback(() => {
    setLocation('/student')
  }, [setLocation])

  return { navigateToStudentDashboard }
}

const TheoryPage = () => {
  const { navigateToStudentDashboard } = useNavigation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader onBackClick={navigateToStudentDashboard} />

      <ContentWrapper>
        <TheoryViewer />
      </ContentWrapper>
    </div>
  )
}

export default TheoryPage
