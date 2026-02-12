import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Test database connection
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('DB Connection test:', testConnection);

    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });

    if (existingUser) {
      // Reset password
      const hashedPassword = await bcrypt.hash('testsmart2026!', 10);
      await prisma.user.update({
        where: { email: 'test@test.com' },
        data: { 
          password: hashedPassword,
          status: 'ACTIVE'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'User password reset!',
        login: { email: 'test@test.com', password: 'testsmart2026!' }
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('testsmart2026!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test Consultant',
        role: 'BC',
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test user created!',
      userId: user.id,
      login: { email: 'test@test.com', password: 'testsmart2026!' }
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        error: 'Seed failed', 
        details: error.message,
        code: error.code,
        meta: error.meta
      },
      { status: 500 }
    );
  }
}
