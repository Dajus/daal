import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface CertificateData {
  studentName: string
  courseName: string
  companyName?: string
  completionDate: string
  certificateNumber: string
  verificationCode: string
  score?: number
  abbreviation?: string
}

const getLegislativeTextByAbbreviation = (abbreviation: string | undefined, companyName?: string): string => {
  if (!abbreviation) return ''

  const currentYear = new Date().getFullYear()
  const company = companyName || '[název společnosti]'

  switch (abbreviation.toUpperCase()) {
    case 'BOZP':
      return `Nedílnou součástí tohoto osvědčení o absolvování školení je Osnova školení č.1 pro rok ${currentYear} 
      pro zaměstnance a vedoucí zaměstnance z právních a ostatních předpisů k zajištění bezpečnosti a ochrany zdraví
       při práci ve společnosti ${company} dle § 103, odst. 2 zákoníku práce 262/2006 Sb. ze dne 1.1.${currentYear} 
       a Tematický plán a časový rozvrh školení vedoucích zaměstnanců a zaměstnanců z požární ochrany.`

    case 'REF':
      return `Nedílnou součástí tohoto osvědčení o absolvování školení je Osnova školení č. 2 - ${currentYear} - Školení 
      řidičů vozidel zaměstnavatele z právních a ostatních předpisů k zajištění bezpečnosti práce a ochrany zdraví při 
      práci ve společnosti ${company} dle § 103, odst.2 a § 349, odst. 1 zákona č. 262/2006 Sb., Zákoníku práce, v 
      platném znění ze dne 1.1.${currentYear}`

    case 'PVV':
      return `o absolvování školení a zkoušky z problematiky bezpečnosti a ochrany zdraví při práci ve smyslu § 103 odst. 2 zákona č. 262/2006
      Sb. Zákoník práce, v platném znění, se zaměřením pro provádění práce ve výškách dle Nařízení vlády č. 362/2005 Sb., o bližších
      požadavcích na bezpečnost a ochranu zdraví při práci na pracovišti s nebezpečím pádu z výšky nebo do hloubky, v platném znění
      a Nařízení vlády č. 591/2006 Sb. o bližších a minimálních požadavcích na bezpečnost a ochranu zdraví při práci na staveništích, v
      platném znění. Nedílnou součástí tohoto osvědčení o absolvování školení PVV je Osnova školení pro rok ${currentYear}. Školení
      zaměstnanců provádějící práce ve výškách z právních a ostatních předpisů k zajištění bezpečnosti a ochrany zdraví při práci při
      provádění práce ve výškách ve společnosti: ${company}`

    case 'BOZPAJ':
      return `An integral part of this training completion certificate is Training Outline No. 1 for the year ${currentYear}
       for employees and managerial staff regarding legal and other regulations ensuring safety and health protection 
       at work within ${company}according to § 103, para. 2 of the Labor Code 262/2006 Coll. dated 1.1.${currentYear}
       and the Thematic Plan and Schedule for training of managerial staff and employees in fire protection.`

    case 'BOZPPL':
      return `Integralną częścią niniejszego certyfikatu ukończenia szkolenia jest Program Szkolenia nr 1 na rok ${currentYear}
       dla pracowników i kadry kierowniczej dotyczący przepisów prawnych i innych regulacji zapewniających
        bezpieczeństwo i ochronę zdrowia w pracy w ramach ${company} zgodnie z § 103, ust. 2 Kodeksu pracy
         262/2006 Sb. z dnia 1.1.${currentYear} oraz Plan Tematyczny i Harmonogram szkoleń dla kadry kierowniczej
          i pracowników w zakresie ochrony przeciwpożarowej.`

    case 'BOZPUA':
      return `Невід'ємною частиною цього сертифікату про завершення навчання є Програма навчання № 1 на рік ${currentYear} 
      для працівників і керівного складу щодо правових та інших норм, які забезпечують безпеку і охорону здоров'я на
       роботі в рамках ${company} відповідно до § 103, п. 2 Трудового кодексу 262/2006 Зб. від 1.1.${currentYear} та
        Тематичний план і Графік навчання керівного складу і працівників з питань пожежної безпеки.`

    case 'ADR':
      return `Školení osob podílející se na přepravě a manipulaci nebezpečných věcí v silniční dopravě /tzv. malá ADR/ 
      předepsané v části 1, podle kapitoly 8.2.3 dle Evropské dohody o mezinárodní silniční přepravě nebezpečných věcí.`

    case 'TEST':
      return `Nedílnou součástí tohoto osvědčení o absolvování školení je Osnova školení č.1 pro rok ${currentYear} 
      pro zaměstnance a vedoucí zaměstnance z právních a ostatních předpisů k zajištění bezpečnosti a ochrany zdraví
       při práci ve společnosti ${company} dle § 103, odst. 2 zákoníku práce 262/2006 Sb. ze dne 1.1.${currentYear} 
       a Tematický plán a časový rozvrh školení vedoucích zaměstnanců a zaměstnanců z požární ochrany.`

    default:
      return ''
  }
}

const generateCertificateHTML = (data: CertificateData): string => {
  const legislativeText = getLegislativeTextByAbbreviation(data.abbreviation, data.companyName)

  return `
    <div id="certificate" style="
      width: 297mm; 
      height: 210mm; 
      margin: 0;
      padding: 0;
      font-family: 'Arial', 'Helvetica', sans-serif;
      background: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      
      <div style="
        background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
        height: 40mm;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: -20mm;
          right: -30mm;
          width: 80mm;
          height: 80mm;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: -40mm;
          left: -40mm;
          width: 100mm;
          height: 100mm;
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 50%;
        "></div>
        
        <!-- Logo a název -->
        <div style="
          position: absolute;
          top: 20mm;
          left: 20mm;
          color: white;
          z-index: 10;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              width: 48px;
              height: 48px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(10px);
              border: 2px solid rgba(255,255,255,0.3);
            ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" 
                      fill="white" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            
            <div>
              <div style="
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                margin: 0;
                line-height: 1;
              ">DAAL</div>
              <div style="
                font-size: 11px;
                opacity: 0.9;
                margin: 2px 0 0 0;
                font-weight: 500;
              ">ŠKOLICÍ PLATFORMA</div>
            </div>
          </div>
        </div>

        <!-- Číslo certifikátu -->
        <div style="
          position: absolute;
          top: 20mm;
          right: 20mm;
          color: white;
          text-align: right;
          z-index: 10;
        ">
          <div style="
            font-size: 10px;
            opacity: 0.8;
            margin-bottom: 8px;
          ">Certifikát č.</div>
          <div style="
            font-family: 'Courier New', monospace;
            font-size: 10px;
            font-weight: bold;
            background: rgba(255,255,255,0.2);
            padding: 0 10px 14px 10px;
            border-radius: 4px;
            backdrop-filter: blur(5px);
          ">${data.certificateNumber}</div>
        </div>
      </div>

      <!-- Hlavní obsah -->
      <div style="
        padding: 25mm 20mm 0 20mm;
        text-align: center;
        position: relative;
        margin-top: -12mm;
        z-index: 20;
      ">
        
        <div style="
          width: 64px;
          height: 64px;
          background: #ecfdf5;
          border: 4px solid #10b981;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5mm;
          position: relative;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6V12C4 17 7 21 12 22C17 21 20 17 20 12V6L12 2Z" fill="#10b981"/>
            <path d="M9 12L11 14L15 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <div style="
            position: absolute;
            top: -6px;
            right: -6px;
            width: 24px;
            height: 24px;
            background: #059669;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Nadpis -->
        <div style="margin-bottom: 0;">
          <h1 style="
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin: 0 0 20px 0;
            letter-spacing: 4px;
            line-height: 1;
          ">CERTIFIKÁT</h1>
          
          <div style="
            position: relative;
            bottom: -14px;
            width: 120px;
            height: 3px;
            background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
            margin: 0 auto 12px auto;
            border-radius: 2px;
          "></div>
          
          <p style="
            font-size: 18px;
            color: #10b981;
            font-weight: 600;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin: 0;
          ">O úspěšném dokončení školení</p>
        </div>

        <!-- Informace o studentovi -->
        <div style="margin-bottom: 15mm;">
          <p style="
            font-size: 16px;
            color: #6b7280;
            margin: 0 0 12mm 0;
          ">Tímto se potvrzuje, že úspěšně dokončil(a) školení</p>
          
          <!-- Jméno studenta -->
          <div style="
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 0 0 24px 0;
            margin: 0 auto 5mm auto;
            max-width: 180mm;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateX(-50%) translateY(-50%);
              width: 100vw;
              height: 5px;
              background: #10b981;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
              z-index: -1;
            "></div>
            
            <h3 style="
              font-size: 32px;
              font-weight: bold;
              color: #1f2937;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.2;
            ">${data.studentName}</h3>
          </div>

          <!-- Název kurzu nebo legislativní text -->
          <div style="
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 0 0 20px 0;
            margin: 0 auto;
            width: 50%;
          ">
            ${
              legislativeText
                ? `
            <!-- Pouze legislativní text -->
            <div style="
              padding: 12px 16px;
              text-align: left;
            ">
              <p style="
                font-size: 14px;
                color: #065f46;
                line-height: 1.6;
                margin: 0;
                text-align: justify;
              ">${legislativeText}</p>
            </div>
            `
                : `
            <!-- Název kurzu a společnost -->
            <h4 style="
              font-size: 22px;
              font-weight: bold;
              color: #059669;
              margin: 0 0 6px 0;
              line-height: 1.3;
            ">${data.courseName}</h4>

            ${
              data.companyName
                ? `
            <p style="
              font-size: 14px;
              color: #6b7280;
              font-style: italic;
              margin: 0;
            ">pro společnost: <span style="font-weight: 600; color: #374151;">${data.companyName}</span></p>
            `
                : ''
            }
            `
            }
          </div>
        </div>
      </div>

      <div style="
        position: absolute;
        bottom: 12mm;
        left: 20mm;
        right: 20mm;
        padding-top: 10mm;
      ">
        
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 10mm;
        ">
          <div style="text-align: left;">
            <div style="
              font-size: 11px;
              color: #6b7280;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            ">Datum dokončení</div>
            <div style="
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            ">${data.completionDate}</div>
          </div>
          
          <div style="text-align: center;">
            <div style="
              width: 140px;
              border-bottom: 2px solid #d1d5db;
              margin-bottom: 4px;
            "></div>
            <div style="
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            ">Digitálně podepsáno</div>
            <div style="
              font-size: 10px;
              color: #9ca3af;
            ">DAAL Training Platform</div>
          </div>
        </div>

        <div style="
          text-align: center;
          margin-top: 6mm;
          padding-top: 6mm;
          border-top: 1px solid #f3f4f6;
        ">
          <div style="
            font-size: 9px;
            color: #6b7280;
            line-height: 1.4;
          ">
            <strong style="color: #374151;">DAAL Školicí platforma</strong>
            <span style="margin: 0 6px; color: #d1d5db;">|</span>
            Třinec, Česká republika
            <span style="margin: 0 6px; color: #d1d5db;">|</span>
            Profesionální školení bezpečnosti práce
          </div>
        </div>
      </div>
    </div>
  `
}

const prepareCertificateElement = (html: string): HTMLElement => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  tempDiv.style.position = 'fixed'
  tempDiv.style.top = '0'
  tempDiv.style.left = '0'
  tempDiv.style.zIndex = '9999'
  tempDiv.style.background = 'white'
  tempDiv.style.overflow = 'hidden'

  document.body.appendChild(tempDiv)
  return tempDiv.querySelector('#certificate') as HTMLElement
}

const cleanupElement = (element: HTMLElement) => {
  const parent = element.parentElement
  if (parent && parent.parentElement) {
    parent.parentElement.removeChild(parent)
  }
}

export const generateCertificateHTML2Canvas = async (data: CertificateData): Promise<void> => {
  const certificateHTML = generateCertificateHTML(data)
  const certificateElement = prepareCertificateElement(certificateHTML)

  try {
    const canvas = await html2canvas(certificateElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1123,
      height: 794,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('#certificate')
        if (clonedElement) {
          ;(clonedElement as HTMLElement).style.fontFamily = 'Arial, Helvetica, sans-serif'
        }
      },
    })

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: false,
      precision: 16,
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)

    const cleanName = data.studentName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, '')
      .toLowerCase()

    const fileName = `certifikat-${cleanName}-${data.certificateNumber.slice(-6)}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('❌ Chyba při generování PDF:', error)
    throw error
  } finally {
    cleanupElement(certificateElement)
  }
}

export const downloadCertificate = async (data: CertificateData): Promise<void> => {
  await generateCertificateHTML2Canvas(data)
}

export const generateCertificateBlob = async (data: CertificateData): Promise<Blob> => {
  const certificateHTML = generateCertificateHTML(data)
  const certificateElement = prepareCertificateElement(certificateHTML)
  try {
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1123,
      height: 794,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    })

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 10,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST')

    return pdf.output('blob')
  } catch (error) {
    console.error('Chyba při generování PDF Blob:', error)
    throw error
  } finally {
    cleanupElement(certificateElement)
  }
}
