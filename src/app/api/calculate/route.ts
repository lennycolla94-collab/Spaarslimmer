import { NextRequest, NextResponse } from 'next/server';
import { calculateCompleteDeal } from '@/lib/calculator';
import { PRODUCT_TYPE, CONSULTANT_RANK } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { services, rank } = body;
    
    if (!services || !rank) {
      return NextResponse.json(
        { error: 'Services and rank are required' },
        { status: 400 }
      );
    }

    const result = calculateCompleteDeal(
      services.map((s: any) => ({
        productType: s.productType as PRODUCT_TYPE,
        options: s.options || {}
      })),
      rank as CONSULTANT_RANK
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculate error:', error);
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    );
  }
}
