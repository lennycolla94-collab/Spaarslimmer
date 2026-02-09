const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('testsmart2026!', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      password: hashedPassword,
      name: 'Test Consultant',
      role: 'CONSULTANT',
      status: 'ACTIVE',
    },
  });
  
  console.log('Test user created:', user.email);
  console.log('Password: testsmart2026!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
