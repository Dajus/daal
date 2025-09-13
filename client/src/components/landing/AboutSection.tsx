import { Award, Globe, Shield } from 'lucide-react'

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
              <span className="text-gray-700 dark:text-gray-300 font-medium">Certifikát</span>
            </div>
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <Shield className="text-emerald-600 dark:text-emerald-400 mr-2 h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">V souladu s normami EU</span>
            </div>
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <Globe className="text-emerald-600 dark:text-emerald-400 mr-2 h-5 w-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Multi jazyčnost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default AboutSection
