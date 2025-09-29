import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Mail, CheckCircle } from 'lucide-react'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useToast } from '@/hooks/use-toast'
import emailjs from '@emailjs/browser'

// Environment variables pro EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

console.log('EmailJS Config:', { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY })

interface FormData {
  company: string
  email: string
  message: string
}

interface FormErrors {
  company?: string
  email?: string
  message?: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.company.trim()) {
      newErrors.company = 'Název společnosti je povinný'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Zadejte platný email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Zpráva je povinná'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Odešlete email přes EmailJS
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_company: formData.company,
            from_email: formData.email,
            message: formData.message,
            to_email: 'david121milata@gmail.com', // Změňte na váš email
          },
          EMAILJS_PUBLIC_KEY,
        )
        console.log('Email sent successfully via EmailJS')
      } else {
        throw new Error('EmailJS není správně nakonfigurován')
      }

      setIsSubmitted(true)
      toast({
        title: 'Zpráva odeslána',
        description: 'Děkujeme za vaši zprávu! Kontaktujeme vás do 24 hodin.',
      })

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          company: '',
          email: '',
          message: '',
        })
      }, 5000)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Chyba',
        description: 'Chyba při odesílání zprávy. Zkuste to prosím znovu.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-xl bg-white dark:bg-gray-800 border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Mail className="mr-3 h-6 w-6" />
          Napište nám
        </h3>
        <p className="text-emerald-100 mt-2">Rádi vám pomůžeme s vašimi požadavky</p>
      </div>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 font-semibold">
                Název společnosti *
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Vaše společnost"
                className={`mt-2 h-12 border-2 ${
                  errors.company
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400'
                } focus:ring-0 rounded-lg font-medium`}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
                E-mailová adresa *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="kontakt@vase-spolecnost.cz"
                className={`mt-2 h-12 border-2 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400'
                } focus:ring-0 rounded-lg font-medium`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-semibold">
                Zpráva *
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Napište nám o vašich školicích potřebách..."
                className={`mt-2 border-2 ${
                  errors.message
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400'
                } focus:ring-0 rounded-lg font-medium resize-none`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Odesílání...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Odeslat zprávu
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600 dark:text-emerald-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Děkujeme za vaši zprávu!</h3>
            <p className="text-gray-600 dark:text-gray-400">Kontaktujeme vás do 24 hodin.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Formulář se automaticky resetuje za chvíli...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ContactForm
