import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Run Prisma migrate deploy
    const result = execSync('npx prisma migrate deploy', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      output: result
    });
  } catch (error) {
    // If migration fails, try to create the database
    try {
      const pushResult = execSync('npx prisma db push --accept-data-loss', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      return NextResponse.json({
        success: true,
        message: 'Database pushed (schema created)',
        output: pushResult
      });
    } catch (pushError: any) {
      return NextResponse.json({
        success: false,
        error: 'Migration failed',
        details: pushError.message || 'Unknown error'
      }, { status: 500 });
    }
  }
}
