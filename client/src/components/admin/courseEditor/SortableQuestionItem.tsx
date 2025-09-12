import type { TestQuestion } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Edit, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

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

export default SortableQuestionItem
