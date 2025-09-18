import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import { apiRequest } from '@/lib/queryClient'
import { Book, HelpCircle, Plus, Edit, Trash2 } from 'lucide-react'
import type { Course, TheorySlide, TestQuestion } from '@/types'
import SlideFormDialog from './SlideFormDialog'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import NewCourseForm from '@/components/admin/courseEditor/NewCourseForm.tsx'
import QuestionFormDialog from '@/components/admin/courseEditor/QuestionFormDialog.tsx'
import SortableQuestionItem from '@/components/admin/courseEditor/SortableQuestionItem.tsx'
import EditCourseForm from '@/components/admin/courseEditor/EditCourseForm.tsx'
import SortableSlideItem from '@/components/admin/courseEditor/SortableSlideItem.tsx'

const CourseEditor = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [slideDialogOpen, setSlideDialogOpen] = useState(false)
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<TheorySlide | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<TestQuestion | null>(null)
  const [newCourseDialogOpen, setNewCourseDialogOpen] = useState(false)
  const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Načtení společností pro výběr
  const { data: companies = [] } = useQuery({
    queryKey: ['/api/admin/companies'],
    queryFn: async () => {
      const response = await fetch('/api/admin/companies', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst společnosti')
      return response.json()
    },
  })

  // Načtení kurzů
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst kurzy')
      return response.json()
    },
  })

  // Načtení teoretických snímků pro vybraný kurz
  const { data: theorySlides = [] } = useQuery<TheorySlide[]>({
    queryKey: ['/api/admin/courses', selectedCourseId, 'theory'],
    queryFn: async () => {
      if (!selectedCourseId) return []
      const response = await fetch(`/api/admin/courses/${selectedCourseId}/theory`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst teoretické snímky')
      return response.json()
    },
    enabled: !!selectedCourseId,
    staleTime: 30000, // Cache na 30 sekund
  })

  // Načtení testovacích otázek pro vybraný kurz
  const { data: testQuestions = [] } = useQuery<TestQuestion[]>({
    queryKey: ['/api/admin/courses', selectedCourseId, 'questions'],
    queryFn: async () => {
      if (!selectedCourseId) return []
      const response = await fetch(`/api/admin/courses/${selectedCourseId}/questions`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Nepodařilo se načíst testovací otázky')
      return response.json()
    },
    enabled: !!selectedCourseId,
    staleTime: 30000, // Cache na 30 sekund
  })

  // Optimalizováno: Zobrazit počty pouze pro vybraný kurz pro lepší výkon
  const selectedCourseCounts = selectedCourseId
    ? {
        slides: theorySlides.length,
        questions: testQuestions.length,
      }
    : { slides: 0, questions: 0 }

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Mutace pro smazání kurzu
  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Kurz smazán',
        description: 'Kurz a všechny související data byly úspěšně smazány.',
      })
      // Reset výběru pokud byl smazaný kurz vybraný
      if (selectedCourseId) {
        setSelectedCourseId(null)
      }
      // Obnovit všechna související data pro zajištění konzistence
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] })
      queryClient.invalidateQueries({ queryKey: ['/api/admin/access-codes'] })
    },
    onError: (error) => {
      console.error('Chyba při mazání kurzu:', error)
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se smazat kurz.',
        variant: 'destructive',
      })
    },
  })

  // Mutace pro vytvoření teoretického snímku
  const createSlideMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/courses/${selectedCourseId}/theory`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] })
      toast({ title: 'Úspěch', description: 'Teoretický snímek byl úspěšně vytvořen' })
      setSlideDialogOpen(false)
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se vytvořit teoretický snímek', variant: 'destructive' })
    },
  })

  // Mutace pro aktualizaci teoretického snímku
  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/admin/theory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: (_, { data }) => {
      // Zobrazit toast a zavřít dialog pouze pokud se nejedná o drag operaci (má pouze slideOrder)
      if (Object.keys(data).length > 1 || !data.slideOrder) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] })
        toast({ title: 'Úspěch', description: 'Teoretický snímek byl úspěšně aktualizován' })
        setSlideDialogOpen(false)
        setEditingSlide(null)
      }
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se aktualizovat teoretický snímek', variant: 'destructive' })
    },
  })

  // Mutace pro smazání teoretického snímku
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/theory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'theory'] })
      toast({ title: 'Úspěch', description: 'Teoretický snímek byl úspěšně smazán' })
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se smazat teoretický snímek', variant: 'destructive' })
    },
  })

  // Mutace pro vytvoření testovací otázky
  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/courses/${selectedCourseId}/questions`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] })
      toast({ title: 'Úspěch', description: 'Testovací otázka byla úspěšně vytvořena' })
      setQuestionDialogOpen(false)
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se vytvořit testovací otázku', variant: 'destructive' })
    },
  })

  // Mutace pro aktualizaci testovací otázky
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/admin/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: (_, { data }) => {
      // Zobrazit toast a zavřít dialog pouze pokud se nejedná o drag operaci (má pouze questionOrder)
      if (Object.keys(data).length > 1 || !data.questionOrder) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] })
        toast({ title: 'Úspěch', description: 'Testovací otázka byla úspěšně aktualizována' })
        setQuestionDialogOpen(false)
        setEditingQuestion(null)
      }
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se aktualizovat testovací otázku', variant: 'destructive' })
    },
  })

  // Mutace pro smazání testovací otázky
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses', selectedCourseId, 'questions'] })
      toast({ title: 'Úspěch', description: 'Testovací otázka byla úspěšně smazána' })
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se smazat testovací otázku', variant: 'destructive' })
    },
  })

  // Mutace pro vytvoření nového kurzu
  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] })
      toast({ title: 'Úspěch', description: 'Kurz byl úspěšně vytvořen' })
      setNewCourseDialogOpen(false)
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se vytvořit kurz', variant: 'destructive' })
    },
  })

  // Mutace pro aktualizaci kurzu
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/admin/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] })
      toast({ title: 'Úspěch', description: 'Kurz byl úspěšně upraven' })
      setEditCourseDialogOpen(false)
      setEditingCourse(null)
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se upravit kurz', variant: 'destructive' })
    },
  })

  // Mutace pro vytvoření nové společnosti
  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/admin/companies', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies'] })
      toast({ title: 'Úspěch', description: 'Společnost byla úspěšně vytvořena' })
      setNewCompanyDialogOpen(false)
    },
    onError: () => {
      toast({ title: 'Chyba', description: 'Nepodařilo se vytvořit společnost', variant: 'destructive' })
    },
  })

  // Zpracování přeřazení snímků
  const handleSlideReorder = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = theorySlides.findIndex((slide) => slide.id.toString() === active.id)
    const newIndex = theorySlides.findIndex((slide) => slide.id.toString() === over.id)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    const reorderedSlides = arrayMove(theorySlides, oldIndex, newIndex)

    // Okamžitě aktualizovat cache s novým pořadím
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      slideOrder: index + 1,
    }))

    queryClient.setQueryData(['/api/admin/courses', selectedCourseId, 'theory'], updatedSlides)

    // Aktualizovat pouze snímky, které se skutečně přesunuly v backendu
    const startIndex = Math.min(oldIndex, newIndex)
    const endIndex = Math.max(oldIndex, newIndex)

    for (let i = startIndex; i <= endIndex; i++) {
      const slide = reorderedSlides[i]
      const newOrder = i + 1

      updateSlideMutation.mutate({ id: slide.id, data: { slideOrder: newOrder } }, { onSuccess: () => {} })
    }
  }

  // Zpracování přeřazení otázek
  const handleQuestionReorder = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = testQuestions.findIndex((q) => q.id.toString() === active.id)
    const newIndex = testQuestions.findIndex((q) => q.id.toString() === over.id)

    if (oldIndex === newIndex) return

    const reorderedQuestions = arrayMove(testQuestions, oldIndex, newIndex)

    // Okamžitě aktualizovat cache s novým pořadím
    const updatedQuestions = reorderedQuestions.map((question, index) => ({
      ...question,
      questionOrder: index + 1,
    }))

    queryClient.setQueryData(['/api/admin/courses', selectedCourseId, 'questions'], updatedQuestions)

    // Aktualizovat pouze otázky, které se skutečně přesunuly v backendu
    const startIndex = Math.min(oldIndex, newIndex)
    const endIndex = Math.max(oldIndex, newIndex)

    for (let i = startIndex; i <= endIndex; i++) {
      const question = reorderedQuestions[i]
      const newOrder = i + 1

      updateQuestionMutation.mutate({ id: question.id, data: { questionOrder: newOrder } }, { onSuccess: () => {} })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Seznam kurzů */}
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kurzy</h3>
          <Dialog open={newCourseDialogOpen} onOpenChange={setNewCourseDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-1" />
                Nový kurz
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Vytvořit nový kurz</DialogTitle>
              </DialogHeader>
              <NewCourseForm onSubmit={(data) => createCourseMutation.mutate(data)} />
            </DialogContent>
          </Dialog>

          {/* Dialog pro úpravu kurzu */}
          <Dialog open={editCourseDialogOpen} onOpenChange={setEditCourseDialogOpen}>
            <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Upravit kurz</DialogTitle>
              </DialogHeader>
              {editingCourse && (
                <EditCourseForm
                  course={editingCourse}
                  onSubmit={(data) => updateCourseMutation.mutate({ id: editingCourse.id, data })}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {courses.map((course) => (
            <div key={course.id} className="relative group">
              <Button
                onClick={() => setSelectedCourseId(course.id)}
                variant={selectedCourseId === course.id ? 'default' : 'outline'}
                className={`w-full justify-start text-left p-4 h-auto pr-12 ${
                  selectedCourseId === course.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div>
                  <span className="font-medium">{course.name}</span>
                  <div className="text-sm opacity-75 mt-1">
                    {selectedCourseId === course.id
                      ? `${selectedCourseCounts.slides} snímků • ${selectedCourseCounts.questions} otázek`
                      : 'Vyberte pro zobrazení obsahu'}
                  </div>
                </div>
              </Button>

              {/* Tlačítka pro úpravu a smazání */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingCourse(course)
                    setEditCourseDialogOpen(true)
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (
                      window.confirm(
                        `Opravdu chcete smazat kurz "${course.name}"?\n\nToto smaže:\n• Všechny teoretické snímky\n• Všechny testovací otázky\n• Všechny přístupové kódy\n• Všechny studijní relace\n• Všechny certifikáty\n\nTato akce je nevratná!`,
                      )
                    ) {
                      deleteCourse.mutate(course.id)
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor obsahu kurzu */}
      <div className="lg:col-span-2">
        {selectedCourse ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCourse.name} - Editor kurzu
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {selectedCourse.abbreviation}
                </Badge>
              </div>
            </div>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Tabs defaultValue="theory" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="theory"
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Book className="h-4 w-4" />
                      Teorie
                    </TabsTrigger>
                    <TabsTrigger
                      value="test"
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Test
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Záložka teoretického obsahu */}
                <TabsContent value="theory" className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Teorie - Snímky</h4>
                      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              setEditingSlide(null)
                              setSlideDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Přidat snímek
                          </Button>
                        </DialogTrigger>
                        <SlideFormDialog
                          slide={editingSlide}
                          onSave={(data) => {
                            if (editingSlide) {
                              updateSlideMutation.mutate({ id: editingSlide.id, data })
                            } else {
                              // Automaticky přiřadit další dostupné pořadí snímku
                              const nextOrder =
                                theorySlides.length > 0 ? Math.max(...theorySlides.map((s) => s.slideOrder)) + 1 : 1
                              createSlideMutation.mutate({ ...data, slideOrder: nextOrder })
                            }
                          }}
                          isLoading={createSlideMutation.isPending || updateSlideMutation.isPending}
                        />
                      </Dialog>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSlideReorder}>
                      <SortableContext
                        items={theorySlides.map((slide) => slide.id.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {theorySlides.map((slide, index) => (
                            <SortableSlideItem
                              key={slide.id}
                              slide={slide}
                              index={index}
                              onEdit={() => {
                                setEditingSlide(slide)
                                setSlideDialogOpen(true)
                              }}
                              onDelete={() => {
                                if (confirm('Opravdu chcete smazat tento snímek?')) {
                                  deleteSlideMutation.mutate(slide.id)
                                }
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {theorySlides.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Zatím nebyly vytvořeny žádné teoretické snímky
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Záložka testového obsahu */}
                <TabsContent value="test" className="p-6">
                  <div className="space-y-6">
                    {/* Konfigurace testu */}
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-300">Konfigurace testu</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {selectedCourse.maxQuestionsInTest || 'Vše'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Max. otázek v testu</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {selectedCourse.maxQuestionsInTest
                                ? `Náhodný výběr z ${testQuestions.length} otázek`
                                : `Všech ${testQuestions.length} otázek`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {selectedCourse.passingScore}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Hranice úspěchu</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {selectedCourse.timeLimitMinutes || 'Bez limitu'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedCourse.timeLimitMinutes ? 'Časový limit (min)' : 'Časový limit'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Testovací otázky</h4>
                      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              setEditingQuestion(null)
                              setQuestionDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Přidat otázku
                          </Button>
                        </DialogTrigger>
                        <QuestionFormDialog
                          question={editingQuestion}
                          onSave={(data) => {
                            if (editingQuestion) {
                              updateQuestionMutation.mutate({ id: editingQuestion.id, data })
                            } else {
                              // Automaticky přiřadit další dostupné pořadí otázky
                              const nextOrder =
                                testQuestions.length > 0
                                  ? Math.max(...testQuestions.map((q) => q.questionOrder || 1)) + 1
                                  : 1
                              createQuestionMutation.mutate({ ...data, questionOrder: nextOrder })
                            }
                          }}
                          isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                        />
                      </Dialog>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionReorder}>
                      <SortableContext
                        items={testQuestions.map((q) => q.id.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {testQuestions.map((question, index) => (
                            <SortableQuestionItem
                              key={question.id}
                              question={question}
                              index={index}
                              onEdit={() => {
                                setEditingQuestion(question)
                                setQuestionDialogOpen(true)
                              }}
                              onDelete={() => {
                                if (confirm('Opravdu chcete smazat tuto otázku?')) {
                                  deleteQuestionMutation.mutate(question.id)
                                }
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {testQuestions.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Zatím nebyly vytvořeny žádné testovací otázky
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Vyberte kurz pro úpravu jeho obsahu
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseEditor
