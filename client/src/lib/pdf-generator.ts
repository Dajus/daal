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

  // Set background color
  pdf.setFillColor(248, 250, 252); // bg-slate-50
  pdf.rect(0, 0, 297, 210, 'F');

  // Add border
  pdf.setDrawColor(59, 130, 246); // primary color
  pdf.setLineWidth(2);
  pdf.rect(10, 10, 277, 190);

  // Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246); // primary color
  pdf.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' });

  // DAAL Logo area (placeholder)
  pdf.setFillColor(239, 246, 255); // primary-light
  pdf.rect(130, 50, 37, 20, 'F');
  pdf.setFontSize(16);
  pdf.setTextColor(59, 130, 246);
  pdf.text('DAAL', 148.5, 63, { align: 'center' });

  // Main content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99); // gray-600
  pdf.text('This certifies that', 148.5, 85, { align: 'center' });

  // Student name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(59, 130, 246);
  pdf.text(data.studentName, 148.5, 100, { align: 'center' });

  // Course details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  pdf.text('has successfully completed', 148.5, 115, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(17, 24, 39); // gray-900
  pdf.text(data.courseName, 148.5, 130, { align: 'center' });

  if (data.companyName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    pdf.text(data.companyName, 148.5, 145, { align: 'center' });
  }

  // Completion details
  const detailsY = data.companyName ? 165 : 155;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(75, 85, 99);
  
  // Left side - Date
  pdf.text('Completion Date:', 50, detailsY);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.completionDate, 50, detailsY + 8);

  // Center - Certificate ID
  pdf.setFont('helvetica', 'normal');
  pdf.text('Certificate ID:', 148.5, detailsY, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(data.certificateNumber, 148.5, detailsY + 8, { align: 'center' });

  // Right side - Score (if available)
  if (data.score !== undefined) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text('Score:', 247, detailsY, { align: 'right' });
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${data.score}%`, 247, detailsY + 8, { align: 'right' });
  }

  // QR Code placeholder
  const qrY = detailsY + 20;
  pdf.setFillColor(255, 255, 255);
  pdf.rect(135, qrY, 27, 27, 'F');
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1);
  pdf.rect(135, qrY, 27, 27);
  
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('QR Code', 148.5, qrY + 14, { align: 'center' });
  pdf.text('for Verification', 148.5, qrY + 20, { align: 'center' });

  // Verification code
  pdf.setFontSize(8);
  pdf.text(`Verification: ${data.verificationCode}`, 148.5, qrY + 35, { align: 'center' });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('DAAL Training Platform - Professional Workplace Safety Training', 148.5, 195, { align: 'center' });
  pdf.text('Prague, Czech Republic | www.daal.cz', 148.5, 200, { align: 'center' });

  return pdf;
};

export const downloadCertificate = (data: CertificateData): void => {
  const pdf = generateCertificatePDF(data);
  const fileName = `certificate-${data.certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};
