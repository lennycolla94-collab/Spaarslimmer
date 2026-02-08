import { PrismaClient } from '@prisma/client';
import { getNextLead, canCallLead, wasCalledRecently } from '../lib/queue-service';
import { checkConsent, checkDoNotCall, canContact } from '../middleware/gdpr';

const prisma = new PrismaClient();

describe('API Integration Tests', () => {
  let testConsultantId: string;
  let testLeadId: string;

  beforeAll(async () => {
    // Create test consultant
    const consultant = await prisma.consultant.create({
      data: {
        email: 'test@example.com',
        name: 'Test Consultant',
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
    // Clean leads before each test
    await prisma.queueItem.deleteMany();
    await prisma.callLog.deleteMany();
    await prisma.lead.deleteMany({ where: { consultantId: testConsultantId } });
  });

  describe('Lead Management', () => {
    it('should create a lead', async () => {
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Test Company',
          niche: 'frituren',
          phone: '+32123456789',
          email: 'test@company.com',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      expect(lead).toBeDefined();
      expect(lead.companyName).toBe('Test Company');
      expect(lead.phone).toBe('+32123456789');
      testLeadId = lead.id;
    });

    it('should prevent duplicate phone numbers', async () => {
      const phone = '+32123456788';
      
      // Create first lead
      await prisma.lead.create({
        data: {
          companyName: 'First Company',
          niche: 'frituren',
          phone,
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      // Try to create second lead with same phone
      await expect(
        prisma.lead.create({
          data: {
            companyName: 'Second Company',
            niche: 'horeca',
            phone,
            province: 'Brussel',
            consultantId: testConsultantId,
            lawfulBasis: 'LEGITIMATE_INTEREST',
            consentPhone: true,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Call Logging', () => {
    it('Lead aanmaken → Call loggen → Queue item verschijnt', async () => {
      // Create lead
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Callback Test Company',
          niche: 'frituren',
          phone: '+32123456787',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      // Log a call with callback requested
      const callLog = await prisma.callLog.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          result: 'callback_requested',
          notes: 'Customer requested callback tomorrow',
        },
      });

      expect(callLog).toBeDefined();
      expect(callLog.result).toBe('callback_requested');

      // Create queue item for callback
      const queueItem = await prisma.queueItem.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          type: 'CALLBACK',
          status: 'pending',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 1,
        },
      });

      expect(queueItem).toBeDefined();
      expect(queueItem.type).toBe('CALLBACK');
      expect(queueItem.status).toBe('pending');
    });

    it('should create follow-up queue item for no_answer', async () => {
      const lead = await prisma.lead.create({
        data: {
          companyName: 'No Answer Test',
          niche: 'frituren',
          phone: '+32123456786',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      // Log no answer call
      await prisma.callLog.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          result: 'no_answer',
          notes: 'No answer, will retry',
        },
      });

      // Create follow-up queue item
      const queueItem = await prisma.queueItem.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          type: 'CALL',
          status: 'pending',
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
          priority: 0,
        },
      });

      expect(queueItem.type).toBe('CALL');
    });
  });

  describe('Queue Service', () => {
    it('Lead met doNotCall=true wordt niet getoond in queue', async () => {
      // Create lead with doNotCall
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Do Not Call Company',
          niche: 'frituren',
          phone: '+32123456785',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
          doNotCall: true,
        },
      });

      // Create queue item
      await prisma.queueItem.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          type: 'CALL',
          status: 'pending',
          scheduledAt: new Date(),
          priority: 0,
        },
      });

      // Try to get next lead
      const result = await getNextLead(testConsultantId);
      
      // Should be null because lead has doNotCall=true
      expect(result).toBeNull();
    });

    it('Lead zonder consentPhone kan niet gebeld worden', async () => {
      // Create lead without phone consent
      const lead = await prisma.lead.create({
        data: {
          companyName: 'No Phone Consent',
          niche: 'frituren',
          phone: '+32123456784',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: false, // No phone consent
        },
      });

      // Check canCallLead
      const canCall = canCallLead(lead);
      expect(canCall.allowed).toBe(false);
      expect(canCall.reason).toContain('consent');

      // Create queue item
      await prisma.queueItem.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          type: 'CALL',
          status: 'pending',
          scheduledAt: new Date(),
          priority: 0,
        },
      });

      // Try to get next lead
      const result = await getNextLead(testConsultantId);
      
      // Should be null because lead has no phone consent
      expect(result).toBeNull();
    });

    it('should skip leads called < 2 hours ago', async () => {
      // Create lead
      const lead = await prisma.lead.create({
        data: {
          companyName: 'Recently Called',
          niche: 'frituren',
          phone: '+32123456783',
          province: 'Antwerpen',
          consultantId: testConsultantId,
          lawfulBasis: 'LEGITIMATE_INTEREST',
          consentPhone: true,
        },
      });

      // Create a recent call log (1 hour ago)
      await prisma.callLog.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          result: 'no_answer',
          createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        },
      });

      // Create queue item
      await prisma.queueItem.create({
        data: {
          leadId: lead.id,
          consultantId: testConsultantId,
          type: 'CALL',
          status: 'pending',
          scheduledAt: new Date(),
          priority: 0,
        },
      });

      // Check wasCalledRecently
      const wasRecent = await wasCalledRecently(lead.id);
      expect(wasRecent).toBe(true);

      // Try to get next lead
      const result = await getNextLead(testConsultantId);
      
      // Should be null because lead was called < 2 hours ago
      expect(result).toBeNull();
    });
  });

  describe('GDPR Middleware', () => {
    it('should check consent correctly', () => {
      const lead = {
        consentEmail: true,
        consentWhatsApp: false,
        consentPhone: true,
      } as any;

      expect(checkConsent(lead, 'email')).toBe(true);
      expect(checkConsent(lead, 'whatsapp')).toBe(false);
      expect(checkConsent(lead, 'phone')).toBe(true);
    });

    it('should check doNotCall correctly', () => {
      const leadWithDNC = { doNotCall: true } as any;
      const leadWithoutDNC = { doNotCall: false } as any;

      expect(checkDoNotCall(leadWithDNC)).toBe(true);
      expect(checkDoNotCall(leadWithoutDNC)).toBe(false);
    });

    it('should determine if contact is allowed', () => {
      const lead = {
        doNotCall: false,
        consentEmail: true,
        consentWhatsApp: false,
        consentPhone: true,
        lawfulBasis: 'LEGITIMATE_INTEREST',
      } as any;

      expect(canContact(lead, 'email').allowed).toBe(true);
      expect(canContact(lead, 'whatsapp').allowed).toBe(false);
      expect(canContact(lead, 'phone').allowed).toBe(true);

      // Test with doNotCall
      const leadDNC = { ...lead, doNotCall: true };
      expect(canContact(leadDNC, 'phone').allowed).toBe(false);
    });
  });
});
