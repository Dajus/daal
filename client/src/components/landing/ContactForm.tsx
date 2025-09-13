import { Card, CardContent } from '@/components/ui/card.tsx'
import { Mail } from 'lucide-react'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'

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

export default ContactForm
