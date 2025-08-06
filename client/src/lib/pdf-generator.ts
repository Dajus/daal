import jsPDF from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseName: string;
  companyName?: string;
  completionDate: string;
  certificateNumber: string;
  verificationCode: string;
  score?: number;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Modern gradient background
  pdf.setFillColor(255, 255, 255); // White background
  pdf.rect(0, 0, 297, 210, 'F');

  // Emerald gradient header
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.rect(0, 0, 297, 60, 'F');
  
  // Subtle emerald accent
  pdf.setFillColor(236, 253, 245); // emerald-50
  pdf.rect(0, 60, 297, 150, 'F');

  // Decorative border
  pdf.setDrawColor(16, 185, 129); // emerald-500
  pdf.setLineWidth(3);
  pdf.rect(15, 15, 267, 180);

  // Inner accent border
  pdf.setDrawColor(110, 231, 183); // emerald-300
  pdf.setLineWidth(1);
  pdf.rect(20, 20, 257, 170);

  // Modern logo area with emerald gradient
  pdf.setFillColor(5, 150, 105); // emerald-600
  pdf.roundedRect(115, 25, 67, 25, 3, 3, 'F');
  
  // DAAL logo text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255); // White text
  pdf.text('DAAL', 148.5, 42, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(9);
  pdf.setTextColor(209, 250, 229); // emerald-100
  pdf.text('BEZPEČNOSTNÍ ŠKOLENÍ', 148.5, 48, { align: 'center' });

  // Certificate title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text('CERTIFIKÁT', 148.5, 80, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(16, 185, 129); // emerald-500
  pdf.text('O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ', 148.5, 92, { align: 'center' });

  // Decorative line
  pdf.setDrawColor(110, 231, 183); // emerald-300
  pdf.setLineWidth(2);
  pdf.line(80, 100, 217, 100);

  // Main content section
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99); // gray-600
  pdf.text('Tímto se potvrzuje, že', 148.5, 115, { align: 'center' });

  // Student name with modern styling
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text(data.studentName.toUpperCase(), 148.5, 130, { align: 'center' });

  // Course completion text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  pdf.text('úspěšně dokončil(a) školení', 148.5, 145, { align: 'center' });

  // Course name with emphasis
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(16, 185, 129); // emerald-500
  pdf.text(data.courseName, 148.5, 160, { align: 'center' });

  // Company name if available
  if (data.companyName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    pdf.text(`pro společnost: ${data.companyName}`, 148.5, 172, { align: 'center' });
  }

  // Bottom section with certificate details
  const detailsY = 185;
  
  // Left side - Date with modern card styling
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(30, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text('DATUM DOKONČENÍ', 60, detailsY, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(data.completionDate, 60, detailsY + 7, { align: 'center' });

  // Right side - Certificate ID with modern card styling
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(207, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text('ČÍSLO CERTIFIKÁTU', 237, detailsY, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(data.certificateNumber, 237, detailsY + 7, { align: 'center' });

  // Verification section
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Ověřovací kód: ${data.verificationCode}`, 148.5, 202, { align: 'center' });

  // Footer with modern branding
  pdf.setFontSize(8);
  pdf.setTextColor(110, 231, 183); // emerald-300
  pdf.text('DAAL Školící platforma | Praha, Česká republika', 148.5, 208, { align: 'center' });

  return pdf;
};

export const downloadCertificate = (data: CertificateData): void => {
  const pdf = generateCertificatePDF(data);
  const fileName = `certifikat-${data.certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};