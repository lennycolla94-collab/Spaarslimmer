import nodemailer from 'nodemailer';

export interface QuoteData {
  leadName: string;
  companyName: string;
  products: {
    type: string;
    plan: string;
    monthlyPrice: number;
    currentPrice?: number;
  }[];
  totalMonthly: number;
  currentTotal?: number;
  savings6m: number;
  savings24m: number;
  consultantName: string;
  consultantEmail: string;
  consultantPhone: string;
  quoteId: string;
  validUntil: Date;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create email transporter
function createTransporter(): nodemailer.Transporter {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransporter(config);
}

/**
 * Generate HTML email template for quote
 */
function generateQuoteTemplate(data: QuoteData): string {
  const savingsBadge = data.savings6m > 0 
    ? `<div style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; display: inline-block; margin: 16px 0;">
         <strong>💰 U bespaart €${data.savings6m.toFixed(2)} in 6 maanden!</strong>
       </div>`
    : '';

  const productsList = data.products.map(p => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${p.type} - ${p.plan}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${p.currentPrice ? `<span style="text-decoration: line-through; color: #9ca3af;">€${p.currentPrice.toFixed(2)}</span> ` : ''}
        <strong>€${p.monthlyPrice.toFixed(2)}/maand</strong>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Uw SmartSN Offerte</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">SmartSN</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Uw persoonlijke offerte</p>
  </div>

  <!-- Content -->
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Beste ${data.leadName},</p>
    
    <p>Hartelijk dank voor uw interesse in SmartSN. Hierbij ontvangt u uw persoonlijke offerte voor <strong>${data.companyName}</strong>.</p>
    
    ${savingsBadge}

    <h3 style="color: #667eea; margin-top: 24px;">📋 Overzicht producten</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; text-align: left;">Product</th>
          <th style="padding: 12px; text-align: right;">Prijs</th>
        </tr>
      </thead>
      <tbody>
        ${productsList}
      </tbody>
      <tfoot>
        <tr style="background: #f9fafb; font-weight: bold;">
          <td style="padding: 12px;">Totaal per maand</td>
          <td style="padding: 12px; text-align: right; font-size: 18px; color: #667eea;">
            ${data.currentTotal ? `<span style="text-decoration: line-through; color: #9ca3af; font-size: 14px;">€${data.currentTotal.toFixed(2)}</span> ` : ''}
            €${data.totalMonthly.toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>

    <h3 style="color: #667eea;">💡 Uw voordeel</h3>
    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0;"><strong>Besparing 6 maanden:</strong> €${data.savings6m.toFixed(2)}</p>
      <p style="margin: 8px 0 0 0;"><strong>Besparing 24 maanden:</strong> €${data.savings24m.toFixed(2)}</p>
    </div>

    <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px;"><strong>Offerte geldig tot:</strong> ${data.validUntil.toLocaleDateString('nl-BE')}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px;"><strong>Offertenummer:</strong> ${data.quoteId}</p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="mailto:${data.consultantEmail}?subject=Akkoord met offerte ${data.quoteId}" 
         style="background: #22c55e; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        ✅ Akkoord - Start overstap
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

    <h3 style="color: #667eea;">📞 Uw consultant</h3>
    <p style="margin: 0;"><strong>${data.consultantName}</strong></p>
    <p style="margin: 4px 0; font-size: 14px;">📧 ${data.consultantEmail}</p>
    <p style="margin: 4px 0; font-size: 14px;">📱 ${data.consultantPhone}</p>

    <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
      Heeft u vragen? Antwoord gerust op deze email of bel mij direct. Ik help u graag verder!
    </p>
  </div>

  <!-- Footer -->
  <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      SmartSN - Slimmer Communiceren<br>
      Deze offerte is 30 dagen geldig en vrijblijvend.
    </p>
    <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
      <a href="${process.env.UNSUBSCRIBE_URL || '#'}?email={{email}}" style="color: #9ca3af;">Uitschrijven van emails</a> | 
      <a href="${process.env.PRIVACY_URL || '#'}/privacy" style="color: #9ca3af;">Privacybeleid</a>
    </p>
  </div>
</body>
</html>`;
}

/**
 * Send quote email to lead
 */
export async function sendQuoteEmail(
  to: string,
  quoteData: QuoteData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify connection (optional in production)
    if (process.env.NODE_ENV === 'development') {
      await transporter.verify();
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"SmartSN" <${process.env.SMTP_USER || 'noreply@smartsn.be'}>`,
      to,
      subject: `Uw SmartSN Offerte - €${quoteData.savings6m.toFixed(0)} besparing!`,
      html: generateQuoteTemplate(quoteData),
      text: `Beste ${quoteData.leadName},\n\nHartelijk dank voor uw interesse in SmartSN. ` +
            `Uw besparing: €${quoteData.savings6m.toFixed(2)} in 6 maanden.\n\n` +
            `Contact: ${quoteData.consultantName} - ${quoteData.consultantEmail}`,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send welcome email for new activations
 */
export async function sendWelcomeEmail(
  to: string,
  data: {
    leadName: string;
    companyName: string;
    consultantName: string;
    consultantEmail: string;
    consultantPhone: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welkom bij SmartSN</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0;">Welkom bij SmartSN!</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Beste ${data.leadName},</p>
    <p>Welkom bij SmartSN! Wij zijn verheugd dat u voor ons heeft gekozen voor <strong>${data.companyName}</strong>.</p>
    <p>Uw consultant <strong>${data.consultantName}</strong> staat voor u klaar bij alle vragen.</p>
    <p>📧 ${data.consultantEmail}<br>📱 ${data.consultantPhone}</p>
  </div>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"SmartSN" <${process.env.SMTP_USER || 'noreply@smartsn.be'}>`,
      to,
      subject: 'Welkom bij SmartSN!',
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
