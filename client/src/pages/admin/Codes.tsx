import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logout, isAuthenticated } from '@/lib/auth'
import { LogOut, ArrowLeft } from 'lucide-react'
import { LoadingOverlay } from '@/components/ui/spinner'
import CodeGenerator from '@/components/admin/code-generator'

const AdminCodesPage = () => {
  const [, setLocation] = useLocation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/')
    }
  }, [setLocation])

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout(() => setLocation('/'))
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="h-10 w-auto"
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=80"
                alt="DAAL Logo"
              />
              <Badge className="ml-4 bg-gray-900 text-white">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setLocation('/admin')} variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Access Code Management</h1>
            <p className="text-gray-600 mt-1">Generate and manage access codes for courses</p>
          </div>

          {/* Code Generator Component */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CodeGenerator />
          </div>
        </div>
      </div>

      {/* Loading Overlay for Logout */}
      {isLoggingOut && <LoadingOverlay title="Odhlašování..." description="Přesměrování na hlavní stránku" />}
    </div>
  )
}

export default AdminCodesPage
