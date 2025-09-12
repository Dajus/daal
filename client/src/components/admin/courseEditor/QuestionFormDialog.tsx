import type { TestQuestion } from '@/types'
import { useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

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

export default QuestionFormDialog
