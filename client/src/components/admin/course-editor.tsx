import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import { apiRequest } from '@/lib/queryClient'
import { Book, HelpCircle, Plus, Edit, Trash2, Clock, GripVertical } from 'lucide-react'
import type { Course, TheorySlide, TestQuestion } from '@/types'
import SlideFormDialog from './slide-form-dialog'
import { t } from '@/lib/translations'
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
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Komponenta formuláře pro nový kurz
const NewCourseForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    abbreviation: '',
    description: '',
    passingScore: 80,
    timeLimitMinutes: 60,
    maxAttempts: 3,
    maxQuestionsInTest: null as number | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.slug.trim() && formData.abbreviation.trim()) {
      onSubmit(formData)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="courseName">Název kurzu *</Label>
        <Input
          id="courseName"
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value
            setFormData((prev) => ({
              ...prev,
              name,
              slug: generateSlug(name),
            }))
          }}
          placeholder="např. Bezpečnost práce - základy"
          required
        />
      </div>

      <div>
        <Label htmlFor="courseSlug">URL slug *</Label>
        <Input
          id="courseSlug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="bezpecnost-prace-zaklady"
          required
        />
      </div>

      <div>
        <Label htmlFor="courseAbbreviation">Zkratka *</Label>
        <Input
          id="courseAbbreviation"
          value={formData.abbreviation}
          onChange={(e) => setFormData((prev) => ({ ...prev, abbreviation: e.target.value.toUpperCase() }))}
          placeholder="BPZ"
          maxLength={10}
          required
        />
      </div>

      <div>
        <Label htmlFor="courseDescription">Popis</Label>
        <Textarea
          id="courseDescription"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Stručný popis kurzu..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="passingScore">Hranice úspěchu (%)</Label>
          <Input
            id="passingScore"
            type="number"
            min="1"
            max="100"
            value={formData.passingScore}
            onChange={(e) => setFormData((prev) => ({ ...prev, passingScore: parseInt(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="timeLimit">Časový limit (min)</Label>
          <Input
            id="timeLimit"
            type="number"
            min="5"
            max="300"
            value={formData.timeLimitMinutes}
            onChange={(e) => setFormData((prev) => ({ ...prev, timeLimitMinutes: parseInt(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="maxAttempts">Max. pokusů</Label>
          <Input
            id="maxAttempts"
            type="number"
            min="1"
            max="10"
            value={formData.maxAttempts}
            onChange={(e) => setFormData((prev) => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maxQuestionsInTest">Max. počet otázek v testu</Label>
        <Input
          id="maxQuestionsInTest"
          type="number"
          min="1"
          max="100"
          value={formData.maxQuestionsInTest || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              maxQuestionsInTest: e.target.value ? parseInt(e.target.value) : null,
            }))
          }
          placeholder="Neurčeno (všechny otázky)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Pokud není zadáno, použijí se všechny aktivní otázky. Jinak se náhodně vybere zadaný počet otázek z celkového
          počtu.
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Vytvořit kurz
        </Button>
      </div>
    </form>
  )
}

// Komponenta formuláře pro novou společnost
// const NewCompanyForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     contactEmail: '',
//     contactPhone: '',
//     address: ''
//   });
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.name.trim()) {
//       onSubmit(formData);
//     }
//   };
//
//   return (
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label htmlFor="companyName">Název společnosti *</Label>
//           <Input
//               id="companyName"
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               placeholder="např. ACME Corporation"
//               required
//           />
//         </div>
//
//         <div>
//           <Label htmlFor="contactEmail">Kontaktní email</Label>
//           <Input
//               id="contactEmail"
//               type="email"
//               value={formData.contactEmail}
//               onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
//               placeholder="kontakt@acme.cz"
//           />
//         </div>
//
//         <div>
//           <Label htmlFor="contactPhone">Kontaktní telefon</Label>
//           <Input
//               id="contactPhone"
//               value={formData.contactPhone}
//               onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
//               placeholder="+420 123 456 789"
//           />
//         </div>
//
//         <div>
//           <Label htmlFor="address">Adresa</Label>
//           <Textarea
//               id="address"
//               value={formData.address}
//               onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//               placeholder="Ulice 123, 110 00 Praha"
//               rows={3}
//           />
//         </div>
//
//         <div className="flex justify-end space-x-2 pt-4">
//           <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
//             Vytvořit společnost
//           </Button>
//         </div>
//       </form>
//   );
// };

// Komponenta formuláře pro úpravu kurzu
const EditCourseForm = ({ course, onSubmit }: { course: Course; onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: course.name,
    slug: course.slug,
    abbreviation: course.abbreviation,
    description: course.description || '',
    passingScore: course.passingScore,
    timeLimitMinutes: course.timeLimitMinutes || 60,
    maxAttempts: course.maxAttempts,
    maxQuestionsInTest: course.maxQuestionsInTest as number | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.slug.trim() && formData.abbreviation.trim()) {
      onSubmit(formData)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="editCourseName">Název kurzu *</Label>
        <Input
          id="editCourseName"
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value
            setFormData((prev) => ({
              ...prev,
              name,
              slug: generateSlug(name),
            }))
          }}
          placeholder="např. Bezpečnost práce - základy"
          required
        />
      </div>

      <div>
        <Label htmlFor="editCourseSlug">URL slug *</Label>
        <Input
          id="editCourseSlug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="bezpecnost-prace-zaklady"
          required
        />
      </div>

      <div>
        <Label htmlFor="editCourseAbbreviation">Zkratka *</Label>
        <Input
          id="editCourseAbbreviation"
          value={formData.abbreviation}
          onChange={(e) => setFormData((prev) => ({ ...prev, abbreviation: e.target.value.toUpperCase() }))}
          placeholder="BPZ"
          maxLength={10}
          required
        />
      </div>

      <div>
        <Label htmlFor="editCourseDescription">Popis</Label>
        <Input
          id="editCourseDescription"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Stručný popis kurzu"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editPassingScore">Hranice úspěchu (%)</Label>
          <Input
            id="editPassingScore"
            type="number"
            min="1"
            max="100"
            value={formData.passingScore}
            onChange={(e) => setFormData((prev) => ({ ...prev, passingScore: parseInt(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="editTimeLimitMinutes">Časový limit (minuty)</Label>
          <Input
            id="editTimeLimitMinutes"
            type="number"
            min="1"
            value={formData.timeLimitMinutes}
            onChange={(e) => setFormData((prev) => ({ ...prev, timeLimitMinutes: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="editMaxAttempts">Maximální počet pokusů</Label>
          <Input
            id="editMaxAttempts"
            type="number"
            min="1"
            value={formData.maxAttempts}
            onChange={(e) => setFormData((prev) => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="editMaxQuestionsInTest">Max. otázek v testu</Label>
          <Input
            id="editMaxQuestionsInTest"
            type="number"
            min="1"
            value={formData.maxQuestionsInTest || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxQuestionsInTest: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            placeholder="Ponechat prázdné = všechny otázky"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pokud nevyplníte, použijí se všechny otázky</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Uložit změny
        </Button>
      </div>
    </form>
  )
}

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

// Komponenta dialogu formuláře otázky
const QuestionFormDialog = ({
  question,
  onSave,
  isLoading,
}: {
  question: TestQuestion | null
  onSave: (data: any) => void
  isLoading: boolean
}) => {
  const [formData, setFormData] = useState({
    questionText: question?.questionText || '',
    questionType: question?.questionType || 'single_choice',
    options: question?.options || ['', '', '', ''],
    correctAnswers: question?.correctAnswers || [],
    points: question?.points || 1,
    questionOrder: question?.questionOrder || 1,
  })

  const handleSave = () => {
    const cleanOptions = formData.options.filter((opt: string) => opt.trim() !== '')
    onSave({
      ...formData,
      options: cleanOptions,
      correctAnswers:
        formData.questionType === 'single_choice' ? formData.correctAnswers[0] || '' : formData.correctAnswers,
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const toggleCorrectAnswer = (option: string) => {
    if (formData.questionType === 'single_choice') {
      setFormData({ ...formData, correctAnswers: [option] })
    } else {
      const newCorrectAnswers = formData.correctAnswers.includes(option)
        ? formData.correctAnswers.filter((ans: string) => ans !== option)
        : [...formData.correctAnswers, option]
      setFormData({ ...formData, correctAnswers: newCorrectAnswers })
    }
  }

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-gray-900 dark:text-white">
          {question ? 'Upravit otázku' : 'Přidat otázku'}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="questionText">Text otázky</Label>
          <Textarea
            id="questionText"
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            placeholder="Text otázky"
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="questionType">Typ otázky</Label>
            <Select
              value={formData.questionType}
              onValueChange={(value) => setFormData({ ...formData, questionType: value, correctAnswers: [] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_choice">Jedna správná odpověď</SelectItem>
                <SelectItem value="multiple_choice">Více správných odpovědí</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="points">Body</Label>
            <Input
              id="points"
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
              min="1"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Možnosti odpovědí</Label>
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
                  placeholder={`Možnost ${index + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" disabled={isLoading}>
            Zrušit
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !formData.questionText.trim() || formData.correctAnswers.length === 0}
          >
            {isLoading ? 'Ukládání...' : question ? 'Aktualizovat otázku' : 'Vytvořit otázku'}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

// Komponenta řaditelné položky snímku
const SortableSlideItem = ({
  slide,
  index,
  onEdit,
  onDelete,
}: {
  slide: TheorySlide
  index: number
  onEdit: () => void
  onDelete: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
        index === 0 ? 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <button
              className="mt-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 dark:text-white">
                {slide.slideOrder}. {slide.title || `Snímek ${slide.slideOrder}`}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {slide.content
                  ? slide.content.length > 100
                    ? slide.content.substring(0, 100) + '...'
                    : slide.content
                  : 'Zatím nebyl přidán žádný obsah'}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Clock className="h-3 w-3 mr-1" />
                {slide.estimatedReadTime} min čtení
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Komponenta řaditelné položky otázky
const SortableQuestionItem = ({
  question,
  index,
  onEdit,
  onDelete,
}: {
  question: TestQuestion
  index: number
  onEdit: () => void
  onDelete: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <button
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Otázka {index + 1} • {question.questionType === 'single_choice' ? 'jedna správná' : 'více správných'} •{' '}
              {question.points} bodů
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">{question.questionText}</h5>

        {Array.isArray(question.options) && (
          <div className="space-y-2">
            {question.options.map((option: string, optionIndex: number) => {
              const isCorrect = Array.isArray(question.correctAnswers)
                ? question.correctAnswers.includes(option)
                : question.correctAnswers === option

              return (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type={question.questionType === 'multiple_choice' ? 'checkbox' : 'radio'}
                    className="mr-2"
                    checked={isCorrect}
                    disabled
                  />
                  <label
                    className={`text-sm ${isCorrect ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {option}
                  </label>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CourseEditor
