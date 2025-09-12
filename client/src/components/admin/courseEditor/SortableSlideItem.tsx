import type { TheorySlide } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Clock, Edit, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

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
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  lineHeight: '1.25rem',
                  maxHeight: '2.5rem',
                }}
              >
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

export default SortableSlideItem
