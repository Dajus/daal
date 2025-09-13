import ContactForm from '@/components/landing/ContactForm.tsx'
import ContactInfo from '@/components/landing/ContactInfo.tsx'

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

export default ContactSection
