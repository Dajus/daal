import { useState, useCallback } from 'react'
import LoginModal from '@/components/LoginModal.tsx'
import Navigation from '@/components/landing/Navigation.tsx'
import { StatisticsSection } from '@/components/landing/StatisticsSection.tsx'
import AboutSection from '@/components/landing/AboutSection.tsx'
import ContactSection from '@/components/landing/ContactSection.tsx'
import Footer from '@/components/landing/Footer.tsx'
import AnimatedBackground from '@/components/landing/AnimatedBackground.tsx'
import { ServicesSection } from '@/components/landing/ServicesSection.tsx'
import HeroSection from '@/components/landing/HeroSection.tsx'

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
      <AnimatedBackground />

      <Navigation onStudentLogin={openStudentLogin} />
      <HeroSection onStudentLogin={openStudentLogin} />
      <ServicesSection onStudentLogin={openStudentLogin} />
      <StatisticsSection />
      <AboutSection />
      <ContactSection />
      <Footer onAdminLogin={openAdminLogin} />

      <LoginModal open={studentLoginModalOpen} onOpenChange={setStudentLoginModalOpen} type="student" />

      <LoginModal open={adminLoginModalOpen} onOpenChange={setAdminLoginModalOpen} type="admin" />
    </div>
  )
}

export default Landing
