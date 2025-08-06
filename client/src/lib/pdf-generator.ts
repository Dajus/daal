import jsPDF from 'jspdf';
import { loadRobotoFont, addRobotoToJSPDF } from './font-loader';

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
const loadCustomFont = async (pdf: jsPDF): Promise<boolean> => {
  try {
    const fontBase64 = await loadRobotoFont();
    if (fontBase64) {
      return addRobotoToJSPDF(pdf, fontBase64);
    }
  } catch (error) {
    console.error('Failed to load custom font:', error);
  }
  return false;
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

export const generateCertificatePDF = async (data: CertificateData): Promise<jsPDF> => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Try to load custom font with Czech support
  const customFontLoaded = await loadCustomFont(pdf);
  
  // Set the font - use Roboto if loaded successfully, otherwise fall back to Helvetica
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }

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
  
  // Subtitle - use original Czech text with custom font
  pdf.setFontSize(9);
  pdf.setTextColor(209, 250, 229); // emerald-100
  if (customFontLoaded) {
    pdf.text('BEZPEČNOSTNÍ ŠKOLENÍ', 148.5, 48, { align: 'center' });
  } else {
    pdf.text('BEZPECNOSTNI SKOLENI', 148.5, 48, { align: 'center' });
  }

  // Certificate title - use original Czech text with custom font
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal'); // Roboto doesn't have separate bold, use normal
  } else {
    pdf.setFont('helvetica', 'bold');
  }
  pdf.setFontSize(28);
  pdf.setTextColor(6, 78, 59); // emerald-800
  if (customFontLoaded) {
    pdf.text('CERTIFIKÁT', 148.5, 80, { align: 'center' });
  } else {
    pdf.text('CERTIFIKAT', 148.5, 80, { align: 'center' });
  }
  
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(16);
  pdf.setTextColor(16, 185, 129); // emerald-500
  if (customFontLoaded) {
    pdf.text('O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ', 148.5, 92, { align: 'center' });
  } else {
    pdf.text('O USPESNEM DOKONCENI SKOLENI', 148.5, 92, { align: 'center' });
  }

  // Decorative line
  pdf.setDrawColor(110, 231, 183); // emerald-300
  pdf.setLineWidth(2);
  pdf.line(80, 100, 217, 100);

  // Main content section - use original Czech text with custom font
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99); // gray-600
  if (customFontLoaded) {
    pdf.text('Tímto se potvrzuje, že', 148.5, 115, { align: 'center' });
  } else {
    pdf.text('Timto se potvrzuje, ze', 148.5, 115, { align: 'center' });
  }

  // Student name with modern styling
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'bold');
  }
  pdf.setFontSize(22);
  pdf.setTextColor(6, 78, 59); // emerald-800
  pdf.text(data.studentName.toUpperCase(), 148.5, 130, { align: 'center' });

  // Course completion text - use original Czech text with custom font
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  if (customFontLoaded) {
    pdf.text('úspěšně dokončil(a) školení', 148.5, 145, { align: 'center' });
  } else {
    pdf.text('uspesne dokoncil(a) skoleni', 148.5, 145, { align: 'center' });
  }

  // Course name with emphasis
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'bold');
  }
  pdf.setFontSize(17);
  pdf.setTextColor(16, 185, 129); // emerald-500
  pdf.text(data.courseName, 148.5, 160, { align: 'center' });

  // Company name if available - use original Czech text with custom font
  if (data.companyName) {
    if (customFontLoaded) {
      pdf.setFont('Roboto', 'normal');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    if (customFontLoaded) {
      pdf.text(`pro společnost: ${data.companyName}`, 148.5, 172, { align: 'center' });
    } else {
      pdf.text(`pro spolecnost: ${data.companyName}`, 148.5, 172, { align: 'center' });
    }
  }

  // Bottom section with certificate details
  const detailsY = 185;
  
  // Left side - Date with modern card styling - use original Czech text with custom font
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(30, detailsY - 5, 60, 12, 2, 2, 'F');
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'bold');
  }
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  if (customFontLoaded) {
    pdf.text('DATUM DOKONČENÍ', 60, detailsY, { align: 'center' });
  } else {
    pdf.text('DATUM DOKONCENI', 60, detailsY, { align: 'center' });
  }
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(11);
  pdf.text(data.completionDate, 60, detailsY + 7, { align: 'center' });

  // Right side - Certificate ID with modern card styling - use original Czech text with custom font
  pdf.setFillColor(240, 253, 244); // emerald-50
  pdf.roundedRect(207, detailsY - 5, 60, 12, 2, 2, 'F');
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'bold');
  }
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59); // emerald-800
  if (customFontLoaded) {
    pdf.text('ČÍSLO CERTIFIKÁTU', 237, detailsY, { align: 'center' });
  } else {
    pdf.text('CISLO CERTIFIKATU', 237, detailsY, { align: 'center' });
  }
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(9);
  pdf.text(data.certificateNumber, 237, detailsY + 7, { align: 'center' });

  // Verification section - use original Czech text with custom font
  if (customFontLoaded) {
    pdf.setFont('Roboto', 'normal');
  } else {
    pdf.setFont('helvetica', 'normal');
  }
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  if (customFontLoaded) {
    pdf.text(`Ověřovací kód: ${data.verificationCode}`, 148.5, 202, { align: 'center' });
  } else {
    pdf.text(`Overovaci kod: ${data.verificationCode}`, 148.5, 202, { align: 'center' });
  }

  // Footer with modern branding - use original Czech text with custom font
  pdf.setFontSize(8);
  pdf.setTextColor(110, 231, 183); // emerald-300
  if (customFontLoaded) {
    pdf.text('DAAL Školící platforma | Praha, Česká republika', 148.5, 208, { align: 'center' });
  } else {
    pdf.text('DAAL Skolici platforma | Praha, Ceska republika', 148.5, 208, { align: 'center' });
  }

  return pdf;
};

export const downloadCertificate = async (data: CertificateData): Promise<void> => {
  const pdf = await generateCertificatePDF(data);
  const fileName = `certifikat-${data.certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};