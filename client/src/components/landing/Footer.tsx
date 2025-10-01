import { Globe, Mail, MapPin, Shield, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

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
              Třinec, Česká republika
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

export default Footer
