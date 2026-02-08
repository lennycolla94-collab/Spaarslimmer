import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

const products = [
  // Mobile
  { type: 'mobile', plan: 'child', bcRetail: 1, scRetail: 5, aspPoints: 0, fidelityMonthly: 0.25, hasPortability: false, hasConvergence: false, hasSoHo: false },
  { type: 'mobile', plan: 'small', bcRetail: 10, scRetail: 15, aspPoints: 1, fidelityMonthly: 0.50, hasPortability: false, hasConvergence: false, hasSoHo: false },
  { type: 'mobile', plan: 'medium', bcRetail: 35, scRetail: 40, aspPoints: 1, fidelityMonthly: 1.00, hasPortability: true, hasConvergence: true, hasSoHo: true },
  { type: 'mobile', plan: 'large', bcRetail: 50, scRetail: 55, aspPoints: 1, fidelityMonthly: 1.25, hasPortability: true, hasConvergence: true, hasSoHo: true },
  { type: 'mobile', plan: 'unlimited', bcRetail: 60, scRetail: 65, aspPoints: 1, fidelityMonthly: 1.50, hasPortability: true, hasConvergence: true, hasSoHo: true },
  // Internet
  { type: 'internet', plan: 'default', bcRetail: 15, scRetail: 20, aspPoints: 1, fidelityMonthly: 0.35, hasPortability: true, hasConvergence: true, hasSoHo: false },
  // Energie
  { type: 'energie', plan: 'residentieel', bcRetail: 20, scRetail: 25, aspPoints: 0.5, fidelityMonthly: 0.35, hasPortability: false, hasConvergence: false, hasSoHo: false },
  { type: 'energie', plan: 'soho', bcRetail: 40, scRetail: 45, aspPoints: 1, fidelityMonthly: 0.35, hasPortability: false, hasConvergence: false, hasSoHo: true },
  // Ketel
  { type: 'ketel', plan: 'default', bcRetail: 20, scRetail: 25, aspPoints: 0.5, fidelityMonthly: 0, hasPortability: false, hasConvergence: false, hasSoHo: false },
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.serviceConfig.deleteMany();

  // Insert products
  for (const product of products) {
    await prisma.serviceConfig.create({
      data: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
