import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface QuotePDFData {
  quoteId: string;
  date: Date;
  validUntil: Date;
  companyName: string;
  contactName: string;
  address: string;
  city: string;
  consultantName: string;
  consultantEmail: string;
  consultantPhone: string;
  products: {
    type: string;
    plan: string;
    description: string;
    monthlyPrice: number;
    currentPrice?: number;
  }[];
  totalMonthly: number;
  currentTotal?: number;
  savings6m: number;
  savings24m: number;
  notes?: string;
}

/**
 * Generate PDF quote document
 */
export async function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let y = height - 50;
  
  // Header
  page.drawText('SmartSN', {
    x: 50,
    y,
    size: 28,
    font: boldFont,
    color: rgb(0.4, 0.49, 0.92), // Purple/blue
  });
  
  page.drawText('OFFERTE', {
    x: width - 150,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  y -= 30;
  
  page.drawText('Slimmer Communiceren', {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  y -= 40;
  
  // Quote info box
  page.drawRectangle({
    x: 50,
    y: y - 60,
    width: width - 100,
    height: 70,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page.drawText(`Offertenummer: ${data.quoteId}`, {
    x: 60,
    y: y - 20,
    size: 10,
    font: boldFont,
  });
  
  page.drawText(`Datum: ${data.date.toLocaleDateString('nl-BE')}`, {
    x: 60,
    y: y - 35,
    size: 10,
    font,
  });
  
  page.drawText(`Geldig tot: ${data.validUntil.toLocaleDateString('nl-BE')}`, {
    x: 60,
    y: y - 50,
    size: 10,
    font,
  });
  
  y -= 90;
  
  // Customer info
  page.drawText('KLANTGEGEVENS', {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.4, 0.49, 0.92),
  });
  
  y -= 20;
  
  page.drawText(data.companyName, {
    x: 50,
    y,
    size: 11,
    font: boldFont,
  });
  
  y -= 15;
  
  page.drawText(`T.a.v. ${data.contactName}`, {
    x: 50,
    y,
    size: 10,
    font,
  });
  
  y -= 15;
  
  page.drawText(data.address, {
    x: 50,
    y,
    size: 10,
    font,
  });
  
  y -= 15;
  
  page.drawText(data.city, {
    x: 50,
    y,
    size: 10,
    font,
  });
  
  y -= 40;
  
  // Products table header
  page.drawText('PRODUCTEN', {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.4, 0.49, 0.92),
  });
  
  y -= 25;
  
  // Table header
  page.drawRectangle({
    x: 50,
    y: y - 15,
    width: width - 100,
    height: 20,
    color: rgb(0.95, 0.95, 0.95),
  });
  
  page.drawText('Product', {
    x: 60,
    y: y - 10,
    size: 10,
    font: boldFont,
  });
  
  page.drawText('Huidig', {
    x: 350,
    y: y - 10,
    size: 10,
    font: boldFont,
  });
  
  page.drawText('SmartSN', {
    x: 450,
    y: y - 10,
    size: 10,
    font: boldFont,
  });
  
  y -= 30;
  
  // Products
  for (const product of data.products) {
    page.drawText(`${product.type} - ${product.plan}`, {
      x: 60,
      y,
      size: 10,
      font: boldFont,
    });
    
    y -= 12;
    
    page.drawText(product.description, {
      x: 60,
      y,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    if (product.currentPrice) {
      page.drawText(`€${product.currentPrice.toFixed(2)}`, {
        x: 350,
        y,
        size: 10,
        font,
      });
    }
    
    page.drawText(`€${product.monthlyPrice.toFixed(2)}`, {
      x: 450,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.6, 0.2),
    });
    
    y -= 20;
  }
  
  // Total row
  page.drawLine({
    start: { x: 50, y: y + 5 },
    end: { x: width - 50, y: y + 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  y -= 20;
  
  page.drawText('Totaal per maand:', {
    x: 60,
    y,
    size: 11,
    font: boldFont,
  });
  
  if (data.currentTotal) {
    page.drawText(`€${data.currentTotal.toFixed(2)}`, {
      x: 350,
      y,
      size: 11,
      font,
      color: rgb(0.7, 0.7, 0.7),
    });
  }
  
  page.drawText(`€${data.totalMonthly.toFixed(2)}`, {
    x: 450,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.6, 0.2),
  });
  
  y -= 40;
  
  // Savings box
  if (data.savings6m > 0) {
    page.drawRectangle({
      x: 50,
      y: y - 50,
      width: width - 100,
      height: 60,
      color: rgb(0.9, 0.98, 0.9),
      borderColor: rgb(0.3, 0.7, 0.3),
      borderWidth: 1,
    });
    
    page.drawText('UW BESPARING', {
      x: 60,
      y: y - 20,
      size: 12,
      font: boldFont,
      color: rgb(0.2, 0.6, 0.2),
    });
    
    page.drawText(`In 6 maanden: €${data.savings6m.toFixed(2)}`, {
      x: 60,
      y: y - 35,
      size: 10,
      font,
    });
    
    page.drawText(`In 24 maanden: €${data.savings24m.toFixed(2)}`, {
      x: 250,
      y: y - 35,
      size: 10,
      font,
    });
    
    y -= 80;
  }
  
  // Notes
  if (data.notes) {
    page.drawText('Opmerkingen:', {
      x: 50,
      y,
      size: 10,
      font: boldFont,
    });
    
    y -= 15;
    
    const notes = data.notes.split('\n');
    for (const note of notes) {
      page.drawText(note, {
        x: 50,
        y,
        size: 9,
        font,
        maxWidth: width - 100,
      });
      y -= 12;
    }
    
    y -= 20;
  }
  
  // Footer
  page.drawLine({
    start: { x: 50, y: 100 },
    end: { x: width - 50, y: 100 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  page.drawText('Contact', {
    x: 50,
    y: 80,
    size: 10,
    font: boldFont,
    color: rgb(0.4, 0.49, 0.92),
  });
  
  page.drawText(data.consultantName, {
    x: 50,
    y: 65,
    size: 10,
    font,
  });
  
  page.drawText(data.consultantEmail, {
    x: 50,
    y: 52,
    size: 9,
    font,
  });
  
  page.drawText(data.consultantPhone, {
    x: 50,
    y: 40,
    size: 9,
    font,
  });
  
  page.drawText('Voorwaarden', {
    x: 250,
    y: 80,
    size: 10,
    font: boldFont,
    color: rgb(0.4, 0.49, 0.92),
  });
  
  page.drawText('Deze offerte is 30 dagen geldig en vrijblijvend.', {
    x: 250,
    y: 65,
    size: 9,
    font,
  });
  
  page.drawText('Prijzen zijn inclusief BTW.', {
    x: 250,
    y: 52,
    size: 9,
    font,
  });
  
  // Serialize PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Generate simple text-based quote (fallback)
 */
export function generateQuoteText(data: QuotePDFData): string {
  return `
SmartSN OFFERTE
===============

Offertenummer: ${data.quoteId}
Datum: ${data.date.toLocaleDateString('nl-BE')}
Geldig tot: ${data.validUntil.toLocaleDateString('nl-BE')}

KLANT
${data.companyName}
T.a.v. ${data.contactName}
${data.address}
${data.city}

PRODUCTEN
---------
${data.products.map(p => 
  `${p.type} - ${p.plan}: €${p.monthlyPrice.toFixed(2)}/maand`
).join('\n')}

TOTAAL: €${data.totalMonthly.toFixed(2)}/maand

BESPARING
6 maanden: €${data.savings6m.toFixed(2)}
24 maanden: €${data.savings24m.toFixed(2)}

CONTACT
${data.consultantName}
${data.consultantEmail}
${data.consultantPhone}

Deze offerte is 30 dagen geldig en vrijblijvend.
`.trim();
}
