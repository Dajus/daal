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

// ŘEŠENÍ 1: Kompletní ASCII transliterace pro jsPDF
const czechToAscii = (text: string): string => {
  const map: { [key: string]: string } = {
    'á': 'a', 'Á': 'A',
    'č': 'c', 'Č': 'C',
    'ď': 'd', 'Ď': 'D',
    'é': 'e', 'É': 'E',
    'ě': 'e', 'Ě': 'E',
    'í': 'i', 'Í': 'I',
    'ň': 'n', 'Ň': 'N',
    'ó': 'o', 'Ó': 'O',
    'ř': 'r', 'Ř': 'R',
    'š': 's', 'Š': 'S',
    'ť': 't', 'Ť': 'T',
    'ú': 'u', 'Ú': 'U',
    'ů': 'u', 'Ů': 'U',
    'ý': 'y', 'Ý': 'Y',
    'ž': 'z', 'Ž': 'Z'
  };

  return text.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, match => map[match] || match);
};

// Bezpečná funkce pro text s automatickou transliterací
const safeText = (pdf: jsPDF, text: string, x: number, y: number, options?: any): void => {
  const asciiText = czechToAscii(text);
  pdf.text(asciiText, x, y, options);
};

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Moderní gradientní pozadí
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, 297, 210, 'F');

  // Smaragdový header
  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, 297, 60, 'F');

  // Jemný smaragdový akcent
  pdf.setFillColor(236, 253, 245);
  pdf.rect(0, 60, 297, 150, 'F');

  // Dekorativní ohraničení
  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(3);
  pdf.rect(15, 15, 267, 180);

  // Vnitřní akcentní ohraničení
  pdf.setDrawColor(110, 231, 183);
  pdf.setLineWidth(1);
  pdf.rect(20, 20, 257, 170);

  // Logo oblast
  pdf.setFillColor(5, 150, 105);
  pdf.roundedRect(115, 25, 67, 25, 3, 3, 'F');

  // DAAL logo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text('DAAL', 148.5, 42, { align: 'center' });

  // Podtitul - transliterovaný
  pdf.setFontSize(9);
  pdf.setTextColor(209, 250, 229);
  safeText(pdf, 'BEZPECNOSTNI SKOLENI', 148.5, 48, { align: 'center' });

  // Název certifikátu - transliterovaný
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(6, 78, 59);
  safeText(pdf, 'CERTIFIKAT', 148.5, 80, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(16, 185, 129);
  safeText(pdf, 'O USPESNEM DOKONCENI SKOLENI', 148.5, 92, { align: 'center' });

  // Dekorativní čára
  pdf.setDrawColor(110, 231, 183);
  pdf.setLineWidth(2);
  pdf.line(80, 100, 217, 100);

  // Hlavní obsah
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  safeText(pdf, 'Timto se potvrzuje, ze', 148.5, 115, { align: 'center' });

  // Jméno studenta
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(6, 78, 59);
  safeText(pdf, data.studentName.toUpperCase(), 148.5, 130, { align: 'center' });

  // Text dokončení
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(75, 85, 99);
  safeText(pdf, 'uspesne dokoncil(a) skoleni', 148.5, 145, { align: 'center' });

  // Název kurzu
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(16, 185, 129);
  safeText(pdf, data.courseName, 148.5, 160, { align: 'center' });

  // Společnost
  if (data.companyName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    safeText(pdf, `pro spolecnost: ${data.companyName}`, 148.5, 172, { align: 'center' });
  }

  // Detaily
  const detailsY = 185;

  // Datum
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(30, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59);
  safeText(pdf, 'DATUM DOKONCENI', 60, detailsY, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(data.completionDate, 60, detailsY + 7, { align: 'center' });

  // ID certifikátu
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(207, detailsY - 5, 60, 12, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(6, 78, 59);
  safeText(pdf, 'CISLO CERTIFIKATU', 237, detailsY, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(data.certificateNumber, 237, detailsY + 7, { align: 'center' });

  // Ověření
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  safeText(pdf, `Overovaci kod: ${data.verificationCode}`, 148.5, 202, { align: 'center' });

  // Zápatí
  pdf.setFontSize(8);
  pdf.setTextColor(110, 231, 183);
  safeText(pdf, 'DAAL Skolici platforma | Praha, Ceska republika', 148.5, 208, { align: 'center' });

  return pdf;
};

// ŘEŠENÍ 2: HTML to PDF alternativa (vyžaduje html2canvas a jspdf)
export const generateCertificateFromHTML = async (data: CertificateData): Promise<Blob> => {
  // Vytvoření HTML certifikátu s českými znaky
  const htmlContent = `
    <div style="width: 297mm; height: 210mm; font-family: Arial, sans-serif; position: relative; background: linear-gradient(to bottom, #10b981 0%, #10b981 20%, #ecfdf5 20%, #ecfdf5 100%);">
      <div style="position: absolute; top: 15mm; left: 15mm; right: 15mm; bottom: 15mm; border: 3px solid #10b981; padding: 20mm;">
        
        <!-- Logo oblast -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #059669; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">DAAL</h1>
            <p style="margin: 0; font-size: 12px;">BEZPEČNOSTNÍ ŠKOLENÍ</p>
          </div>
        </div>

        <!-- Název certifikátu -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 36px; color: #064e3b; margin: 0;">CERTIFIKÁT</h1>
          <h2 style="font-size: 20px; color: #10b981; margin: 10px 0;">O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ</h2>
          <hr style="width: 200px; border: 2px solid #6ee7b7; margin: 20px auto;">
        </div>

        <!-- Hlavní obsah -->
        <div style="text-align: center; margin-bottom: 40px;">
          <p style="font-size: 18px; color: #4b5563; margin-bottom: 20px;">Tímto se potvrzuje, že</p>
          <h2 style="font-size: 28px; color: #064e3b; margin: 20px 0; font-weight: bold;">${data.studentName.toUpperCase()}</h2>
          <p style="font-size: 18px; color: #4b5563; margin-bottom: 20px;">úspěšně dokončil(a) školení</p>
          <h3 style="font-size: 22px; color: #10b981; margin: 20px 0; font-weight: bold;">${data.courseName}</h3>
          ${data.companyName ? `<p style="font-size: 16px; color: #6b7280; font-style: italic;">pro společnost: ${data.companyName}</p>` : ''}
        </div>

        <!-- Detaily -->
        <div style="display: flex; justify-content: space-between; margin-top: 60px;">
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; min-width: 150px;">
            <p style="font-weight: bold; color: #064e3b; margin: 0; font-size: 12px;">DATUM DOKONČENÍ</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">${data.completionDate}</p>
          </div>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; min-width: 150px;">
            <p style="font-weight: bold; color: #064e3b; margin: 0; font-size: 12px;">ČÍSLO CERTIFIKÁTU</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; font-family: monospace;">${data.certificateNumber}</p>
          </div>
        </div>

        <!-- Zápatí -->
        <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center;">
          <p style="font-size: 10px; color: #6b7280; margin: 0;">Ověřovací kód: ${data.verificationCode}</p>
          <p style="font-size: 10px; color: #6ee7b7; margin: 5px 0 0 0;">DAAL Školicí platforma | Praha, Česká republika</p>
        </div>
      </div>
    </div>
  `;

  // Převod HTML na PDF pomocí Puppeteer nebo html2pdf
  // Pro implementaci potřebujete přidat html2canvas a html2pdf.js
  return new Promise((resolve) => {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    // Simulace - ve skutečnosti byste použili html2pdf
    setTimeout(() => {
      document.body.removeChild(element);
      resolve(new Blob(['PDF obsah s českými znaky'], { type: 'application/pdf' }));
    }, 100);
  });
};

// ŘEŠENÍ 3: Server-side generování
export const generateCertificateOnServer = async (data: CertificateData): Promise<Blob> => {
  const response = await fetch('/api/generate-certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Chyba při generování certifikátu na serveru');
  }

  return response.blob();
};

export const downloadCertificate = async (data: CertificateData): Promise<void> => {
  try {
    // Řešení 1: ASCII transliterace (okamžité, ale bez diakritiky)
    const pdf = generateCertificatePDF(data);
    const fileName = `certifikat-${data.certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    pdf.save(fileName);

    // Alternativně můžete zkusit:
    // const blob = await generateCertificateFromHTML(data);
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = fileName;
    // a.click();

  } catch (error) {
    console.error('Chyba při generování certifikátu:', error);
    throw new Error('Nepodařilo se vygenerovat certifikát');
  }
};