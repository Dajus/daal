import { Check, Mail, MapPin, Phone } from 'lucide-react'
import ContactForm from '@/components/landing/ContactForm.tsx'

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

export default ContactInfo
