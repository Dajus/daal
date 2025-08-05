import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Play, RotateCcw, Award } from "lucide-react";

interface ProgressCardProps {
  progress: {
    session: {
      studentName: string;
      studentEmail: string;
    };
    course: {
      name: string;
      description: string;
      passingScore: number;
      maxAttempts: number;
    };
    attempts: Array<{
      score: number;
      maxScore: number;
      percentage: string;
      passed: boolean;
      attemptNumber: number;
      completedAt: string;
    }>;
    theoryCompleted: boolean;
    testCompleted: boolean;
    passed: boolean;
  };
}

export default function ProgressCard({ progress }: ProgressCardProps) {
  const [, setLocation] = useLocation();

  const bestAttempt = progress.attempts.reduce((best, current) => {
    return current.score > (best?.score || 0) ? current : best;
  }, progress.attempts[0]);

  const overallProgress = progress.theoryCompleted && progress.passed ? 100 : 
                         progress.theoryCompleted ? 80 : 
                         progress.session ? 20 : 0;

  const canRetakeTest = progress.theoryCompleted && 
                       (!progress.passed || progress.attempts.length === 0) &&
                       progress.attempts.length < progress.course.maxAttempts;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mr-4">
            <Award className="text-primary text-2xl h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{progress.course.name}</h2>
            <p className="text-gray-600">{progress.course.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Course Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theory Section */}
          <Card className={`${progress.theoryCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {progress.theoryCompleted ? (
                    <CheckCircle className="text-green-600 text-xl h-6 w-6 mr-3" />
                  ) : (
                    <Clock className="text-gray-600 text-xl h-6 w-6 mr-3" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">Theory</h3>
                </div>
                <Badge variant={progress.theoryCompleted ? "default" : "secondary"} className={progress.theoryCompleted ? "bg-green-100 text-green-800" : ""}>
                  {progress.theoryCompleted ? "Completed" : "Pending"}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">
                {progress.theoryCompleted 
                  ? "You've completed all theory content"
                  : "Complete the theory before taking the test"
                }
              </p>
              <Button
                onClick={() => setLocation('/student/theory')}
                variant={progress.theoryCompleted ? "outline" : "default"}
                className={progress.theoryCompleted ? "text-green-600 border-green-600 hover:bg-green-50" : ""}
              >
                {progress.theoryCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review Theory
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Theory
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Test Section */}
          <Card className={`${
            progress.passed ? 'bg-green-50 border-green-200' : 
            progress.testCompleted ? 'bg-yellow-50 border-yellow-200' : 
            'bg-gray-50 border-gray-200'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {progress.passed ? (
                    <CheckCircle className="text-green-600 text-xl h-6 w-6 mr-3" />
                  ) : progress.testCompleted ? (
                    <RotateCcw className="text-yellow-600 text-xl h-6 w-6 mr-3" />
                  ) : (
                    <Clock className="text-gray-600 text-xl h-6 w-6 mr-3" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">Test</h3>
                </div>
                <Badge 
                  variant={progress.passed ? "default" : progress.testCompleted ? "secondary" : "outline"}
                  className={
                    progress.passed ? "bg-green-100 text-green-800" :
                    progress.testCompleted ? "bg-yellow-100 text-yellow-800" : ""
                  }
                >
                  {progress.passed ? "Passed" : 
                   progress.testCompleted ? `${progress.attempts.length}/${progress.course.maxAttempts} attempts` : 
                   "Not Started"}
                </Badge>
              </div>
              
              {bestAttempt && (
                <div className="mb-2">
                  <p className="text-gray-600">
                    Best score: <strong>{bestAttempt.percentage}%</strong> 
                    {progress.passed && " (Passed)"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Required: {progress.course.passingScore}%
                  </p>
                </div>
              )}
              
              {canRetakeTest && (
                <p className="text-sm text-gray-500 mb-4">
                  {progress.course.maxAttempts - progress.attempts.length} attempts remaining
                </p>
              )}

              <div className="flex space-x-3">
                {progress.theoryCompleted && (canRetakeTest || !progress.testCompleted) && (
                  <Button
                    onClick={() => setLocation('/student/test')}
                    className="bg-primary text-white hover:bg-primary-dark"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {progress.testCompleted ? "Retake Test" : "Start Test"}
                  </Button>
                )}
                
                {progress.passed && (
                  <Button
                    onClick={() => setLocation('/student/certificate')}
                    variant="outline"
                    className="text-primary border-primary hover:bg-primary-light"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
