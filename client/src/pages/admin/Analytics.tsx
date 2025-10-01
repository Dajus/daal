import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getAuthHeaders, getUserInfo } from '@/lib/auth'
import { Key, GraduationCap, Clock, TrendingUp, Users } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import StatCards from '@/components/admin/analytics/StatCards.tsx'

interface AnalyticsData {
  activeCodes: number
  totalCompletions: number
  inProgress: number
  successRate: number
  popularCourses: Array<{
    name: string
    completions: number
    percentage: number
  }>
  companyPerformance: Array<{
    name: string
    employeesTrained: number
    successRate: number
  }>
}

interface DetailedAccessCode {
  id: number
  code: string
  courseName: string
  maxParticipants: number | null
  validUntil: string
  isActive: boolean
  theoryToTest: boolean
  usage: number
  students: Array<{
    id: number
    name: string
    email: string
    testCompletedAt: string | null
    theoryCompletedAt: string | null
    testScore: number | null
    passed: boolean | null
    certificateIssued: boolean
    lastActivity: string
  }>
}

const AdminAnalytics = () => {
  const userInfo = getUserInfo()
  const isCompanyAdmin = userInfo?.companyAdminId && !userInfo?.adminId

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst analytická data')
      return response.json()
    },
  })

  const { data: detailedCodes, isLoading: detailedLoading } = useQuery<DetailedAccessCode[]>({
    queryKey: ['/api/admin/company-access-codes-detailed'],
    queryFn: async () => {
      const response = await fetch('/api/admin/company-access-codes-detailed', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst detailní kódy')
      return response.json()
    },
    enabled: isCompanyAdmin,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Načítání analytiky...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <p className="text-gray-500 dark:text-gray-400">Nepodařilo se načíst analytická data</p>
      </div>
    )
  }

  const statCards = [
    {
      icon: Key,
      title: 'Aktivní kódy',
      value: analytics.activeCodes,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: GraduationCap,
      title: 'Dokončení',
      value: analytics.totalCompletions,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    },
    {
      icon: Clock,
      title: 'Probíhající',
      value: analytics.inProgress,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: TrendingUp,
      title: 'Úspěšnost',
      value: `${analytics.successRate}%`,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCards statCards={statCards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nejoblíbenější kurzy */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
            <CardTitle className="text-emerald-800 dark:text-emerald-300">Nejoblíbenější kurzy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analytics.popularCourses || []).map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{course.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{course.completions} dokončení</div>
                  </div>
                  <div className="w-24 ml-4">
                    <Progress value={course.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Výkonnost společností */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
            <CardTitle className="text-emerald-800 dark:text-emerald-300">Výkonnost společností</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analytics.companyPerformance || []).map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {company.employeesTrained} proškolených zaměstnanců
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      company.successRate >= 95
                        ? 'text-green-600 dark:text-green-400'
                        : company.successRate >= 90
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {company.successRate}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sekce detailních přístupových kódů - pouze pro firemní administrátory */}
      {isCompanyAdmin && (
        <div className="mt-8">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800">
              <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detailní přehled přístupových kódů a účastníků
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {detailedLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const groupedCodes = (detailedCodes || []).reduce(
                      (groups, accessCode) => {
                        const courseName = accessCode.courseName
                        if (!groups[courseName]) {
                          groups[courseName] = []
                        }
                        groups[courseName].push(accessCode)
                        return groups
                      },
                      {} as Record<string, DetailedAccessCode[]>,
                    )

                    return (
                      <Accordion type="multiple" className="space-y-4">
                        {Object.entries(groupedCodes).map(([courseName, codes]) => (
                          <AccordionItem
                            key={courseName}
                            value={`course-${courseName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="border border-emerald-200 dark:border-emerald-800 rounded-lg"
                          >
                            <AccordionTrigger className="hover:no-underline px-3 sm:px-4 py-2 sm:py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-t-lg">
                              <div className="flex items-center justify-between w-full text-left">
                                <div className="flex items-center gap-3">
                                  <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                  <div>
                                    <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                                      {courseName}
                                    </h3>
                                    <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                                      {codes.length} přístupových kódů •{' '}
                                      {codes.reduce((sum, code) => sum + Number(code.usage), 0)} celkových účastníků
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
                              <div className="space-y-4">
                                {codes.map((accessCode, index) => {
                                  if (accessCode.maxParticipants === 1) {
                                    const student = accessCode.students[0]
                                    console.log(accessCode.students)
                                    return (
                                      <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                          <div className="flex items-center gap-3 flex-wrap">
                                            <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded font-mono text-xs">
                                              {accessCode.code}
                                            </code>
                                            {student ? (
                                              <>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                  {student.name}
                                                </span>
                                                {student.testCompletedAt && (
                                                  <Badge
                                                    variant={student.passed ? 'default' : 'destructive'}
                                                    className="text-xs"
                                                  >
                                                    {student.passed ? '✓ Splněno' : '✗ Nesplněno'}
                                                  </Badge>
                                                )}
                                                {student.certificateIssued && (
                                                  <Badge variant="outline" className="text-xs">
                                                    Certifikát vydán
                                                  </Badge>
                                                )}
                                              </>
                                            ) : (
                                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Kód zatím nebyl použit
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                            <span>
                                              Platný do: {new Date(accessCode.validUntil).toLocaleDateString('cs-CZ')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }

                                  return (
                                    <Accordion
                                      key={index}
                                      type="multiple"
                                      className="border border-gray-200 dark:border-gray-600 rounded-lg"
                                    >
                                      <AccordionItem value={`access-code-${accessCode.id}`} className="border-none">
                                        <AccordionTrigger className="hover:no-underline pl-3 pr-2 sm:pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg">
                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left gap-2">
                                            <div className="flex items-center gap-3">
                                              <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded font-mono text-xs">
                                                {accessCode.code}
                                              </code>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                                              <span>
                                                Využití: {accessCode.usage}
                                                {accessCode.maxParticipants && ` / ${accessCode.maxParticipants}`}
                                              </span>
                                              <span>
                                                Platný do: {new Date(accessCode.validUntil).toLocaleDateString('cs-CZ')}
                                              </span>
                                            </div>
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-3 pb-3 pt-2">
                                          {/* Seznam studentů */}
                                          {accessCode.students.length > 0 ? (
                                            <div className="space-y-2">
                                              <h5 className="text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-1">
                                                Účastníci ({accessCode.students.length})
                                              </h5>
                                              <div className="grid gap-2">
                                                {accessCode.students.map((student, studentIndex) => (
                                                  <div
                                                    key={studentIndex}
                                                    className="bg-gray-50 dark:bg-gray-700/50 rounded p-2"
                                                  >
                                                    <div className="flex items-center">
                                                      <div className=" min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                          {student.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                          {student.email}
                                                        </div>
                                                      </div>

                                                      <div className="flex flex-wrap gap-1 ml-4">
                                                        {student.testCompletedAt && (
                                                          <Badge
                                                            variant={student.passed ? 'default' : 'destructive'}
                                                            className="text-xs"
                                                          >
                                                            {student.passed ? '✓ Splněno' : '✗ Nesplněno'}
                                                          </Badge>
                                                        )}

                                                        {student.certificateIssued && (
                                                          <Badge variant="outline" className="text-xs">
                                                            Certifikát vydán
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-center py-2 text-gray-500 dark:text-gray-400 text-sm">
                                              Kód zatím nebyl použit
                                            </div>
                                          )}
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  )
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )
                  })()}

                  {(!detailedCodes || detailedCodes.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Zatím nejsou k dispozici žádné přístupové kódy
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminAnalytics
