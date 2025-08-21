import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertTriangle } from "lucide-react";
import type { TestQuestion } from "@shared/schema";
import { t } from "@/lib/translations";
import { LoadingScreen } from "@/components/ui/spinner";

interface TestResult {
  attempt: {
    id: number;
    score: number;
    maxScore: number;
    percentage: string;
    passed: boolean;
    timeTakenSeconds: number;
    attemptNumber: number;
    answers: Array<{
      questionId: number;
      selectedAnswer: string;
      isCorrect: boolean;
      correctAnswer: string;
      explanation?: string;
    }>;
  };
  certificate: any;
  attemptsRemaining: number;
}

export default function TestInterface({ progress }: { progress?: any }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showResultsReview, setShowResultsReview] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: questions = [], isLoading } = useQuery<TestQuestion[]>({
    queryKey: ['/api/student/test'],
    queryFn: async () => {
      const response = await fetch('/api/student/test', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch test questions');
      return response.json();
    },
    enabled: testStarted
  });

  const submitTestMutation = useMutation({
    mutationFn: async (testData: { answers: Record<number, any>; timeTakenSeconds: number }) => {
      const response = await apiRequest('/api/student/test/submit', {
        method: 'POST',
        body: JSON.stringify(testData),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json() as Promise<TestResult>;
    },
    onSuccess: (result) => {
      setTestResult(result);
      queryClient.invalidateQueries({ queryKey: ['/api/student/progress'] });
      
      if (result.attempt.passed) {
        toast({
          title: t('congratulations'),
          description: `${t('testPassed')} ${result.attempt.percentage}%`
        });
      } else {
        toast({
          title: t('testNotPassed'),
          description: `${t('score')}: ${result.attempt.percentage}%. ${result.attemptsRemaining} ${t('attemptsRemaining')}.`,
          variant: "destructive"
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Timer effect
  useEffect(() => {
    if (testStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining]);

  const startTest = () => {
    setTestStarted(true);
    setStartTime(Date.now());
    
    // Set timer if there's a time limit
    if (progress?.course?.timeLimitMinutes) {
      setTimeRemaining(progress.course.timeLimitMinutes * 60);
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmitTest = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    submitTestMutation.mutate({
      answers,
      timeTakenSeconds: timeTaken
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  // Show result screen
  if (testResult) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            testResult.attempt.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {testResult.attempt.passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {testResult.attempt.passed ? 'Test úspěšně dokončen!' : 'Test nebyl úspěšný'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{testResult.attempt.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('score')}</div>
            </div>
            <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {testResult.attempt.answers ? 
                  testResult.attempt.answers.filter((answer: any) => answer.isCorrect).length : 
                  Math.round((testResult.attempt.score / testResult.attempt.maxScore) * (testResult.questionsCount || questions.length))
                }/{testResult.questionsCount || questions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Správné odpovědi</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {formatTime(testResult.attempt.timeTakenSeconds)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Strávený čas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${testResult.attempt.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {testResult.attempt.passed ? 'ÚSPĚCH' : 'NEÚSPĚCH'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stav</div>
            </div>
          </div>
          
          {/* Detailed Analytics */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analýza výkonu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Informace o testu</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Kurz:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{progress?.course?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Otázky:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{testResult.questionsCount || questions.length} celkem</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nutné skóre:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{progress?.course?.passingScore || 70}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pokus číslo:</span>
                    <span className="font-medium text-gray-900 dark:text-white">#{testResult.attempt.attemptNumber}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Vaše výsledky</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Správné odpovědi:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {testResult.attempt.answers ? 
                        testResult.attempt.answers.filter((answer: any) => answer.isCorrect).length : 
                        Math.round((testResult.attempt.score / testResult.attempt.maxScore) * (testResult.questionsCount || questions.length))
                      }/{testResult.questionsCount || questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Přesnost:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{testResult.attempt.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Čas na otázku:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{Math.round(testResult.attempt.timeTakenSeconds / (testResult.questionsCount || questions.length))}s průměr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hodnocení:</span>
                    <span className={`font-medium ${testResult.attempt.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {testResult.attempt.passed ? 'ÚSPĚCH' : 'NEÚSPĚCH'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Answers Button */}
          <div className="flex justify-center mb-6">
            <Button 
              onClick={() => setShowResultsReview(!showResultsReview)}
              variant="outline"
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              {showResultsReview ? 'Skrýt detaily' : t('reviewAnswers')}
            </Button>
          </div>

          {/* Results Review Section */}
          {showResultsReview && Array.isArray(testResult.attempt.answers) && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('testResults')} - {t('reviewAnswers')}</h3>
              <div className="space-y-4">
                {testResult.attempt.answers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {t('questionNumber')} {index + 1}: {question?.questionText}
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${
                          answer.isCorrect 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {answer.isCorrect ? 'Správně' : 'Nesprávně'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{t('yourAnswer')}: </span>
                          <span className={answer.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                            {answer.selectedAnswer}
                          </span>
                        </div>
                        
                        {!answer.isCorrect && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{t('correctAnswer')}: </span>
                            <span className="text-green-700 dark:text-green-400">{answer.correctAnswer}</span>
                          </div>
                        )}
                        
                        {answer.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded">
                            <span className="font-medium text-blue-900 dark:text-blue-200">{t('explanation')}: </span>
                            <span className="text-blue-800 dark:text-blue-300">{answer.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Fallback if answers array is not available */}
          {showResultsReview && !Array.isArray(testResult.attempt.answers) && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('testResults')}</h3>
              <p className="text-gray-600 dark:text-gray-400">Detaily odpovědí nejsou k dispozici pro tento pokus.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => setLocation('/student')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {t('backToDashboard')}
            </Button>
            
            {testResult.attempt.passed && testResult.certificate && (
              <Button 
                onClick={() => setLocation('/student/certificate')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary-light"
              >
                {t('viewCertificate')}
              </Button>
            )}
            
            {!testResult.attempt.passed && testResult.attemptsRemaining > 0 && (
              <Button 
                onClick={() => {
                  setTestResult(null);
                  setTestStarted(false);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setFlaggedQuestions(new Set());
                }}
                variant="outline"
              >
                {t('retakeTest')} ({testResult.attemptsRemaining} {t('attemptsRemaining')})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pre-test screen
  if (!testStarted) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="h-6 w-6 text-primary" />
            {progress?.course?.name} - {t('test')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Pokyny k testu</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                <li>• Odpovězte na všechny otázky podle svých nejlepších schopností</li>
                <li>• Můžete přecházet mezi otázkami a měnit své odpovědi</li>
                <li>• Označte si otázky, které chcete zkontrolovat před odesláním</li>
                {progress?.course?.timeLimitMinutes && (
                  <li>• Časový limit: {progress.course.timeLimitMinutes} minut</li>
                )}
                <li>• Potřebné skóre k úspěšnému dokončení: {progress?.course?.passingScore || 80}%</li>
                <li>• Povolený počet pokusů: {progress?.course?.maxAttempts || 3}</li>
              </ul>
            </div>

            {progress?.attempts && progress.attempts.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-300">Předchozí pokusy:</h4>
                <div className="mt-2 space-y-1">
                  {progress.attempts.map((attempt: any, index: number) => (
                    <div key={attempt.id} className="flex justify-between text-sm text-yellow-800 dark:text-yellow-300">
                      <span>Pokus {attempt.attemptNumber}</span>
                      <span>{attempt.percentage}% - {attempt.passed ? 'Úspěch' : 'Neúspěch'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <Button 
                onClick={startTest}
                size="lg"
                className="bg-primary hover:bg-primary-dark px-8 py-3"
              >
                Zahájit test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state with enhanced transition experience
  if (isLoading) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-12">
          <LoadingScreen title="Načítání testu..." description="Příprava otázek a testovacího prostředí" />
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Pro tento kurz nejsou přidány žádné otázky.</p>
        </CardContent>
      </Card>
    );
  }

  // Review mode
  if (showReview) {
    return (
      <div className="space-y-6">
        {/* Review header */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 text-center mb-2">
                  Přehled odpovědí
                </h2>
                <p className="text-emerald-700 dark:text-emerald-400 text-center">
                  Zkontrolujte své odpovědi před odevzdáním testu
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions overview */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {questions.map((question, index) => {
                const isAnswered = answers[question.id] !== undefined;
                const isFlagged = flaggedQuestions.has(question.id);
                
                return (
                  <div 
                    key={question.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      !isAnswered ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' : 
                      isFlagged ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' : 
                      'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                    }`}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setShowReview(false);
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Otázka {index + 1}</span>
                      <div className="flex items-center gap-2">
                        {isFlagged && <Flag className="h-4 w-4 text-yellow-600" />}
                        <Badge variant={isAnswered ? "default" : "destructive"} className={
                          isAnswered ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300" : "bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-300"
                        }>
                          {isAnswered ? 'Odpovězeno' : 'Neodpovězeno'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {question.questionText}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setShowReview(false)}
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                Pokračovat v úpravách
              </Button>
              <Button 
                onClick={handleSubmitTest}
                disabled={submitTestMutation.isPending || answeredCount < questions.length}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {submitTestMutation.isPending ? 'Odevzdávání...' : 'Odevzdat test'}
              </Button>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main test interface
  return (
    <div className="space-y-6">
      {/* Progress Navigation - Fixed at top */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-4 z-10">
          <CardContent className="p-3 sm:p-4 lg:p-6">
          {/* Progress Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            {/* Progress and timer row */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {currentQuestionIndex + 1} z {questions.length}
              </span>
              <Progress value={progressPercentage} className="flex-1 h-2" />
              {timeRemaining !== null && (
                <div className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full border ${
                  timeRemaining < 300 ? 'text-red-600 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                }`}>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>
            
            {/* Navigation buttons row */}
            <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs sm:text-sm px-2 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t('previousQuestion')}</span>
                <span className="sm:hidden">Zpět</span>
              </Button>
              
              <Button 
                onClick={() => setShowReview(true)}
                variant="outline"
                size="sm"
                className="border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Přehled otázek</span>
                <span className="sm:hidden">Přehled</span>
              </Button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button 
                  onClick={() => setShowReview(true)}
                  size="sm"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Odevzdat test</span>
                  <span className="sm:hidden">Dokončit</span>
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  size="sm"
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">{t('nextQuestion')}</span>
                  <span className="sm:hidden">Další</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Question header card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                Otázka {currentQuestionIndex + 1}
              </h2>
              <Button
                onClick={() => toggleFlag(currentQuestion.id)}
                variant="ghost"
                size="sm"
                className={`${flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'} text-xs sm:text-sm px-2 sm:px-3`}
              >
                <Flag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{flaggedQuestions.has(currentQuestion.id) ? 'Označeno' : 'Označit'}</span>
                <span className="sm:hidden">{flaggedQuestions.has(currentQuestion.id) ? '✓' : '?'}</span>
              </Button>
            </div>
            <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 mt-2">
              Odpověděno: {answeredCount}/{questions.length} otázek ({Math.round(progressPercentage)}%)
            </div>
          </div>
          
          {/* Question content card */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Question media */}
            {currentQuestion.mediaUrl && (
              <div className="mb-4 sm:mb-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                  <div className="flex justify-center">
                    <img 
                      src={currentQuestion.mediaUrl} 
                      alt="Ilustrace k otázce"
                      className="max-w-full max-h-64 sm:max-h-80 lg:max-h-96 rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105 cursor-zoom-in"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Answer options */}
            <div className="space-y-2 sm:space-y-3">
              {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option: string, index: number) => (
                <label 
                  key={index}
                  className={`flex items-start p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    (['multiple_choice', 'multiple_select'].includes(currentQuestion.questionType || '')
                      ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option)
                      : answers[currentQuestion.id] === option)
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                  }`}
                >
                  <input
                    type={['multiple_choice', 'multiple_select'].includes(currentQuestion.questionType || '') ? 'checkbox' : 'radio'}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={
                      ['multiple_choice', 'multiple_select'].includes(currentQuestion.questionType || '')
                        ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option)
                        : answers[currentQuestion.id] === option
                    }
                    onChange={(e) => {
                      if (['multiple_choice', 'multiple_select'].includes(currentQuestion.questionType || '')) {
                        const currentAnswers = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] : [];
                        if (e.target.checked) {
                          handleAnswerChange(currentQuestion.id, [...currentAnswers, option]);
                        } else {
                          handleAnswerChange(currentQuestion.id, currentAnswers.filter((a: string) => a !== option));
                        }
                      } else {
                        handleAnswerChange(currentQuestion.id, option);
                      }
                    }}
                    className="mt-1 mr-3 sm:mr-4 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-800 dark:text-gray-200 flex-1 text-sm sm:text-base">{option}</span>
                </label>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
