import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthHeaders } from "@/lib/auth";
import { Book, HelpCircle, Plus, Edit, Trash2, Clock } from "lucide-react";
import type { Course, TheorySlide, TestQuestion } from "@/types";

export default function CourseEditor() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    }
  });

  // Fetch theory slides for selected course
  const { data: theorySlides = [] } = useQuery<TheorySlide[]>({
    queryKey: ['/api/admin/courses', selectedCourseId, 'theory'],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const response = await fetch(`/api/admin/courses/${selectedCourseId}/theory`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch theory slides');
      return response.json();
    },
    enabled: !!selectedCourseId
  });

  // Fetch test questions for selected course
  const { data: testQuestions = [] } = useQuery<TestQuestion[]>({
    queryKey: ['/api/admin/courses', selectedCourseId, 'questions'],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const response = await fetch(`/api/admin/courses/${selectedCourseId}/questions`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch test questions');
      return response.json();
    },
    enabled: !!selectedCourseId
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Course List */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses</h3>
        <div className="space-y-2">
          {courses.map(course => (
            <Button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              variant={selectedCourseId === course.id ? "default" : "outline"}
              className={`w-full justify-start text-left p-4 h-auto ${
                selectedCourseId === course.id 
                  ? "bg-primary text-white" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div>
                <div className="font-medium">{course.name}</div>
                <div className="text-sm opacity-75 mt-1">
                  {theorySlides.length} slides • {testQuestions.length} questions
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Course Content Editor */}
      <div className="lg:col-span-2">
        {selectedCourse ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedCourse.name} - Content Editor
                </h3>
                <Badge variant="secondary" className="mt-1">
                  {selectedCourse.abbreviation}
                </Badge>
              </div>
            </div>

            <Card>
              <Tabs defaultValue="theory" className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="theory"
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                    >
                      <Book className="h-4 w-4" />
                      Theory
                    </TabsTrigger>
                    <TabsTrigger 
                      value="test"
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Test
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Theory Content Tab */}
                <TabsContent value="theory" className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Theory Slides</h4>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Slide
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {theorySlides.map((slide, index) => (
                        <Card key={slide.id} className={`${index === 0 ? 'border-l-4 border-l-primary bg-primary-light' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {slide.slideOrder}. {slide.title || `Slide ${slide.slideOrder}`}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {slide.content ? 
                                    (slide.content.length > 100 ? 
                                      slide.content.substring(0, 100) + '...' : 
                                      slide.content
                                    ) : 
                                    'No content added yet'
                                  }
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {slide.estimatedReadTime} min read
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {theorySlides.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No theory slides created yet
                        </div>
                      )}
                    </div>

                    {/* Rich Text Editor Preview */}
                    {theorySlides.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Content Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border border-gray-300 rounded-lg">
                            {/* Toolbar */}
                            <div className="border-b border-gray-300 p-2 bg-gray-50 rounded-t-lg">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <strong>B</strong>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <em>I</em>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <u>U</u>
                                </Button>
                                <div className="border-l border-gray-300 mx-2"></div>
                                <Button variant="ghost" size="sm">
                                  <span>•</span>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  📷
                                </Button>
                              </div>
                            </div>
                            {/* Editor Content */}
                            <div className="p-4 min-h-32">
                              <p className="text-gray-700">
                                <strong>Introduction to BOZP</strong><br /><br />
                                Occupational Health and Safety (BOZP) is fundamental to creating a safe workplace environment. This course covers:
                                <br /><br />
                                • Risk identification and assessment<br />
                                • Personal protective equipment (PPE)<br />
                                • Emergency procedures<br />
                                • Legal requirements and compliance
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Test Content Tab */}
                <TabsContent value="test" className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Test Questions</h4>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {testQuestions.map((question, index) => (
                        <Card key={question.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-medium text-gray-500">
                                Question {index + 1} • {question.questionType.replace('_', ' ')} • {question.points} points
                              </span>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-3">{question.questionText}</h5>
                            
                            {Array.isArray(question.options) && (
                              <div className="space-y-2">
                                {question.options.map((option: string, optionIndex: number) => {
                                  const isCorrect = Array.isArray(question.correctAnswers) ? 
                                    question.correctAnswers.includes(option) :
                                    question.correctAnswers === option;
                                  
                                  return (
                                    <div key={optionIndex} className="flex items-center">
                                      <input 
                                        type={question.questionType === 'multiple_choice' ? 'checkbox' : 'radio'} 
                                        className="mr-2" 
                                        checked={isCorrect}
                                        disabled
                                      />
                                      <label className={`text-sm ${isCorrect ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                        {option}
                                      </label>
                                      {isCorrect && <span className="ml-2 text-green-600">✓</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      {testQuestions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No test questions created yet
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a course to edit its content
          </div>
        )}
      </div>
    </div>
  );
}
