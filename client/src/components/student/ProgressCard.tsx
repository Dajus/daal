import { useLocation } from 'wouter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, Play, RotateCcw, Award } from 'lucide-react'

interface ProgressCardProps {
  progress: {
    session: {
      studentName: string
      studentEmail: string
    }
    course: {
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
}

const ProgressCard = ({ progress }: ProgressCardProps) => {
  const [, setLocation] = useLocation()

  const bestAttempt = progress.attempts.reduce((best, current) => {
    return current.score > (best?.score || 0) ? current : best
  }, progress.attempts[0])

  const overallProgress = progress.accessCode.theoryToTest
    ? progress.theoryCompleted && progress.passed
      ? 100
      : progress.theoryCompleted
        ? 80
        : progress.session
          ? 20
          : 0
    : progress.theoryCompleted
      ? 100
      : progress.session
        ? 50
        : 0

  const canRetakeTest =
    progress.accessCode.theoryToTest &&
    progress.theoryCompleted &&
    (!progress.passed || progress.attempts.length === 0) &&
    progress.attempts.length < progress.course.maxAttempts

  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mr-4">
            <Award className="text-emerald-600 dark:text-emerald-400 text-2xl h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{progress.course.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{progress.course.description}</p>
          </div>
        </div>

        {/* Ukazatel postupu */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Celkový postup</span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Sekce kurzu */}
        <div className={`grid grid-cols-1 ${progress.accessCode.theoryToTest ? 'md:grid-cols-2' : ''} gap-6`}>
          {/* Sekce teorie */}
          <Card
            className={`${progress.theoryCompleted ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {progress.theoryCompleted ? (
                    <CheckCircle className="text-emerald-600 text-xl h-6 w-6 mr-3" />
                  ) : (
                    <Clock className="text-gray-600 text-xl h-6 w-6 mr-3" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Teorie</h3>
                </div>
                <Badge
                  variant={progress.theoryCompleted ? 'default' : 'secondary'}
                  className={progress.theoryCompleted ? 'bg-emerald-100 text-emerald-800' : ''}
                >
                  {progress.theoryCompleted ? 'Dokončeno' : 'Čekající'}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {progress.theoryCompleted
                  ? 'Dokončili jste veškerý teoretický obsah'
                  : progress.accessCode.theoryToTest
                    ? 'Dokončete teorii před zahájením testu'
                    : 'Prostudujte si teoretický obsah kurzu'}
              </p>
              <Button
                onClick={() => setLocation('/student/theory')}
                variant={progress.theoryCompleted ? 'outline' : 'default'}
                className={
                  progress.theoryCompleted
                    ? 'text-emerald-600 border-emerald-600 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }
              >
                {progress.theoryCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Prohlédnout teorii
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Začít teorii
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sekce testu - zobrazit POUZE pokud je test vyžadován */}
          {progress.accessCode.theoryToTest && (
            <Card
              className={`${
                progress.passed
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                  : progress.testCompleted
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {progress.passed ? (
                      <CheckCircle className="text-emerald-600 text-xl h-6 w-6 mr-3" />
                    ) : progress.testCompleted ? (
                      <RotateCcw className="text-yellow-600 text-xl h-6 w-6 mr-3" />
                    ) : (
                      <Clock className="text-gray-600 text-xl h-6 w-6 mr-3" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test</h3>
                  </div>
                  <Badge
                    variant={progress.passed ? 'default' : progress.testCompleted ? 'secondary' : 'outline'}
                    className={
                      progress.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : progress.testCompleted
                          ? 'bg-yellow-100 text-yellow-800'
                          : ''
                    }
                  >
                    {progress.passed
                      ? 'Splněno'
                      : progress.testCompleted
                        ? `${progress.attempts.length}/${progress.course.maxAttempts} pokusů`
                        : 'Nezahájeno'}
                  </Badge>
                </div>

                {bestAttempt && (
                  <div className="mb-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      Nejlepší skóre: <strong>{bestAttempt.percentage}%</strong>
                      {progress.passed && ' (Splněno)'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Požadováno: {progress.course.passingScore}%
                    </p>
                  </div>
                )}

                {canRetakeTest && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Zbývá {progress.course.maxAttempts - progress.attempts.length} pokusů
                  </p>
                )}

                <div className="flex space-x-3">
                  {progress.theoryCompleted && (canRetakeTest || !progress.testCompleted) && (
                    <Button
                      onClick={() => setLocation('/student/test')}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {progress.testCompleted ? 'Opakovat test' : 'Začít test'}
                    </Button>
                  )}

                  {progress.passed && (
                    <Button
                      onClick={() => setLocation('/student/certificate')}
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary-light"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Zobrazit certifikát
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!progress.accessCode.theoryToTest && progress.theoryCompleted && (
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-emerald-600 text-xl h-6 w-6 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kurz dokončen</h3>
                  </div>
                  <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                    Dokončeno
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Gratulujeme! Úspěšně jste dokončili tento kurz. Můžete si stáhnout certifikát.
                </p>
                <Button
                  onClick={() => setLocation('/student/certificate')}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Zobrazit certifikát
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressCard
