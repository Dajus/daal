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
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            testResult.attempt.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {testResult.attempt.passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {testResult.attempt.passed ? 'Test Passed!' : 'Test Not Passed'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{testResult.attempt.percentage}%</div>
              <div className="text-sm text-gray-600">{t('score')}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {testResult.attempt.score}/{testResult.attempt.maxScore}
              </div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatTime(testResult.attempt.timeTakenSeconds)}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${testResult.attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                {testResult.attempt.passed ? 'PASSED' : 'FAILED'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
          
          {/* Detailed Analytics */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Test Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course:</span>
                    <span className="font-medium">{progress?.course?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{questions.length} total</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-medium">{progress?.course?.passingScore || 70}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attempt Number:</span>
                    <span className="font-medium">#{testResult.attempt.attemptNumber}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Your Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="font-medium text-green-600">{testResult.attempt.score}/{testResult.attempt.maxScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-medium">{testResult.attempt.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Per Question:</span>
                    <span className="font-medium">{Math.round(testResult.attempt.timeTakenSeconds / questions.length)}s avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <span className={`font-medium ${testResult.attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.attempt.passed ? 'PASS' : 'FAIL'}
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
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {showResultsReview ? 'Skrýt detaily' : t('reviewAnswers')}
            </Button>
          </div>

          {/* Results Review Section */}
          {showResultsReview && Array.isArray(testResult.attempt.answers) && (
            <div className="bg-white border rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('testResults')} - {t('reviewAnswers')}</h3>
              <div className="space-y-4">
                {testResult.attempt.answers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {t('questionNumber')} {index + 1}: {question?.questionText}
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${
                          answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {answer.isCorrect ? 'Správně' : 'Nesprávně'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">{t('yourAnswer')}: </span>
                          <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {answer.selectedAnswer}
                          </span>
                        </div>
                        
                        {!answer.isCorrect && (
                          <div>
                            <span className="font-medium text-gray-700">{t('correctAnswer')}: </span>
                            <span className="text-green-700">{answer.correctAnswer}</span>
                          </div>
                        )}
                        
                        {answer.explanation && (
                          <div className="bg-blue-50 p-3 rounded">
                            <span className="font-medium text-blue-900">{t('explanation')}: </span>
                            <span className="text-blue-800">{answer.explanation}</span>
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
            <div className="bg-white border rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('testResults')}</h3>
              <p className="text-gray-600">Detaily odpovědí nejsou k dispozici pro tento pokus.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => setLocation('/student')}
              className="bg-primary hover:bg-primary-dark"
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            {progress?.course?.name} - Test
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Test Instructions</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Answer all questions to the best of your ability</li>
                <li>• You can navigate between questions and change your answers</li>
                <li>• Flag questions you want to review before submitting</li>
                {progress?.course?.timeLimitMinutes && (
                  <li>• Time limit: {progress.course.timeLimitMinutes} minutes</li>
                )}
                <li>• Passing score: {progress?.course?.passingScore || 80}%</li>
                <li>• Attempts allowed: {progress?.course?.maxAttempts || 3}</li>
              </ul>
            </div>

            {progress?.attempts && progress.attempts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900">Previous Attempts:</h4>
                <div className="mt-2 space-y-1">
                  {progress.attempts.map((attempt: any, index: number) => (
                    <div key={attempt.id} className="flex justify-between text-sm text-yellow-800">
                      <span>Attempt {attempt.attemptNumber}</span>
                      <span>{attempt.percentage}% - {attempt.passed ? 'Passed' : 'Failed'}</span>
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
                Start Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No test questions available for this course.</p>
        </CardContent>
      </Card>
    );
  }

  // Review mode
  if (showReview) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Review Your Answers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 mb-6">
            {questions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;
              const isFlagged = flaggedQuestions.has(question.id);
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    !isAnswered ? 'border-red-200 bg-red-50' : 
                    isFlagged ? 'border-yellow-200 bg-yellow-50' : 
                    'border-gray-200'
                  }`}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setShowReview(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {isFlagged && <Flag className="h-4 w-4 text-yellow-600" />}
                      <Badge variant={isAnswered ? "default" : "destructive"}>
                        {isAnswered ? 'Answered' : 'Not Answered'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
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
            >
              Continue Editing
            </Button>
            <Button 
              onClick={handleSubmitTest}
              disabled={submitTestMutation.isPending || answeredCount < questions.length}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitTestMutation.isPending ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main test interface
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {progress?.course?.name} - Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center space-x-4">
            {timeRemaining !== null && (
              <div className={`text-lg font-semibold ${timeRemaining < 300 ? 'text-red-600' : 'text-primary'}`}>
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Progress */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {answeredCount}/{questions.length} answered
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Question {currentQuestionIndex + 1}</h4>
            <Button
              onClick={() => toggleFlag(currentQuestion.id)}
              variant="ghost"
              size="sm"
              className={flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : 'text-gray-400'}
            >
              <Flag className="h-4 w-4" />
              {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
            </Button>
          </div>
          
          <p className="text-gray-800 mb-6 text-lg leading-relaxed">
            {currentQuestion.questionText}
          </p>

          {/* Question media */}
          {currentQuestion.mediaUrl && (
            <img 
              src={currentQuestion.mediaUrl} 
              alt="Question illustration"
              className="w-full max-w-md mx-auto rounded-lg shadow-sm mb-6"
            />
          )}

          {/* Answer options */}
          <div className="space-y-3">
            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option: string, index: number) => (
              <label 
                key={index}
                className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
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
                  className="mt-1 mr-4"
                />
                <span className="text-gray-800 flex-1">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowReview(true)}
              variant="outline"
            >
              Review Questions
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button 
                onClick={() => setShowReview(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Review & Submit
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="bg-primary hover:bg-primary-dark flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
