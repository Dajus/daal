import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import { Download, Mail, Share2, Award, Eye, Shield, CheckCircle } from 'lucide-react'
import { LoadingScreen } from '@/components/ui/spinner'
import { useState } from 'react'
import { downloadCertificate } from '@/lib/certificate-pdf-generator'
import WebCertificatePreview from '@/components/student/certificateViewer/WebCertificatePreview.tsx'

interface CertificateData {
  certificate: {
    id: number
    certificateNumber: string
    verificationCode: string
    issuedAt: string
  }
  course: {
    name: string
  }
  company: {
    name: string
  } | null
  student: {
    name: string
    email: string
  }
}

const CertificateViewer = ({ progress }: { progress?: any }) => {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    data: certificateData,
    isLoading,
    error,
  } = useQuery<CertificateData>({
    queryKey: ['/api/student/certificate'],
    queryFn: async () => {
      const response = await fetch('/api/student/certificate', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Certifikát nenalezen. Nejprve musíte úspěšně dokončit test.')
        }
        throw new Error('Nepodařilo se načíst certifikát')
      }
      return response.json()
    },
  })

  // NOVÁ handleDownloadPDF funkce
  const handleDownloadPDF = async () => {
    if (!certificateData) return

    setIsGenerating(true)

    const pdfData = {
      studentName: certificateData.student.name,
      courseName: certificateData.course.name,
      companyName: certificateData.company?.name,
      completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ'),
      certificateNumber: certificateData.certificate.certificateNumber,
      verificationCode: certificateData.certificate.verificationCode,
      score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined,
    }

    try {
      console.log('📋 PDF Data:', pdfData)
      await downloadCertificate(pdfData) // NOVÁ funkce!

      toast({
        title: '✅ Certifikát stažen',
        description: 'Váš certifikát s českými znaky byl úspěšně vygenerován!',
      })
    } catch (error) {
      console.error('Chyba při generování certifikátu:', error)
      toast({
        title: '❌ Chyba při stahování',
        description: 'Nepodařilo se stáhnout certifikát. Zkuste to prosím znovu.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreviewCertificate = () => {
    if (!certificateData) return

    const pdfData = {
      studentName: certificateData.student.name,
      courseName: certificateData.course.name,
      companyName: certificateData.company?.name,
      completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ'),
      certificateNumber: certificateData.certificate.certificateNumber,
      verificationCode: certificateData.certificate.verificationCode,
      score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined,
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="cs">
      <head>
        <meta charset="UTF-8">
        <title>Náhled certifikátu - ${pdfData.studentName}</title>
        <style>
          body { 
            margin: 20px; 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
          }
          .preview-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 { color: #059669; text-align: center; }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <h1>📄 Náhled certifikátu</h1>
          <p style="text-align: center; color: #666; margin-bottom: 20px;">
            Takto bude vypadat váš certifikát s českými znaky při stažení
          </p>
          <div style="border: 4px solid #10b981; padding: 40px; border-radius: 15px; text-align: center; background: linear-gradient(to bottom, #10b981 0%, #10b981 25%, #ecfdf5 25%);">
            
            <div style="background: white; padding: 40px; border-radius: 10px;">
              <div style="background: #059669; color: white; padding: 15px 30px; border-radius: 10px; display: inline-block; margin-bottom: 30px;">
                <div style="font-size: 28px; font-weight: bold;">DAAL</div>
                <div style="font-size: 12px;">BEZPEČNOSTNÍ ŠKOLENÍ</div>
              </div>
              
              <h2 style="color: #064e3b; font-size: 48px; margin: 20px 0;">CERTIFIKÁT</h2>
              <p style="color: #10b981; font-size: 20px;">O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ</p>
              <hr style="border: 2px solid #6ee7b7; width: 200px; margin: 20px auto;">
              
              <p style="font-size: 16px; color: #4b5563;">Tímto se potvrzuje, že</p>
              <h3 style="color: #064e3b; font-size: 32px; margin: 20px 0;">${pdfData.studentName.toUpperCase()}</h3>
              <p style="font-size: 16px; color: #4b5563;">úspěšně dokončil(a) školení</p>
              <h4 style="color: #10b981; font-size: 24px; margin: 20px 0;">${pdfData.courseName}</h4>
              ${pdfData.companyName ? `<p style="color: #6b7280; font-style: italic;">pro společnost: ${pdfData.companyName}</p>` : ''}
              
              <div style="display: flex; justify-content: space-around; margin-top: 40px; gap: 20px;">
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; flex: 1;">
                  <strong style="color: #064e3b;">DATUM DOKONČENÍ</strong><br>
                  <span style="color: #064e3b;">${pdfData.completionDate}</span>
                </div>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; flex: 1;">
                  <strong style="color: #064e3b;">ČÍSLO CERTIFIKÁTU</strong><br>
                  <small style="color: #064e3b; font-family: monospace;">${pdfData.certificateNumber}</small>
                </div>
              </div>
              
              <p style="font-size: 10px; color: #6b7280; margin-top: 30px;">
                Ověřovací kód: ${pdfData.verificationCode}<br>
                DAAL Školicí platforma | Praha, Česká republika
              </p>
            </div>
          </div>
          <p style="text-align: center; margin-top: 20px; color: #666;">
            Zavřete toto okno a klikněte na "Stáhnout PDF" pro získání finálního certifikátu
          </p>
        </div>
      </body>
      </html>
    `

    const newWindow = window.open('', '_blank', 'width=1200,height=800')
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  const handleEmailCertificate = () => {
    if (!certificateData) return

    const subject = encodeURIComponent(`Certifikát: ${certificateData.course.name}`)
    const body = encodeURIComponent(
      `Vážený/á ${certificateData.student.name},\n\n` +
        `Blahopřejeme k úspěšnému dokončení kurzu ${certificateData.course.name}!\n\n` +
        `Detaily certifikátu:\n` +
        `- Číslo certifikátu: ${certificateData.certificate.certificateNumber}\n` +
        `- Ověřovací kód: ${certificateData.certificate.verificationCode}\n` +
        `- Datum dokončení: ${new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ')}\n\n` +
        `Tento certifikát můžete ověřit online pomocí ověřovacího kódu.\n\n` +
        `S pozdravem,\nTým DAAL Training`,
    )

    window.location.href = `mailto:${certificateData.student.email}?subject=${subject}&body=${body}`
  }

  const handleShare = async () => {
    if (!certificateData) return

    const shareData = {
      title: `Certifikát ${certificateData.course.name}`,
      text: `Úspěšně jsem dokončil/a školení ${certificateData.course.name}!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    if (!certificateData) return

    const shareText = `Úspěšně jsem dokončil/a školení ${certificateData.course.name}! Certifikát č. ${certificateData.certificate.certificateNumber}`

    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: 'Zkopírováno do schránky',
        description: 'Text pro sdílení byl zkopírován do vaší schránky',
      })
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <LoadingScreen title="Načítání certifikátu..." description="Příprava dokumentu" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !certificateData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Certifikát není dostupný</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error?.message || 'Před zobrazením certifikátu musíte dokončit a úspěšně složit test.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const bestScore = progress?.attempts?.reduce((best: any, current: any) => {
    return parseFloat(current.percentage) > parseFloat(best?.percentage || '0') ? current : best
  }, null)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Shrnutí výsledků */}
      {bestScore && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{bestScore.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Finální skóre</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {new Date(bestScore.completedAt).toLocaleDateString('cs-CZ')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Datum dokončení</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">SPLNĚNO</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stav</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Náhled certifikátu */}
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Certifikát kurzu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Design certifikátu */}
          <WebCertificatePreview />

          {/* Akční tlačítka */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handlePreviewCertificate}
              variant="outline"
              className="border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Náhled certifikátu
            </Button>

            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-800 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generování...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Stáhnout PDF
                </>
              )}
            </Button>

            <Button
              onClick={handleEmailCertificate}
              variant="outline"
              className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Poslat e-mailem
            </Button>
          </div>

          {/* Detaily certifikátu */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Detaily certifikátu</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Student</dt>
                <dd className="text-gray-900 dark:text-white">{certificateData.student.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">E-mail</dt>
                <dd className="text-gray-900 dark:text-white">{certificateData.student.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Kurz</dt>
                <dd className="text-gray-900 dark:text-white">{certificateData.course.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Datum vydání</dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ')}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Číslo certifikátu</dt>
                <dd className="text-gray-900 dark:text-white font-mono text-xs">
                  {certificateData.certificate.certificateNumber}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Ověřovací kód</dt>
                <dd className="text-gray-900 dark:text-white font-mono text-xs">
                  {certificateData.certificate.verificationCode}
                </dd>
              </div>
              {bestScore && (
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Dosažené skóre</dt>
                  <dd className="text-gray-900 dark:text-white font-semibold">
                    {bestScore.percentage}%{' '}
                    {parseInt(bestScore.percentage) >= progress?.course?.passingScore && (
                      <span className="text-green-600">(Splněno)</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Dodatečné informace */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                Gratulujeme k dokončení školení!
              </h3>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm leading-relaxed">
                Úspěšně jste dokončili školení <strong>{certificateData.course.name}</strong>. Váš certifikát je platný
                a může být ověřen pomocí uvedeného ověřovacího kódu. Doporučujeme si certifikát uložit na bezpečné místo
                a v případě potřeby jej předložit zaměstnavateli nebo kontrolním orgánům.
              </p>
              {certificateData.company && (
                <p className="text-emerald-600 dark:text-emerald-500 text-sm mt-2 font-medium">
                  📋 Školení proběhlo pro společnost: {certificateData.company.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CertificateViewer
