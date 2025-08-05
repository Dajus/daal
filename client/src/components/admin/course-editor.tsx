import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Book, HelpCircle, Plus, Edit, Trash2, Clock } from "lucide-react";
import type { Course, TheorySlide, TestQuestion } from "@/types";
import SlideFormDialog from "./slide-form-dialog";
import { t } from "@/lib/translations";

export default function CourseEditor() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<TheorySlide | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<TestQuestion | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Mutation for creating theory slide
  const createSlideMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/courses/${selectedCourseId}/theory`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] });
      toast({ title: "Success", description: "Theory slide created successfully" });
      setSlideDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create theory slide", variant: "destructive" });
    }
  });

  // Mutation for updating theory slide
  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return apiRequest(`/api/admin/theory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] });
      toast({ title: "Success", description: "Theory slide updated successfully" });
      setSlideDialogOpen(false);
      setEditingSlide(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update theory slide", variant: "destructive" });
    }
  });

  // Mutation for deleting theory slide
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/theory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] });
      toast({ title: "Success", description: "Theory slide deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete theory slide", variant: "destructive" });
    }
  });

  // Mutation for creating test question
  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/courses/${selectedCourseId}/questions`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] });
      toast({ title: "Success", description: "Test question created successfully" });
      setQuestionDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create test question", variant: "destructive" });
    }
  });

  // Mutation for updating test question
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return apiRequest(`/api/admin/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] });
      toast({ title: "Success", description: "Test question updated successfully" });
      setQuestionDialogOpen(false);
      setEditingQuestion(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update test question", variant: "destructive" });
    }
  });

  // Mutation for deleting test question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] });
      toast({ title: "Success", description: "Test question deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete test question", variant: "destructive" });
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Course List */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('courses')}</h3>
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
                  {selectedCourse.name} - {t('courseEditor')}
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
                      {t('theory')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="test"
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
                    >
                      <HelpCircle className="h-4 w-4" />
                      {t('test')}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Theory Content Tab */}
                <TabsContent value="theory" className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">{t('theory')} - Snímky</h4>
                      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2" onClick={() => {
                            setEditingSlide(null);
                            setSlideDialogOpen(true);
                          }}>
                            <Plus className="h-4 w-4" />
                            {t('addSlide')}
                          </Button>
                        </DialogTrigger>
                        <SlideFormDialog 
                          slide={editingSlide}
                          onSave={(data) => {
                            if (editingSlide) {
                              updateSlideMutation.mutate({ id: editingSlide.id, data });
                            } else {
                              createSlideMutation.mutate(data);
                            }
                          }}
                          isLoading={createSlideMutation.isPending || updateSlideMutation.isPending}
                        />
                      </Dialog>
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
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setEditingSlide(slide);
                                  setSlideDialogOpen(true);
                                }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  if (confirm('Are you sure you want to delete this slide?')) {
                                    deleteSlideMutation.mutate(slide.id);
                                  }
                                }}>
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
                      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2" onClick={() => {
                            setEditingQuestion(null);
                            setQuestionDialogOpen(true);
                          }}>
                            <Plus className="h-4 w-4" />
                            Add Question
                          </Button>
                        </DialogTrigger>
                        <QuestionFormDialog 
                          question={editingQuestion}
                          onSave={(data) => {
                            if (editingQuestion) {
                              updateQuestionMutation.mutate({ id: editingQuestion.id, data });
                            } else {
                              createQuestionMutation.mutate(data);
                            }
                          }}
                          isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                        />
                      </Dialog>
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
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setEditingQuestion(question);
                                  setQuestionDialogOpen(true);
                                }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  if (confirm('Are you sure you want to delete this question?')) {
                                    deleteQuestionMutation.mutate(question.id);
                                  }
                                }}>
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



// Question Form Dialog Component
function QuestionFormDialog({ question, onSave, isLoading }: {
  question: TestQuestion | null;
  onSave: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    questionText: question?.questionText || '',
    questionType: question?.questionType || 'single_choice',
    options: question?.options || ['', '', '', ''],
    correctAnswers: question?.correctAnswers || [],
    points: question?.points || 1,
    questionOrder: question?.questionOrder || 1
  });

  const handleSave = () => {
    const cleanOptions = formData.options.filter((opt: string) => opt.trim() !== '');
    onSave({
      ...formData,
      options: cleanOptions,
      correctAnswers: formData.questionType === 'single_choice' 
        ? formData.correctAnswers[0] || ''
        : formData.correctAnswers
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const toggleCorrectAnswer = (option: string) => {
    if (formData.questionType === 'single_choice') {
      setFormData({ ...formData, correctAnswers: [option] });
    } else {
      const newCorrectAnswers = formData.correctAnswers.includes(option)
        ? formData.correctAnswers.filter((ans: string) => ans !== option)
        : [...formData.correctAnswers, option];
      setFormData({ ...formData, correctAnswers: newCorrectAnswers });
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{question ? t('editQuestion') : t('addQuestion')}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="questionText">{t('questionText')}</Label>
          <Textarea
            id="questionText"
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            placeholder={t('questionText')}
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="questionType">Question Type</Label>
            <Select 
              value={formData.questionType} 
              onValueChange={(value) => setFormData({ ...formData, questionType: value, correctAnswers: [] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_choice">Single Choice</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
              min="1"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="questionOrder">Question Order</Label>
            <Input
              id="questionOrder"
              type="number"
              value={formData.questionOrder}
              onChange={(e) => setFormData({ ...formData, questionOrder: parseInt(e.target.value) || 1 })}
              min="1"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Answer Options</Label>
          <div className="space-y-2 mt-2">
            {formData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type={formData.questionType === 'single_choice' ? 'radio' : 'checkbox'}
                  checked={formData.correctAnswers.includes(option)}
                  onChange={() => toggleCorrectAnswer(option)}
                  disabled={!option.trim()}
                />
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !formData.questionText.trim() || formData.correctAnswers.length === 0}
          >
            {isLoading ? t('saving') : (question ? t('updateQuestion') : t('createQuestion'))}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
