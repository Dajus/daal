import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Mail, Award } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import { downloadCertificate, generateCertificateBlob } from '@/lib/certificate-pdf-generator'
import { useLocation } from 'wouter'

const CertificateViewer = ({ progress }: { progress: any }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const { toast } = useToast()
  const [, setLocation] = useLocation()

  const { data: certificateData } = useQuery({
    queryKey: ['/api/student/certificate'],
    queryFn: async () => {
      const response = await fetch('/api/student/certificate', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) return null
      return response.json()
    },
  })

  // Automatické odeslání emailu s certifikátem při načtení
  useEffect(() => {
    const sendCertificateEmail = async () => {
      if (!certificateData || emailSent || isSendingEmail) {
        return
      }

      setIsSendingEmail(true)

      try {
        const pdfData = {
          studentName: certificateData.student.name,
          courseName: certificateData.course.name,
          companyName: certificateData.company?.name,
          completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ'),
          abbreviation: certificateData.course.abbreviation,
          certificateNumber: certificateData.certificate.certificateNumber,
          verificationCode: certificateData.certificate.verificationCode,
          score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined,
        }

        const pdfBlob = await generateCertificateBlob(pdfData)

        const reader = new FileReader()
        reader.readAsDataURL(pdfBlob)

        const base64PDF = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string
            resolve(result.split(',')[1])
          }
        })

        const response = await fetch('/api/email/send-certificate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            pdfBase64: base64PDF,
            certificateData: pdfData,
          }),
        })

        if (!response.ok) throw new Error('Failed to send email')

        setEmailSent(true)
      } catch (error) {
        console.error('Chyba při automatickém odesílání emailu:', error)
      } finally {
        setIsSendingEmail(false)
      }
    }

    sendCertificateEmail()
  }, [certificateData, emailSent, isSendingEmail, progress])

  const handleDownloadPDF = async () => {
    if (!certificateData) return

    setIsGenerating(true)

    const pdfData = {
      studentName: certificateData.student.name,
      courseName: certificateData.course.name,
      companyName: certificateData.company?.name,
      abbreviation: certificateData.course?.abbreviation,
      completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ'),
      certificateNumber: certificateData.certificate.certificateNumber,
      verificationCode: certificateData.certificate.verificationCode,
      score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined,
    }

    try {
      await downloadCertificate(pdfData)
      toast({
        title: 'Certifikát stažen',
        description: 'Váš certifikát byl úspěšně vygenerován!',
      })
    } catch (error) {
      console.error('Chyba při generování certifikátu:', error)
      toast({
        title: 'Chyba při stahování',
        description: 'Nepodařilo se stáhnout certifikát.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!certificateData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Certifikát není k dispozici.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gratulujeme!</h2>
            <p className="text-gray-600">Úspěšně jste dokončili kurz</p>
          </div>

          {/* Email banner */}
          {certificateData && (
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-700 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <p className="text-sm">
                      {isSendingEmail ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Odesílání certifikátu na email...
                        </span>
                      ) : emailSent ? (
                        <span>
                          Na email <strong>{certificateData.student.email}</strong> jsme Vám odeslali certifikát o
                          úspěšném absolvování kurzu
                        </span>
                      ) : (
                        <span>Příprava certifikátu k odeslání...</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-emerald-50 dark:from-emerald-900/20 border border-emerald-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-emerald-900 mb-4">Informace o certifikátu</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{certificateData.student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kurz:</span>
                <span className="font-medium">{certificateData.course.name}</span>
              </div>
              {certificateData.company && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Společnost:</span>
                  <span className="font-medium">{certificateData.company.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Datum vydání:</span>
                <span className="font-medium">
                  {new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Číslo certifikátu:</span>
                <span className="font-mono text-xs">{certificateData.certificate.certificateNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generování...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Stáhnout certifikát (PDF)
                </>
              )}
            </Button>

            <Button onClick={() => setLocation('/student')} variant="outline" className="w-full">
              Zpět na dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CertificateViewer
