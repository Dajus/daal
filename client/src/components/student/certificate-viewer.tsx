import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { downloadCertificate } from "@/lib/pdf-generator";
import { Download, Mail, Share2, Award } from "lucide-react";
import { LoadingScreen } from "@/components/ui/spinner";

interface CertificateData {
  certificate: {
    id: number;
    certificateNumber: string;
    verificationCode: string;
    issuedAt: string;
  };
  course: {
    name: string;
  };
  company: {
    name: string;
  } | null;
  student: {
    name: string;
    email: string;
  };
}

const CertificateViewer = ({ progress }: { progress?: any }) => {
  const { toast } = useToast();

  const { data: certificateData, isLoading, error } = useQuery<CertificateData>({
    queryKey: ['/api/student/certificate'],
    queryFn: async () => {
      const response = await fetch('/api/student/certificate', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Certifikát nenalezen. Nejprve musíte úspěšně dokončit test.');
        }
        throw new Error('Nepodařilo se načíst certifikát');
      }
      return response.json();
    }
  });

  const handleDownloadPDF = () => {
    if (!certificateData) return;

    const pdfData = {
      studentName: certificateData.student.name,
      courseName: certificateData.course.name,
      companyName: certificateData.company?.name,
      completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ'),
      certificateNumber: certificateData.certificate.certificateNumber,
      verificationCode: certificateData.certificate.verificationCode,
      score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined
    };

    try {
      downloadCertificate(pdfData);

      toast({
        title: "Certifikát stažen",
        description: "Váš certifikát byl úspěšně stažen s podporou českých diakritických znamének"
      });
    } catch (error) {
      toast({
        title: "Chyba při stahování",
        description: "Nepodařilo se stáhnout certifikát. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };

  const handleEmailCertificate = () => {
    if (!certificateData) return;

    const subject = encodeURIComponent(`Certifikát: ${certificateData.course.name}`);
    const body = encodeURIComponent(
        `Vážený/á ${certificateData.student.name},\n\n` +
        `Blahopřejeme k úspěšnému dokončení kurzu ${certificateData.course.name}!\n\n` +
        `Detaily certifikátu:\n` +
        `- Číslo certifikátu: ${certificateData.certificate.certificateNumber}\n` +
        `- Ověřovací kód: ${certificateData.certificate.verificationCode}\n` +
        `- Datum dokončení: ${new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ')}\n\n` +
        `Tento certifikát můžete ověřit online pomocí ověřovacího kódu.\n\n` +
        `S pozdravem,\nTým DAAL Training`
    );

    window.location.href = `mailto:${certificateData.student.email}?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    if (!certificateData) return;

    const shareData = {
      title: `Certifikát ${certificateData.course.name}`,
      text: `Úspěšně jsem dokončil/a školení ${certificateData.course.name}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Záložní řešení - kopírování do schránky
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (!certificateData) return;

    const shareText = `Úspěšně jsem dokončil/a školení ${certificateData.course.name}! Certifikát č. ${certificateData.certificate.certificateNumber}`;

    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Zkopírováno do schránky",
        description: "Text pro sdílení byl zkopírován do vaší schránky"
      });
    });
  };

  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8">
              <LoadingScreen title="Načítání certifikátu..." description="Příprava dokumentu" />
            </CardContent>
          </Card>
        </div>
    );
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
    );
  }

  // Získat nejlepší skóre pokusu, je-li dostupné
  const bestScore = progress?.attempts?.reduce((best: any, current: any) => {
    return parseFloat(current.percentage) > parseFloat(best?.percentage || '0') ? current : best;
  }, null);

  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="text-emerald-600 dark:text-emerald-400 text-3xl h-10 w-10" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Certifikát o dokončení</h2>
                  <div className="w-24 h-1 bg-emerald-600 dark:bg-emerald-400 mx-auto"></div>
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300">Tímto se potvrzuje, že</p>

                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {certificateData.student.name}
                </p>

                <p className="text-lg text-gray-700 dark:text-gray-300">úspěšně dokončil/a</p>

                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {certificateData.course.name}
                </p>

                {certificateData.company && (
                    <p className="text-gray-600 dark:text-gray-400 italic">{certificateData.company.name}</p>
                )}

                <div className="flex justify-center items-center space-x-12 mt-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Datum dokončení</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ID certifikátu</p>
                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {certificateData.certificate.certificateNumber}
                    </p>
                  </div>
                </div>

                {/* Zástupný symbol pro QR kód */}
                <div className="mt-8">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto flex items-center justify-center border border-gray-300 dark:border-gray-600">
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">QR kód<br/>Ověření</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Ověření: {certificateData.certificate.verificationCode}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    DAAL Training Platform - Profesionální školení bezpečnosti práce
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Praha, Česká republika | www.daal.cz
                  </p>
                </div>
              </div>
            </div>

            {/* Akční tlačítka */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                  onClick={handleDownloadPDF}
                  className="bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-800 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Stáhnout PDF
              </Button>

              <Button
                  onClick={handleEmailCertificate}
                  variant="outline"
                  className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Poslat certifikát e-mailem
              </Button>

              <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Sdílet
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
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default CertificateViewer;