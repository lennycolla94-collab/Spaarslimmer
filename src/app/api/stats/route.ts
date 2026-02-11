import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's calls
    const calls = await prisma.callLog.findMany({
      where: {
        consultantId: userId,
        calledAt: {
          gte: today
        }
      },
      select: {
        result: true,
        duration: true
      }
    });

    const stats = {
      totalCalls: calls.length,
      totalDuration: 0,
      averageDuration: 0,
      results: {} as Record<string, number>,
      conversionRate: 0
    };

    let conversions = 0;

    for (const call of calls) {
      stats.totalDuration += call.duration || 0;
      stats.results[call.result] = (stats.results[call.result] || 0) + 1;
      
      if (call.result === 'APPOINTMENT_MADE' || call.result === 'QUOTE_SENT') {
        conversions++;
      }
    }

    if (calls.length > 0) {
      stats.averageDuration = Math.round(stats.totalDuration / calls.length);
      stats.conversionRate = Math.round((conversions / calls.length) * 100);
    }

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      totalCalls: 0,
      totalDuration: 0,
      averageDuration: 0,
      results: {},
      conversionRate: 0
    });
  }
}
