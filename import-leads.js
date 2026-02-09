const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPhone(phone) {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Leads uit de screenshot
const leads = [
  { companyName: 'Groenmacht', niche: 'Tuin', phone: '0492 22 19 10', city: 'Genk', postalCode: '3600', address: 'Wiekstraat 31', provider: 'Orange' },
  { companyName: 'Sweethomegarden', niche: 'Interior Decorator', phone: '0484 05 32 53', city: 'Genk', postalCode: '3600', address: 'Hasseltweg 156', provider: 'BASE/Telenet' },
  { companyName: 'Ntertainment Danceschool', niche: 'Dansschool', phone: '0472 63 92 21', city: 'Genk', postalCode: '3600', address: 'Emiel Van Dorenlaan 144', provider: 'Proximus' },
  { companyName: 'CK Dance Studio', niche: 'Dansschool', phone: '0491 52 73 84', city: 'Genk', postalCode: '3600', address: 'Lucien Londotstraat 3', provider: 'Orange' },
  { companyName: 'Bounce vzw', niche: 'Dansschool', phone: '0474 33 98 19', city: 'Genk', postalCode: '3600', address: 'Nieuwe Kempen 55', provider: 'Proximus' },
  { companyName: 'Balletschool Capriccio', niche: 'Dansschool', phone: '0471 09 08 35', city: 'Genk', postalCode: '3600', address: 'Maastrichterweg 112', provider: 'Proximus' },
  { companyName: 'Dansstudio Art Mania', niche: 'Dansschool', phone: '0498 36 18 61', city: 'Genk', postalCode: '3600', address: 'Sledderloweg 98', provider: 'Orange' },
  { companyName: 'Luna Bellydance', niche: 'Dansschool', phone: '0471 73 48 09', city: 'Genk', postalCode: '3600', address: 'Bemdekennsstraat 11', provider: 'Proximus' },
  { companyName: 'Dans school Dance Of C', niche: 'Dansschool', phone: '0479 29 86 23', city: 'Genk', postalCode: '3600', address: 'Noordlaan 111', provider: 'Proximus' },
  { companyName: 'Dansschool La Vida Mejor', niche: 'Dansschool', phone: '0472 83 04 13', city: 'Genk', postalCode: '3600', address: 'Boxbergstraat 65', provider: 'Proximus' },
];

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'test@test.com' }
  });

  if (!user) {
    console.log('Test user not found. Run create-test-user.js first.');
    return;
  }

  console.log(`Importing ${leads.length} leads for user ${user.email}...`);

  for (const lead of leads) {
    const cleanPhone = lead.phone.replace(/\s/g, '');
    const phoneHash = hashPhone(cleanPhone);
    
    await prisma.lead.create({
      data: {
        companyName: lead.companyName,
        email: '',
        phone: cleanPhone,
        phoneHash,
        address: lead.address,
        city: lead.city,
        postalCode: lead.postalCode,
        province: 'Limburg',
        niche: lead.niche,
        currentProvider: lead.provider.replace('*', ''),
        status: 'NEW',
        ownerId: user.id,
        consentPhone: true,
        doNotCall: false,
        source: 'IMPORT',
      }
    });
  }

  console.log(`✅ Successfully imported ${leads.length} leads!`);
  console.log('\nTest the call-center at: http://localhost:3000/call-center');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
