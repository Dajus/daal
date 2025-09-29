import { Car, HardHat, Heart, Mountain, Recycle, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.tsx'

interface Course {
  icon: any
  title: string
  description: string
  code: string
}

const courses: Course[] = [
  {
    icon: Car,
    title: 'Školení řidičů',
    description: 'Profesionální školení řidičů pro operátory firemních vozidel',
    code: 'DRIV',
  },
  {
    icon: HardHat,
    title: 'BOZP a požární ochrana',
    description: 'Školení bezpečnosti a ochrany zdraví při práci včetně požární ochrany',
    code: 'BOZP',
  },
  {
    icon: Mountain,
    title: 'Práce ve výškách',
    description: 'Specializované školení pro práci ve zvýšených polohách',
    code: 'HEIG',
  },
  {
    icon: Heart,
    title: 'První pomoc a hygiena',
    description: 'Základní první pomoc a pracovní hygienické protokoly',
    code: 'HYGI',
  },
  {
    icon: Recycle,
    title: 'Nakládání s odpady',
    description: 'Správné zacházení a likvidace pracovních odpadů',
    code: 'WAST',
  },
  {
    icon: Truck,
    title: 'Nebezpečný transport',
    description: 'ADR školení pro přepravu nebezpečného zboží',
    code: 'HADR',
  },
]

const CourseCard = ({ course, onStudentLogin }: { course: Course; onStudentLogin: () => void }) => (
  <Card
    className="cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
    onClick={onStudentLogin}
  >
    <CardContent className="p-6">
      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
        <course.icon className="text-emerald-600 dark:text-emerald-400 h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{course.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{course.description}</p>
      <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
        {course.code}
      </span>
    </CardContent>
  </Card>
)

export const ServicesSection = ({ onStudentLogin }: { onStudentLogin: () => void }) => (
  <section id="services" className="py-24 bg-white dark:bg-gray-900 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Naše výukové kurzy</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Komplexní bezpečnostní školící programy přizpůsobené potřebám vašeho odvětví
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} onStudentLogin={onStudentLogin} />
        ))}
      </div>
    </div>
  </section>
)
