import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import CertificateViewer from '@/components/student/CertificateViewer'

const CertificatePage = () => {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => setLocation('/student')}
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <CertificateViewer />
      </div>
    </div>
  )
}

export default CertificatePage
