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

// Helper function to load a custom font with Czech character support
const loadCustomFont = (pdf: jsPDF) => {
  // We'll use DejaVu Sans which has excellent Czech support
  // For now, we'll use a workaround with Unicode escape sequences
  pdf.setFont('helvetica', 'normal');
};

// Helper function to encode Czech text using Unicode escape sequences
const encodeCzechText = (text: string): string => {
  // Use Unicode escape sequences for Czech characters that work with jsPDF
  return text
    .replace(/á/g, '\u00E1')
    .replace(/Á/g, '\u00C1')
    .replace(/č/g, '\u010D')
    .replace(/Č/g, '\u010C')
    .replace(/ď/g, '\u010F')
    .replace(/Ď/g, '\u010E')
    .replace(/é/g, '\u00E9')
    .replace(/É/g, '\u00C9')
    .replace(/ě/g, '\u011B')
    .replace(/Ě/g, '\u011A')
    .replace(/í/g, '\u00ED')
    .replace(/Í/g, '\u00CD')
    .replace(/ň/g, '\u0148')
    .replace(/Ň/g, '\u0147')
    .replace(/ó/g, '\u00F3')
    .replace(/Ó/g, '\u00D3')
    .replace(/ř/g, '\u0159')
    .replace(/Ř/g, '\u0158')
    .replace(/š/g, '\u0161')
    .replace(/Š/g, '\u0160')
    .replace(/ť/g, '\u0165')
    .replace(/Ť/g, '\u0164')
    .replace(/ú/g, '\u00FA')
    .replace(/Ú/g, '\u00DA')
    .replace(/ů/g, '\u016F')
    .replace(/Ů/g, '\u016E')
    .replace(/ý/g, '\u00FD')
    .replace(/Ý/g, '\u00DD')
    .replace(/ž/g, '\u017E')
    .replace(/Ž/g, '\u017D');
};

// Alternative approach using HTML entity codes
const useHTMLEntities = (text: string): string => {
  return text
    .replace(/á/g, 'á')
    .replace(/Á/g, 'Á')
    .replace(/č/g, 'č')
    .replace(/Č/g, 'Č')
    .replace(/ď/g, 'ď')
    .replace(/Ď/g, 'Ď')
    .replace(/é/g, 'é')
    .replace(/É/g, 'É')
    .replace(/ě/g, 'ě')
    .replace(/Ě/g, 'Ě')
    .replace(/í/g, 'í')
    .replace(/Í/g, 'Í')
    .replace(/ň/g, 'ň')
    .replace(/Ň/g, 'Ň')
    .replace(/ó/g, 'ó')
    .replace(/Ó/g, 'Ó')
    .replace(/ř/g, 'ř')
    .replace(/Ř/g, 'Ř')
    .replace(/š/g, 'š')
    .replace(/Š/g, 'Š')
    .replace(/ť/g, 'ť')
    .replace(/Ť/g, 'Ť')
    .replace(/ú/g, 'ú')
    .replace(/Ú/g, 'Ú')
    .replace(/ů/g, 'ů')
    .replace(/Ů/g, 'Ů')
    .replace(/ý/g, 'ý')
    .replace(/Ý/g, 'Ý')
    .replace(/ž/g, 'ž')
    .replace(/Ž/g, 'Ž');
};

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Try to load custom font (placeholder for now)
  loadCustomFont(pdf);

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
  
  // Subtitle - try Unicode encoding
  pdf.setFontSize(9);
  pdf.setTextColor(209, 250, 229); // emerald-100
  try {
    pdf.text(encodeCzechText('BEZPEČNOSTNÍ ŠKOLENÍ'), 148.5, 48, { align: 'center' });
  } catch (e) {
    pdf.text('BEZPECNOSTNI SKOLENI', 148.5, 48, { align: 'center' });
  }

  // Certificate title - try Unicode encoding
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(6, 78, 59); // emerald-800
  try {
    pdf.text(encodeCzechText('CERTIFIKÁT'), 148.5, 80, { align: 'center' });
  } catch (e) {
    pdf.text('CERTIFIKAT', 148.5, 80, { align: 'center' });
  }
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(16, 185, 129); // emerald-500
  try {
    pdf.text(encodeCzechText('O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ'), 148.5, 92, { align: 'center' });
  } catch (e) {
    pdf.text('O USPESNEM DOKONCENI SKOLENI', 148.5, 92, { align: 'center' });
  }

  // Decorative line
  pdf.setDrawColor(110, 231, 183); // emerald-300
  pdf.setLineWidth(2);
  pdf.line(80, 100, 217, 100);

  // Main content section - try Unicode encoding
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99); // gray-600
  try {
    pdf.text(encodeCzechText('Tímto se potvrzuje, že'), 148.5, 115, { align: 'center' });
  } catch (e) {
    pdf.text('Timto se potvrzuje, ze', 148.5, 115, { align: 'center' });
  }

  // Student name with modern styling
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text(data.studentName.toUpperCase(), 148.5, 130, { align: 'center' });

  // Course completion text - try Unicode encoding
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  try {
    pdf.text(encodeCzechText('úspěšně dokončil(a) školení'), 148.5, 145, { align: 'center' });
  } catch (e) {
    pdf.text('uspesne dokoncil(a) skoleni', 148.5, 145, { align: 'center' });
  }

  // Course name with emphasis
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(16, 185, 129); // emerald-500
  pdf.text(data.courseName, 148.5, 160, { align: 'center' });

  // Company name if available - try Unicode encoding
  if (data.companyName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    try {
      pdf.text(encodeCzechText(`pro společnost: ${data.companyName}`), 148.5, 172, { align: 'center' });
    } catch (e) {
      pdf.text(`pro spolecnost: ${data.companyName}`, 148.5, 172, { align: 'center' });
    }
  }

  // Bottom section with certificate details
  const detailsY = 185;
  
  // Left side - Date with modern card styling - try Unicode encoding
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(30, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  try {
    pdf.text(encodeCzechText('DATUM DOKONČENÍ'), 60, detailsY, { align: 'center' });
  } catch (e) {
    pdf.text('DATUM DOKONCENI', 60, detailsY, { align: 'center' });
  }
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(data.completionDate, 60, detailsY + 7, { align: 'center' });

  // Right side - Certificate ID with modern card styling - try Unicode encoding
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(207, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  try {
    pdf.text(encodeCzechText('ČÍSLO CERTIFIKÁTU'), 237, detailsY, { align: 'center' });
  } catch (e) {
    pdf.text('CISLO CERTIFIKATU', 237, detailsY, { align: 'center' });
  }
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(data.certificateNumber, 237, detailsY + 7, { align: 'center' });

  // Verification section - try Unicode encoding
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  try {
    pdf.text(encodeCzechText(`Ověřovací kód: ${data.verificationCode}`), 148.5, 202, { align: 'center' });
  } catch (e) {
    pdf.text(`Overovaci kod: ${data.verificationCode}`, 148.5, 202, { align: 'center' });
  }

  // Footer with modern branding - try Unicode encoding
  pdf.setFontSize(8);
  pdf.setTextColor(110, 231, 183); // emerald-300
  try {
    pdf.text(encodeCzechText('DAAL Školící platforma | Praha, Česká republika'), 148.5, 208, { align: 'center' });
  } catch (e) {
    pdf.text('DAAL Skolici platforma | Praha, Ceska republika', 148.5, 208, { align: 'center' });
  }

  return pdf;
};

export const downloadCertificate = (data: CertificateData): void => {
  const pdf = generateCertificatePDF(data);
  const fileName = `certifikat-${data.certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};