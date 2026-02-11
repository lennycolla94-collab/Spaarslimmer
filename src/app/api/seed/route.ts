import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User already exists',
        login: {
          email: 'test@test.com',
          password: 'testsmart2026!'
        }
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
        status: 'ACTIVE',
      },
    });

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
        ownerId: user.id,
        consentPhone: true,
        doNotCall: false,
        source: 'IMPORT'
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
        ownerId: user.id,
        consentPhone: true,
        doNotCall: false,
        source: 'IMPORT'
      },
    ];

    for (const lead of sampleLeads) {
      await prisma.lead.create({ data: lead });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully!',
      login: {
        email: 'test@test.com',
        password: 'testsmart2026!'
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Seed failed',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
