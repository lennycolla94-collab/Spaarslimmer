import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create test user
  const hashedPassword = await bcrypt.hash('testsmart2026!', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      password: hashedPassword,
      name: 'Test Consultant',
      role: 'BC',
      status: 'ACTIVE',
    },
  });

  console.log('Created test user:', testUser.email);

  // Create sample leads
  const sampleLeads = [
    {
      companyName: 'Tech Solutions BV',
      contactName: 'Jan Janssen',
      email: 'jan@tech.nl',
      phone: '+32 471 23 45 67',
      phoneHash: 'hash1',
      city: 'Antwerpen',
      province: 'Antwerpen',
      niche: 'Technologie',
      currentProvider: 'Proximus',
      status: 'NEW',
      ownerId: testUser.id,
      consentPhone: true,
      doNotCall: false,
    },
    {
      companyName: 'Bakkerij De Lekkernij',
      contactName: 'Maria Peeters',
      email: 'info@delekkernij.be',
      phone: '+32 485 67 89 01',
      phoneHash: 'hash2',
      city: 'Brussel',
      province: 'Brussel',
      niche: 'Horeca',
      currentProvider: 'Orange',
      status: 'CONTACTED',
      ownerId: testUser.id,
      consentPhone: true,
      doNotCall: false,
    },
    {
      companyName: 'Constructie Groep',
      contactName: 'Peter Willems',
      email: 'peter@constructie.be',
      phone: '+32 496 12 34 56',
      phoneHash: 'hash3',
      city: 'Gent',
      province: 'Oost-Vlaanderen',
      niche: 'Bouw',
      currentProvider: 'Telenet',
      status: 'QUOTED',
      ownerId: testUser.id,
      consentPhone: true,
      doNotCall: false,
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.upsert({
      where: { phoneHash: lead.phoneHash },
      update: {},
      create: lead,
    });
  }

  console.log('Created sample leads');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
