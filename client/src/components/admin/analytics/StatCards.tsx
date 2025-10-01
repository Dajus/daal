import 'react-quill/dist/quill.snow.css'
import { Card, CardContent } from '@/components/ui/card.tsx'

interface RichTextEditorProps {
  statCards: any
}

export default function StatCards({ statCards }: RichTextEditorProps) {
  return statCards.map((stat: any, index: number) => (
    <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
            <stat.icon className={`${stat.color} h-6 w-6`} />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))
}
