/**
 * CALCULATOR API - POST /api/calculate
 * Location: src/app/api/calculate/route.ts (of src/features/calculator/api/route.ts)
 * 
 * Accepteert: CalculatorInput JSON
 * Retourneert: CalculatorResult JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateRetail, CalculatorInput } from '@/features/calculator';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' }, 
        { status: 401 }
      );
    }

    // Parse input
    const body = await req.json();
    
    // Validatie van verplichte velden
    if (!body.productType || !body.productId) {
      return NextResponse.json(
        { error: 'Product type en ID zijn verplicht' }, 
        { status: 400 }
      );
    }

    // Construct input
    const input: CalculatorInput = {
      productType: body.productType,
      productId: body.productId,
      consultantId: session.user.id,
      upline: body.upline || [], // Array van {userId, level}
      options: {
        isNewCustomer: body.options?.isNewCustomer ?? true,
        isPortability: body.options?.isPortability ?? false,
        isConvergence: body.options?.isConvergence ?? false,
        isSoHo: body.options?.isSoHo ?? false,
        hasEBilling: body.options?.hasEBilling ?? false,
        hasDomiciliering: body.options?.hasDomiciliering ?? false,
        monthsActive: body.options?.monthsActive ?? 0,
      },
      validation: {
        isInternalMigration: body.validation?.isInternalMigration ?? false,
        isWithin3Months: body.validation?.isWithin3Months ?? false,
        hasActiveService: body.validation?.hasActiveService ?? true,
      },
    };

    // Calculate!
    const result = calculateRetail(input);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Calculate API Error:', error);
    return NextResponse.json(
      { 
        error: 'Interne server fout', 
        details: error instanceof Error ? error.message : 'Onbekend' 
      }, 
      { status: 500 }
    );
  }
}

// Optioneel: GET voor voorbeeld payload
export async function GET() {
  return NextResponse.json({
    message: 'Calculator API',
    examplePayload: {
      productType: 'MOBILE',
      productId: 'ORANGE_MEDIUM',
      options: {
        isPortability: true,
        isNewCustomer: true,
      },
      validation: {
        isInternalMigration: false,
        isWithin3Months: false,
        hasActiveService: true,
      },
      upline: [
        { userId: 'upline-1', level: 1 },
        { userId: 'upline-2', level: 2 }
      ]
    }
  });
}
