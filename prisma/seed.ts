import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper om phone hash te genereren
const hashPhone = (phone: string): string => {
  return crypto.createHash('sha256').update(phone.toLowerCase().trim()).digest('hex');
};

async function main() {
  console.log('🌱 Start seeding...\n');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.service.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.queueItem.deleteMany();
  await prisma.callLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Cleaned existing data\n');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartsn.be',
      password: adminPassword,
      name: 'Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created admin:', admin.email);

  // Create test consultant (PMC for max commissions)
  const consultantPassword = await bcrypt.hash('demo123', 10);
  const consultant = await prisma.user.create({
    data: {
      email: 'consultant@smartsn.be',
      password: consultantPassword,
      name: 'Demo Consultant',
      role: 'PMC',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created consultant:', consultant.email);

  // Create sponsor (for MLM hierarchy demo)
  const sponsorPassword = await bcrypt.hash('sponsor123', 10);
  const sponsor = await prisma.user.create({
    data: {
      email: 'sponsor@smartsn.be',
      password: sponsorPassword,
      name: 'Sponsor User',
      role: 'MC',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created sponsor:', sponsor.email);

  // Create downline consultant
  const downlinePassword = await bcrypt.hash('downline123', 10);
  const downline = await prisma.user.create({
    data: {
      email: 'downline@smartsn.be',
      password: downlinePassword,
      name: 'Downline Consultant',
      role: 'SC',
      status: 'ACTIVE',
      sponsorId: sponsor.id,
    },
  });
  console.log('✅ Created downline:', downline.email);

  // Create sample leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        phone: '+32471234567',
        phoneHash: hashPhone('+32471234567'),
        email: 'frituur@example.be',
        companyName: 'Frituur De Gouden Friet',
        niche: 'frituren',
        address: 'Hoofdstraat 123',
        city: 'Antwerpen',
        province: 'Antwerpen',
        postalCode: '2000',
        currentProvider: 'Telenet',
        currentSupplier: 'Engie',
        consentEmail: true,
        consentPhone: true,
        consentWhatsapp: true,
        lawfulBasis: 'LEGITIMATE_INTEREST',
        ownerId: consultant.id,
        status: 'NEW',
        source: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        phone: '+32481234567',
        phoneHash: hashPhone('+32481234567'),
        email: 'horeca@example.be',
        companyName: 'Brasserie Het Centrum',
        niche: 'horeca',
        address: 'Grote Markt 1',
        city: 'Brussel',
        province: 'Brussel',
        postalCode: '1000',
        currentProvider: 'Orange',
        currentSupplier: 'Luminus',
        consentEmail: true,
        consentPhone: true,
        consentWhatsapp: false,
        lawfulBasis: 'CONSENT',
        ownerId: consultant.id,
        status: 'CONTACTED',
        source: 'seed',
      },
    }),
    prisma.lead.create({
      data: {
        phone: '+32491234567',
        phoneHash: hashPhone('+32491234567'),
        companyName: 'Janssens BV',
        niche: 'zelfstandigen',
        address: 'Industrielaan 45',
        city: 'Gent',
        province: 'Oost-Vlaanderen',
        postalCode: '9000',
        currentProvider: 'Proximus',
        consentEmail: false,
        consentPhone: true,
        consentWhatsapp: false,
        lawfulBasis: 'LEGITIMATE_INTEREST',
        ownerId: sponsor.id,
        status: 'QUOTED',
        source: 'seed',
      },
    }),
  ]);
  console.log(`✅ Created ${leads.length} leads`);

  // Create sample sales with commissions
  const sale1 = await prisma.sale.create({
    data: {
      leadId: leads[1].id,
      consultantId: consultant.id,
      totalRetail: 120.00,
      totalASP: 95.00,
      commissionAmount: 150.00,
      status: 'ACTIVE',
      activationDate: new Date(),
      isNewCustomer: true,
      hasPortability: true,
      hasConvergence: true,
      services: {
        create: [
          {
            type: 'MOBILE',
            plan: 'unlimited',
            retailValue: 60.00,
            aspValue: 45.00,
          },
          {
            type: 'INTERNET',
            plan: 'fiber',
            retailValue: 60.00,
            aspValue: 50.00,
          },
        ],
      },
    },
  });
  console.log('✅ Created sale:', sale1.id);

  // Create commission record
  const commission = await prisma.commission.create({
    data: {
      consultantId: consultant.id,
      saleId: sale1.id,
      amount: 150.00,
      type: 'PERSONAL_SALE',
      status: 'CONFIRMED',
    },
  });
  console.log('✅ Created commission:', commission.id);

  // Create queue items
  const queueItems = await Promise.all([
    prisma.queueItem.create({
      data: {
        leadId: leads[0].id,
        assignedTo: consultant.id,
        priority: 1,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'PENDING',
        type: 'CALL',
      },
    }),
    prisma.queueItem.create({
      data: {
        leadId: leads[1].id,
        assignedTo: consultant.id,
        priority: 2,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        type: 'FOLLOW_UP',
      },
    }),
  ]);
  console.log(`✅ Created ${queueItems.length} queue items`);

  // Create call logs
  await prisma.callLog.create({
    data: {
      leadId: leads[1].id,
      consultantId: consultant.id,
      result: 'CONVERSATION',
      notes: 'Lead is geïnteresseerd in offerte',
      duration: 300,
    },
  });
  console.log('✅ Created call log');

  console.log('\n🎉 Seeding completed!');
  console.log('\n📧 Login credentials:');
  console.log('  Admin:      admin@smartsn.be / admin123');
  console.log('  Consultant: consultant@smartsn.be / demo123');
  console.log('  Sponsor:    sponsor@smartsn.be / sponsor123');
  console.log('  Downline:   downline@smartsn.be / downline123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
