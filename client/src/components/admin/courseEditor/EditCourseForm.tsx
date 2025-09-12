import type { Course } from '@/types'
import { useState } from 'react'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

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

export default EditCourseForm
