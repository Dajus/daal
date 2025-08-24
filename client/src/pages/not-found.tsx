import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { useCallback } from 'react'

// Icon wrapper component
const ErrorIcon = () => (
  <div className="flex justify-center mb-6">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
      <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
    </div>
  </div>
)

// Error message component
const ErrorMessage = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Stránka nebyla nalezena</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
      Omlouváme se, ale stránka kterou hledáte neexistuje nebo byla přesunuta.
    </p>
  </div>
)

// Navigation buttons component
const NavigationButtons = ({ onGoHome, onGoBack }: { onGoHome: () => void; onGoBack: () => void }) => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center">
    <Button onClick={onGoHome} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
      <Home className="h-4 w-4" />
      Domovská stránka
    </Button>
    <Button
      variant="outline"
      onClick={onGoBack}
      className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Zpět
    </Button>
  </div>
)

// Custom hook for navigation
const useNavigation = () => {
  const [, setLocation] = useLocation()

  const goToHome = useCallback(() => {
    setLocation('/')
  }, [setLocation])

  const goBack = useCallback(() => {
    window.history.back()
  }, [])

  return { goToHome, goBack }
}

const NotFound = () => {
  const { goToHome, goBack } = useNavigation()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <ErrorIcon />
          <ErrorMessage />
          <NavigationButtons onGoHome={goToHome} onGoBack={goBack} />
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
