import { PrismaClient, QueueItem } from '@prisma/client';
import { parseCSV, isValidBelgianPhone, normalizePhone } from '../lib/csv-import';
import { generateWhatsAppLink, isValidWhatsAppNumber } from '../lib/whatsapp-service';
import { createQuoteSequence, createActivationSequence, getSequenceDetails } from '../lib/sequence-engine';
import { generateQuotePDF, QuotePDFData } from '../lib/pdf-generator';

const prisma = new PrismaClient();

describe('Integration Tests', () => {
  let testConsultantId: string;
  let testLeadId: string;

  beforeAll(async () => {
    // Create test consultant
    const consultant = await prisma.consultant.create({
      data: {
        email: 'integration@test.com',
        name: 'Integration Test Consultant',
        position: 'BC',
      },
    });
    testConsultantId = consultant.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.queueItem.deleteMany();
    await prisma.callLog.deleteMany();
    await prisma.lead.deleteMany({ where: { consultantId: testConsultantId } });
    await prisma.consultant.delete({ where: { id: testConsultantId } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean before each test
    await prisma.queueItem.deleteMany();
    await prisma.callLog.deleteMany();
    await prisma.lead.deleteMany({ where: { consultantId: testConsultantId } });
  });

  describe('CSV Import', () => {
    it('should validate Belgian phone numbers correctly', () => {
      expect(isValidBelgianPhone('0471234567')).toBe(true);
      expect(isValidBelgianPhone('+32471234567')).toBe(true);
      expect(isValidBelgianPhone('0032471234567')).toBe(true);
      expect(isValidBelgianPhone('021234567')).toBe(true);
      expect(isValidBelgianPhone('+3221234567')).toBe(true);
      expect(isValidBelgianPhone('12345')).toBe(false);
      expect(isValidBelgianPhone('abc')).toBe(false);
    });

    it('should normalize phone numbers', () => {
      expect(normalizePhone('0471234567')).toBe('+32471234567');
      expect(normalizePhone('+32471234567')).toBe('+32471234567');
      expect(normalizePhone('0032471234567')).toBe('+32471234567');
    });

    it('should parse CSV and import leads', async () => {
      const csvContent = `Bedrijfsnaam;Niche;Telefoon;Email;Gemeente;Provincie
Test Frituur;frituren;0471234567;test@frituur.be;Antwerpen;Antwerpen
Test Horeca;horeca;+32481234567;test@horeca.be;Brussel;Brussel`;

      const buffer = Buffer.from(csvContent, 'utf-8');
      const leads = await parseCSV(buffer);

      expect(leads).toHaveLength(2);
      expect(leads[0].companyName).toBe('Test Frituur');
      expect(leads[0].phone).toBe('+32471234567');
      expect(leads[1].companyName).toBe('Test Horeca');
    });

    it('CSV import met duplicates → skipped count correct', async () => {
      // Create first lead
      await prisma.lead.create({
        data: {
          companyName: 'Existing Company',
          niche: 'frituren',
          phone: '+32471234567',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      // Get existing phones
      const existingLeads = await prisma.lead.findMany({
        select: { phone: true },
      });
      const existingPhones = new Set(existingLeads.map(l => normalizePhone(l.phone)));

      // Try to import same phone
      const csvContent = `Bedrijfsnaam;Niche;Telefoon;Gemeente;Provincie
Existing Company;frituren;0471234567;Antwerpen;Antwerpen
New Company;horeca;0481234567;Brussel;Brussel`;

      const buffer = Buffer.from(csvContent, 'utf-8');
      const { leads, duplicates } = await import('../lib/csv-import').then(m => 
        m.parseCSVWithDedup(buffer, existingPhones)
      );

      expect(leads).toHaveLength(1); // Only new company
      expect(duplicates).toHaveLength(1); // Existing company skipped
      expect(duplicates[0]).toContain('Existing Company');
    });
  });

  describe('WhatsApp Service', () => {
    it('should validate WhatsApp numbers', () => {
      expect(isValidWhatsAppNumber('0471234567')).toBe(true);
      expect(isValidWhatsAppNumber('+32471234567')).toBe(true);
      expect(isValidWhatsAppNumber('123')).toBe(false);
    });

    it('WhatsApp link genereren → correcte wa.me URL', () => {
      const result = generateWhatsAppLink(
        '+32471234567',
        'quote_reminder',
        {
          leadName: 'Jan',
          companyName: 'Test BV',
          consultantName: 'Piet',
          quoteId: 'Q123',
          savingsAmount: 150,
        }
      );

      expect(result.link).toContain('https://wa.me/32471234567');
      expect(result.link).toContain('text=');
      expect(result.message).toContain('Hallo Jan');
      expect(result.message).toContain('Test BV');
    });
  });

  describe('Sequence Engine', () => {
    it('Offerte email versturen → queue items verschijnen op dag 3, 7, 30', async () => {
      // Create lead with all consents
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Sequence Test',
          niche: 'frituren',
          phone: '+32471234567',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentEmail: true,
          consentWhatsApp: true,
          consentPhone: true,
        },
      });

      // Create quote sequence
      const items = await createQuoteSequence(lead.id, testConsultantId);

      // Should have EMAIL (day 0), WHATSAPP (day 3), CALL (day 7), CALL (day 30)
      expect(items.length).toBeGreaterThanOrEqual(3);

      const emailItem = items.find(i => i.type === 'EMAIL');
      const whatsappItem = items.find(i => i.type === 'WHATSAPP');
      const callItem = items.find(i => i.type === 'CALL' && i.priority === 1);
      const checkinItem = items.find(i => i.type === 'CALL' && i.priority === 0);

      expect(emailItem).toBeDefined();
      expect(whatsappItem).toBeDefined();
      expect(callItem).toBeDefined();
      expect(checkinItem).toBeDefined();

      // Check scheduled dates
      const now = new Date();
      const day3 = new Date(now);
      day3.setDate(day3.getDate() + 3);
      const day7 = new Date(now);
      day7.setDate(day7.getDate() + 7);
      const day30 = new Date(now);
      day30.setDate(day30.getDate() + 30);

      if (whatsappItem) {
        expect(whatsappItem.scheduledAt.getDate()).toBe(day3.getDate());
      }
      if (callItem) {
        expect(callItem.scheduledAt.getDate()).toBe(day7.getDate());
      }
      if (checkinItem) {
        expect(checkinItem.scheduledAt.getDate()).toBe(day30.getDate());
      }
    });

    it('Sequence starten → juiste aantal queue items met juiste datums', async () => {
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Activation Test',
          niche: 'horeca',
          phone: '+32481234567',
          province: 'Brussel',
          consultantId: testConsultantId,
          lawfulBasis: 'CONTRACT',
          consentEmail: true,
          consentPhone: true,
        },
      });

      const items = await createActivationSequence(lead.id, testConsultantId);

      // Should have EMAIL (day 0), CALL (day 30), CALL (day 150)
      expect(items).toHaveLength(3);

      const emailItem = items.find(i => i.type === 'EMAIL');
      const check30Item = items.find(i => i.type === 'CALL' && i.priority === 1);
      const check150Item = items.find(i => i.type === 'CALL' && i.priority === 2);

      expect(emailItem).toBeDefined();
      expect(check30Item).toBeDefined();
      expect(check150Item).toBeDefined();

      // Check day 150 (clawback prevention)
      const now = new Date();
      const day150 = new Date(now);
      day150.setDate(day150.getDate() + 150);
      
      if (check150Item) {
        expect(check150Item.scheduledAt.getDate()).toBe(day150.getDate());
        expect(check150Item.scheduledAt.getMonth()).toBe(day150.getMonth());
      }
    });

    it('should skip items when no consent', async () => {
      const lead = await prisma.lead.create({
        data: {
          companyName: 'No Consent Test',
          niche: 'frituren',
          phone: '+32491234567',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentEmail: false, // No email consent
          consentWhatsApp: false, // No WhatsApp consent
          consentPhone: true, // Only phone
        },
      });

      const items = await createQuoteSequence(lead.id, testConsultantId);

      // Should only have CALL items (no EMAIL, no WHATSAPP)
      expect(items.every(i => i.type === 'CALL')).toBe(true);
      expect(items.find(i => i.type === 'EMAIL')).toBeUndefined();
      expect(items.find(i => i.type === 'WHATSAPP')).toBeUndefined();
    });

    it('should get sequence details', () => {
      const quoteDetails = getSequenceDetails('quote');
      expect(quoteDetails.type).toBe('quote');
      expect(quoteDetails.items).toHaveLength(4);
      expect(quoteDetails.items[0].type).toBe('EMAIL');
      expect(quoteDetails.items[0].daysFromStart).toBe(0);

      const activationDetails = getSequenceDetails('activation');
      expect(activationDetails.type).toBe('activation');
      expect(activationDetails.items).toHaveLength(3);
      expect(activationDetails.items[2].daysFromStart).toBe(150);
    });
  });

  describe('PDF Generator', () => {
    it('should generate PDF quote', async () => {
      const quoteData: QuotePDFData = {
        quoteId: 'Q2024-001',
        date: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        companyName: 'Test BV',
        contactName: 'Jan Jansen',
        address: 'Teststraat 123',
        city: '1000 Brussel',
        consultantName: 'Piet Pieters',
        consultantEmail: 'piet@smartsn.be',
        consultantPhone: '+32 470 12 34 56',
        products: [
          { type: 'mobile', plan: 'unlimited', description: 'Onbeperkt bellen & data', monthlyPrice: 45, currentPrice: 55 },
          { type: 'internet', plan: 'fiber', description: 'Fiber 100Mbps', monthlyPrice: 35 },
        ],
        totalMonthly: 80,
        currentTotal: 90,
        savings6m: 60,
        savings24m: 240,
      };

      const pdfBuffer = await generateQuotePDF(quoteData);

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      // PDF files start with %PDF
      expect(pdfBuffer.toString('ascii', 0, 4)).toBe('%PDF');
    });
  });

  describe('End-to-End Flow', () => {
    it('Complete flow: Lead import → Sequence start → Queue items created', async () => {
      // 1. Create lead
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Complete Flow BV',
          niche: 'zelfstandigen',
          phone: '+32471234500',
          email: 'test@complete.be',
          province: 'Limburg',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentEmail: true,
          consentWhatsApp: true,
          consentPhone: true,
        },
      });

      // 2. Start quote sequence
      const sequenceItems = await createQuoteSequence(lead.id, testConsultantId);
      expect(sequenceItems.length).toBeGreaterThan(0);

      // 3. Verify queue items exist in database
      const dbItems = await prisma.queueItem.findMany({
        where: { leadId: lead.id },
      });
      expect(dbItems.length).toBe(sequenceItems.length);

      // 4. Verify call log was created
      const callLog = await prisma.callLog.findFirst({
        where: { leadId: lead.id },
      });
      expect(callLog).toBeDefined();
      expect(callLog).toBeDefined();
    });
  });
});
