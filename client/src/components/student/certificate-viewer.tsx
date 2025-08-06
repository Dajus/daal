import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { downloadCertificate } from "@/lib/pdf-generator";
import { Download, Mail, Share2, Award } from "lucide-react";

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

export default function CertificateViewer({ progress }: { progress?: any }) {
  const { toast } = useToast();

  const { data: certificateData, isLoading, error } = useQuery<CertificateData>({
    queryKey: ['/api/student/certificate'],
    queryFn: async () => {
      const response = await fetch('/api/student/certificate', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Certificate not found. You must pass the test first.');
        }
        throw new Error('Failed to fetch certificate');
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
      completionDate: new Date(certificateData.certificate.issuedAt).toLocaleDateString(),
      certificateNumber: certificateData.certificate.certificateNumber,
      verificationCode: certificateData.certificate.verificationCode,
      score: progress?.attempts?.[0]?.percentage ? parseInt(progress.attempts[0].percentage) : undefined
    };

    try {
      downloadCertificate(pdfData);
      
      toast({
        title: "Certifikát stažen",
        description: "Váš certifikát byl úspěšně stažen (ASCII verze z důvodu kompatibility PDF)"
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

    const subject = encodeURIComponent(`Certificate: ${certificateData.course.name}`);
    const body = encodeURIComponent(
      `Dear ${certificateData.student.name},\n\n` +
      `Congratulations on successfully completing the ${certificateData.course.name} course!\n\n` +
      `Certificate Details:\n` +
      `- Certificate Number: ${certificateData.certificate.certificateNumber}\n` +
      `- Verification Code: ${certificateData.certificate.verificationCode}\n` +
      `- Completion Date: ${new Date(certificateData.certificate.issuedAt).toLocaleDateString()}\n\n` +
      `You can verify this certificate online using the verification code.\n\n` +
      `Best regards,\nDAAL Training Team`
    );

    window.location.href = `mailto:${certificateData.student.email}?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    if (!certificateData) return;

    const shareData = {
      title: `${certificateData.course.name} Certificate`,
      text: `I've successfully completed the ${certificateData.course.name} training course!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fall back to copying to clipboard
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (!certificateData) return;

    const shareText = `I've successfully completed the ${certificateData.course.name} training course! Certificate #${certificateData.certificate.certificateNumber}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Share text has been copied to your clipboard"
      });
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !certificateData) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Not Available</h3>
          <p className="text-gray-600 mb-4">
            {error?.message || 'You must complete and pass the test before you can view your certificate.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get best attempt score if available
  const bestScore = progress?.attempts?.reduce((best: any, current: any) => {
    return parseFloat(current.percentage) > parseFloat(best?.percentage || '0') ? current : best;
  }, null);

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      {bestScore && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{bestScore.percentage}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Date(bestScore.completedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Completion Date</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">PASSED</div>
              <div className="text-sm text-gray-600">Status</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Certificate Preview */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Course Certificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Certificate Design */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary text-3xl h-10 w-10" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                <div className="w-24 h-1 bg-primary mx-auto"></div>
              </div>
              
              <p className="text-lg text-gray-700">This certifies that</p>
              
              <p className="text-3xl font-bold text-primary">
                {certificateData.student.name}
              </p>
              
              <p className="text-lg text-gray-700">has successfully completed</p>
              
              <p className="text-2xl font-semibold text-gray-900">
                {certificateData.course.name}
              </p>
              
              {certificateData.company && (
                <p className="text-gray-600 italic">{certificateData.company.name}</p>
              )}
              
              <div className="flex justify-center items-center space-x-12 mt-8">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(certificateData.certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {certificateData.certificate.certificateNumber}
                  </p>
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="mt-8">
                <div className="w-20 h-20 bg-gray-200 rounded mx-auto flex items-center justify-center border">
                  <span className="text-xs text-gray-500 text-center">QR Code<br/>Verification</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Verification: {certificateData.certificate.verificationCode}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  DAAL Training Platform - Professional Workplace Safety Training
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Prague, Czech Republic | www.daal.cz
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button 
              onClick={handleEmailCertificate}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Certificate
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Certificate Details */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Certificate Details</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Student</dt>
                <dd className="text-gray-900">{certificateData.student.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email</dt>
                <dd className="text-gray-900">{certificateData.student.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Course</dt>
                <dd className="text-gray-900">{certificateData.course.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Issued Date</dt>
                <dd className="text-gray-900">
                  {new Date(certificateData.certificate.issuedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Certificate Number</dt>
                <dd className="text-gray-900 font-mono text-xs">
                  {certificateData.certificate.certificateNumber}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Verification Code</dt>
                <dd className="text-gray-900 font-mono text-xs">
                  {certificateData.certificate.verificationCode}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
