import { Check, Mail, Phone, User } from 'lucide-react'

const ContactInfo = () => (
  <div className="space-y-6">
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
        <div className="flex items-start mb-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-3 mr-4">
            <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Ing. Aleš Vymazal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Odborně způsobilá osoba v prevenci rizik
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Odborně způsobilá osoba v oboru požární ochrany
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <div className="flex items-center mb-1">
              <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
              <a
                href="tel:+420606724608"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                +420 606 724 608
              </a>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
              <a
                href="mailto:ales.vymazal@centrum.cz"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium break-all"
              >
                ales.vymazal@centrum.cz
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
        <div className="flex items-start mb-4">
          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-full p-3 mr-4">
            <User className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">David Urbačka</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Odborně způsobilá osoba v prevenci rizik
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Bezpečnostní poradce ADR, RID, IMDG-Code
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
            <a
              href="tel:+420734144746"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              +420 734 144 746
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
            <a
              href="mailto:david.urbacka@centrum.cz"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium break-all"
            >
              david.urbacka@centrum.cz
            </a>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
        <div className="flex items-start mb-4">
          <div className="bg-teal-100 dark:bg-teal-900/30 rounded-full p-3 mr-4">
            <User className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Lukáš Vymazal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Odborně způsobilá osoba v prevenci rizik
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
            <a
              href="tel:+420792371592"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
            >
              +420 792 371 592
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
            <a
              href="mailto:lu.vym@seznam.cz"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium break-all"
            >
              Lu.vym@seznam.cz
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Výhody spolupráce */}
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
      <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 font-medium">
        Pokud máte jakýkoliv dotaz, neváhejte nás oslovit prostřednictvím kontaktních informací, popřípadě můžete využít
        kontaktní formulář.
      </p>
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
