import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// This endpoint fixes the database column names to match the Prisma schema
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Temporarily allow any authenticated user to fix the database
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: string[] = [];

    // Helper function to check if column exists
    const columnExists = async (columnName: string): Promise<boolean> => {
      try {
        const result: any = await prisma.$queryRaw`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'Lead' AND column_name = ${columnName}
        `;
        return result && result.length > 0;
      } catch {
        return false;
      }
    };

    // Add contactname column if it doesn't exist
    const hasContactName = await columnExists('contactname');
    if (!hasContactName) {
      try {
        await prisma.$executeRaw`ALTER TABLE "Lead" ADD COLUMN "contactname" TEXT`;
        results.push('Added contactname column');
      } catch (e: any) {
        results.push(`contactname: ${e.message}`);
      }
    } else {
      results.push('contactname already exists');
    }

    // Check other potentially missing columns
    const columnsToCheck = [
      'ean', 'address', 'niche', 'postalcode', 'currentprovider', 
      'currentsupplier', 'consentemail', 'consentwhatsapp', 
      'lawfulbasis', 'gdpracceptancedate', 'privacypolicyversion', 'source'
    ];

    for (const col of columnsToCheck) {
      const exists = await columnExists(col);
      if (!exists) {
        try {
          // Add column with appropriate type
          let dataType = 'TEXT';
          if (col === 'consentemail' || col === 'consentwhatsapp') {
            dataType = 'BOOLEAN DEFAULT false';
          }
          await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "${col}" ${dataType}`);
          results.push(`Added ${col} column`);
        } catch (e: any) {
          results.push(`${col}: ${e.message}`);
        }
      } else {
        results.push(`${col} already exists`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database check completed',
      results
    });

  } catch (error: any) {
    console.error('Database fix error:', error);
    return NextResponse.json({ 
      error: 'Failed to fix database', 
      details: error.message 
    }, { status: 500 });
  }
}

// GET method to check current status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all columns in Lead table
    const columns: any = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Lead'
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      columns: columns.map((c: any) => c.column_name)
    });

  } catch (error: any) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check database', 
      details: error.message 
    }, { status: 500 });
  }
}
