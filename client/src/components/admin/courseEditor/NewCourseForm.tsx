import { useState } from 'react'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'

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

export default NewCourseForm
