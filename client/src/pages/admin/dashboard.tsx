import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Key, Book, BarChart3, LogOut, Building2 } from 'lucide-react'
import { logout, isAuthenticated, getUserInfo } from '@/lib/auth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LoadingOverlay } from '@/components/ui/spinner'
import { t } from '@/lib/translations'

import CodeGenerator from '@/components/admin/code-generator'
import CourseEditor from '@/components/admin/course-editor'
import AdminAnalytics from './analytics'
import CompaniesPage from './companies'

// Navigation component
const Navigation = ({ onLogout, isLoggingOut }: { onLogout: () => void; isLoggingOut: boolean }) => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div className="flex justify-between items-center h-14 sm:h-16">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Key className="text-white h-6 w-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">DAAL</span>
          </div>
          <Badge className="ml-4 bg-emerald-600 text-white hidden sm:inline-flex">{t('admin')}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            disabled={isLoggingOut}
            className="flex items-center gap-1 sm:gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
            <span className="sm:hidden">Odhlásit</span>
          </Button>
        </div>
      </div>
    </div>
  </nav>
)

// Header component
const DashboardHeader = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('adminDashboard')}</h1>
    <p className="text-gray-600 dark:text-gray-400 mt-1">Správa kurzů, přístupových kódů a analytiky</p>
  </div>
)

// Tab trigger component
const TabTriggerWithIcon = ({
  value,
  icon: Icon,
  fullText,
  shortText,
}: {
  value: string
  icon: any
  fullText: string
  shortText: string
}) => (
  <TabsTrigger
    value={value}
    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base whitespace-nowrap"
  >
    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
    <span className="hidden sm:inline">{fullText}</span>
    <span className="sm:hidden">{shortText}</span>
  </TabsTrigger>
)

// Tab content wrapper
const TabContentWrapper = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <TabsContent value={value} className="p-3 sm:p-6">
    {children}
  </TabsContent>
)

// Main tabs configuration
const useTabsConfig = (isSuperAdmin: boolean) => {
  return [
    ...(isSuperAdmin
      ? [
          {
            value: 'codes',
            icon: Key,
            fullText: t('accessCodes'),
            shortText: 'Kódy',
            component: <CodeGenerator />,
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            value: 'courses',
            icon: Book,
            fullText: t('courseManagement'),
            shortText: 'Kurzy',
            component: <CourseEditor />,
          },
        ]
      : []),
    {
      value: 'analytics',
      icon: BarChart3,
      fullText: t('analytics'),
      shortText: 'Analytics',
      component: <AdminAnalytics />,
    },
    ...(isSuperAdmin
      ? [
          {
            value: 'companies',
            icon: Building2,
            fullText: t('companies'),
            shortText: 'Firmy',
            component: <CompaniesPage />,
          },
        ]
      : []),
  ]
}

const AdminDashboard = () => {
  const [location, setLocation] = useLocation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const userInfo = getUserInfo()
  const isSuperAdmin = userInfo?.adminId && !userInfo?.companyAdminId

  // Get tabs configuration
  const tabsConfig = useTabsConfig(isSuperAdmin)
  const defaultTab = isSuperAdmin ? 'codes' : 'analytics'

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/')
    }
  }, [setLocation])

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout(() => setLocation('/'))
    }, 1500)
  }, [setLocation])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation onLogout={handleLogout} isLoggingOut={isLoggingOut} />

      {/* Content */}
      <div className="pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />

          {/* Main Content */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Tabs defaultValue={defaultTab} className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent min-w-fit">
                  {tabsConfig.map((tab) => (
                    <TabTriggerWithIcon
                      key={tab.value}
                      value={tab.value}
                      icon={tab.icon}
                      fullText={tab.fullText}
                      shortText={tab.shortText}
                    />
                  ))}
                </TabsList>
              </div>

              {tabsConfig.map((tab) => (
                <TabContentWrapper key={tab.value} value={tab.value}>
                  {tab.component}
                </TabContentWrapper>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Loading Overlay for Logout */}
      {isLoggingOut && <LoadingOverlay title="Odhlašování..." description="Přesměrování na hlavní stránku" />}
    </div>
  )
}

export default AdminDashboard
