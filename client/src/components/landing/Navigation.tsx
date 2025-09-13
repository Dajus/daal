import { ArrowRight, BookOpen, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle.tsx'
import { Button } from '@/components/ui/button.tsx'

const Navigation = ({ onStudentLogin }: { onStudentLogin: () => void }) => (
  <nav className="bg-gray-800/70 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-600/20 dark:border-gray-700/50 fixed w-full top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white h-6 w-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">DAAL</span>
          </div>
          <div className="hidden md:block ml-8">
            <div className="flex items-baseline space-x-4">
              <a
                href="#hero"
                className="text-white hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Domů
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                O nás
              </a>
              <a
                href="#services"
                className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Služby
              </a>
              <a
                href="#contact"
                className="text-white/80 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Kontakt
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            onClick={onStudentLogin}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Přístup ke kurzům
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  </nav>
)

export default Navigation
