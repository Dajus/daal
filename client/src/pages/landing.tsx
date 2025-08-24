import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import LoginModal from '@/components/login-modal'
import {
  Car,
  HardHat,
  Mountain,
  Heart,
  Recycle,
  Truck,
  Shield,
  MapPin,
  Mail,
  Phone,
  Check,
  Globe,
  Award,
  ArrowRight,
  BookOpen,
  Zap,
  UserCog,
} from 'lucide-react'
import { t } from '@/lib/translations'

// Types
interface Course {
  icon: any
  title: string
  description: string
  code: string
}

interface Stat {
  value: string
  label: string
}

interface MousePosition {
  x: number
  y: number
}

// Static data
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

const stats: Stat[] = [
  { value: '2,500+', label: 'Absolventů' },
  { value: '13', label: 'Typů kurzů' },
  { value: '15+', label: 'Let zkušeností' },
  { value: '98%', label: 'Úspěšnost' },
]

// Background animated elements
const AnimatedBackground = ({ mousePosition }: { mousePosition: MousePosition }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
      style={{
        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
      }}
    />
    <div
      className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"
      style={{
        transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.01}px)`,
      }}
    />
    <div
      className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"
      style={{
        transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.02}px)`,
      }}
    />

    {/* Floating geometric shapes */}
    <div className="absolute top-20 left-20 w-4 h-4 bg-white/10 rotate-45 animate-bounce delay-500" />
    <div className="absolute top-40 right-32 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce delay-1000" />
    <div
      className="absolute bottom-32 left-40 w-3 h-3 bg-teal-400/30 rotate-12 animate-spin"
      style={{ animationDuration: '10s' }}
    />
    <div className="absolute top-64 right-20 w-8 h-8 bg-green-400/20 rotate-45 animate-pulse" />
  </div>
)

// Navigation component
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

// Hero section component
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
            Bezpečnost práce je <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent animate-pulse">
              naší prioritou
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Profesionální bezpečnostní školení a certifikační programy navržené k ochraně vaší pracovní síly a
            dodržování nejnovějších předpisů.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onStudentLogin}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group border-0"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Začít učení
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={scrollToContact}
              className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Zjistit více
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Course card component
const CourseCard = ({ course }: { course: Course }) => (
  <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
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

// Services section
const ServicesSection = () => (
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
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  </section>
)

// Statistics section
const StatisticsSection = () => (
  <section className="py-24 bg-gray-50 dark:bg-gray-800 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// About section
const AboutSection = () => (
  <section id="about" className="py-24 bg-white dark:bg-gray-900 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
            alt="DAAL Training Center"
            className="rounded-xl shadow-lg w-full h-auto"
          />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">O společnosti DAAL</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            S více než 15letými zkušenostmi v oblasti školení bezpečnosti práce se DAAL stal důvěryhodným partnerem pro
            společnosti po celé Evropě. Specializujeme se na komplexní bezpečnostní vzdělávání, které kombinuje
            teoretické znalosti s praktickou aplikací.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Naši certifikovaní instruktoři a moderní e-learningová platforma zajišťují, že vaši zaměstnanci získají
            vysoce kvalitní školení při zachování flexibility a pohodlí.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <Award className="text-emerald-600 dark:text-emerald-400 mr-2 h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">ISO 9001 Certified</span>
            </div>
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <Shield className="text-emerald-600 dark:text-emerald-400 mr-2 h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">EU Compliant</span>
            </div>
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <Globe className="text-emerald-600 dark:text-emerald-400 mr-2 h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Multi-language</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// Contact form component
const ContactForm = () => (
  <Card className="shadow-xl bg-white dark:bg-gray-800 border-0 overflow-hidden">
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
      <h3 className="text-2xl font-bold text-white flex items-center">
        <Mail className="mr-3 h-6 w-6" />
        Napište nám
      </h3>
      <p className="text-emerald-100 mt-2">Rádi vám pomůžeme s vašimi požadavky</p>
    </div>
    <CardContent className="p-4 sm:p-6 lg:p-8">
      <form className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 font-semibold">
            Název společnosti
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Vaše společnost"
            className="mt-2 h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-0 rounded-lg font-medium"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
            E-mailová adresa
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="kontakt@vase-spolecnost.cz"
            className="mt-2 h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-0 rounded-lg font-medium"
          />
        </div>
        <div>
          <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-semibold">
            Zpráva
          </Label>
          <Textarea
            id="message"
            rows={5}
            placeholder="Napište nám o vašich školicích potřebách..."
            className="mt-2 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-0 rounded-lg font-medium resize-none"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <Mail className="mr-2 h-5 w-5" />
          Odeslat zprávu
        </Button>
      </form>
    </CardContent>
  </Card>
)

// Contact info component
const ContactInfo = () => (
  <div className="space-y-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <MapPin className="text-emerald-600 dark:text-emerald-400 h-6 w-6 mr-4 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Adresa</h4>
          <p className="text-gray-600 dark:text-gray-400">Praha, Česká republika</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">Dostupné v celé EU</p>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <Mail className="text-emerald-600 dark:text-emerald-400 h-6 w-6 mr-4 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">E-mail</h4>
          <a
            href="mailto:info@daal.cz"
            className="text-gray-600 dark:text-gray-400 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            info@daal.cz
          </a>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <Phone className="text-emerald-600 dark:text-emerald-400 h-6 w-6 mr-4 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Telefon</h4>
          <a
            href="tel:+420XXXXXXXXX"
            className="text-gray-600 dark:text-gray-400 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            +420 XXX XXX XXX
          </a>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
          <Check className="mr-2 h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rychlá odpověď</span>
        </div>
        <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
          <Check className="mr-2 h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expert podpora</span>
        </div>
        <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
          <Check className="mr-2 h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Řešení na míru</span>
        </div>
      </div>
    </div>
  </div>
)

// Contact section
const ContactSection = () => (
  <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Kontaktujte nás</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Jste připraveni začít s bezpečnostním školením na pracovišti?
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  </section>
)

// Footer component
const Footer = ({ onAdminLogin }: { onAdminLogin: () => void }) => (
  <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <Shield className="text-white h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">DAAL Training</h3>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
            Profesionální školení bezpečnosti práce a certifikace pro evropské společnosti.
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4 text-white">Služby</h4>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
            <li className="hover:text-white transition-colors cursor-pointer">BOZP školení</li>
            <li className="hover:text-white transition-colors cursor-pointer">Školení řidičů</li>
            <li className="hover:text-white transition-colors cursor-pointer">Kurzy první pomoci</li>
            <li className="hover:text-white transition-colors cursor-pointer">Správa certifikátů</li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4 text-white">Společnost</h4>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
            <li className="hover:text-white transition-colors cursor-pointer">O nás</li>
            <li className="hover:text-white transition-colors cursor-pointer">Certifikace</li>
            <li className="hover:text-white transition-colors cursor-pointer">Ochrana soukromí</li>
            <li className="hover:text-white transition-colors cursor-pointer">GDPR</li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4 text-white">Kontakt</h4>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
            <li className="flex items-center hover:text-white transition-colors">
              <Mail className="mr-2 h-4 w-4" />
              <a href="mailto:info@daal.cz" className="hover:text-emerald-300 transition-colors">
                info@daal.cz
              </a>
            </li>
            <li className="flex items-center hover:text-white transition-colors">
              <MapPin className="mr-2 h-4 w-4" />
              Praha, Česká republika
            </li>
            <li className="flex items-center hover:text-white transition-colors">
              <Globe className="mr-2 h-4 w-4" />
              EU Training Provider
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 dark:text-gray-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p>&copy; 2024 DAAL Training Platform. Všechna práva vyhrazena.</p>
          <p className="text-xs text-gray-500 dark:text-gray-600">Created by DM - 2025</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdminLogin}
          className="text-gray-500 hover:text-emerald-300 hover:bg-emerald-900/20 text-xs mt-2 sm:mt-0 transition-all duration-200 flex items-center gap-1"
        >
          <UserCog className="h-3 w-3" />
          Administrace
        </Button>
      </div>
    </div>
  </footer>
)

// Custom hook for mouse tracking
const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mousePosition
}

// Custom hook for modal management
const useModalManagement = () => {
  const [studentLoginModalOpen, setStudentLoginModalOpen] = useState(false)
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false)

  const openStudentLogin = useCallback(() => {
    setStudentLoginModalOpen(true)
  }, [])

  const openAdminLogin = useCallback(() => {
    setAdminLoginModalOpen(true)
  }, [])

  return {
    studentLoginModalOpen,
    setStudentLoginModalOpen,
    adminLoginModalOpen,
    setAdminLoginModalOpen,
    openStudentLogin,
    openAdminLogin,
  }
}

const Landing = () => {
  const mousePosition = useMouseTracking()
  const {
    studentLoginModalOpen,
    setStudentLoginModalOpen,
    adminLoginModalOpen,
    setAdminLoginModalOpen,
    openStudentLogin,
    openAdminLogin,
  } = useModalManagement()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 overflow-hidden relative">
      <AnimatedBackground mousePosition={mousePosition} />

      <Navigation onStudentLogin={openStudentLogin} />
      <HeroSection onStudentLogin={openStudentLogin} />
      <ServicesSection />
      <StatisticsSection />
      <AboutSection />
      <ContactSection />
      <Footer onAdminLogin={openAdminLogin} />

      {/* Login Modals */}
      <LoginModal open={studentLoginModalOpen} onOpenChange={setStudentLoginModalOpen} type="student" />

      <LoginModal open={adminLoginModalOpen} onOpenChange={setAdminLoginModalOpen} type="admin" />
    </div>
  )
}

export default Landing
