import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

export interface EmailCertificateData {
  recipientEmail: string
  recipientName: string
  courseName: string
  certificateNumber: string
  verificationCode: string
  completionDate: string
  companyName?: string
  score?: number
}

class EmailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })
  }

  async sendCertificateEmail(data: EmailCertificateData, pdfBuffer: Buffer): Promise<void> {
    const mailOptions = {
      from: `"DAAL Training" <${process.env.EMAIL_USER}>`,
      to: data.recipientEmail,
      subject: `Certifikát - ${data.courseName}`,
      html: `
        <!DOCTYPE html>
        <html lang="cs">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6b7280; }
            .certificate-details { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .certificate-details dt { font-weight: bold; color: #059669; margin-top: 10px; }
            .certificate-details dd { margin-left: 0; color: #374151; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎓 Gratulujeme!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Úspěšně jste dokončili školení</p>
            </div>
            
            <div class="content">
              <p>Vážený/á <strong>${data.recipientName}</strong>,</p>
              
              <p>Blahopřejeme k úspěšnému dokončení kurzu <strong>${data.courseName}</strong>!</p>
              
              ${data.companyName ? `<p>Školení proběhlo pro společnost: <strong>${data.companyName}</strong></p>` : ''}
              
              <div class="certificate-details">
                <h3 style="margin-top: 0; color: #059669;">📋 Detaily certifikátu</h3>
                <dl>
                  <dt>Číslo certifikátu:</dt>
                  <dd style="font-family: monospace;">${data.certificateNumber}</dd>
                  
                  <dt>Datum dokončení:</dt>
                  <dd>${data.completionDate}</dd>
                  
                  ${
                    data.score
                      ? `
                  <dt>Dosažené skóre:</dt>
                  <dd><strong>${data.score}%</strong></dd>
                  `
                      : ''
                  }
                </dl>
              </div>
              
              <p>Váš certifikát naleznete v příloze tohoto emailu.</p>
                            
              <p style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
                Doporučujeme certifikát uložit na bezpečné místo a v případě potřeby jej předložit zaměstnavateli nebo kontrolním orgánům.
              </p>
            </div>
            
            <div class="footer">
              <strong>DAAL Školicí platforma</strong><br>
              Třinec, Česká republika<br>
              Profesionální školení bezpečnosti práce
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Certifikat_${data.certificateNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    }

    await this.transporter.sendMail(mailOptions)
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('✅ Email service ready')
      return true
    } catch (error) {
      console.error('❌ Email service connection failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()
