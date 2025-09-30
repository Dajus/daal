import { useCallback } from 'react'
import { ArrowRight, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const HeroSection = ({ onStudentLogin }: { onStudentLogin: () => void }) => {
  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [])

  return (
    <section id="hero" className="pt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium">
              <Zap className="mr-2 h-4 w-4 text-yellow-400" />
              Moderní e-learning platforma
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Kvalitní BOZP, PO a ADR poradenství
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent animate-pulse">
              pro každou firmu
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Profesionální bezpečnostní školení a certifikační programy navržené k ochraně vaší pracovní síly a
            dodržování nejnovějších předpisů.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <Button
                onClick={onStudentLogin}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-6 rounded-2xl text-2xl font-bold  shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 group border-0 relative overflow-hidden"
              >
                {/* Pulzující pozadí */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <BookOpen className="h-8 w-8" />
                    <span>Přejít na kurz</span>
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                      KURZ!
                    </div>
                  </div>
                  <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-3 transition-transform duration-300" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
