import { NextRequest, NextResponse } from 'next/server';
import { generateQuote, QuoteWizardInput } from '@/lib/quote-wizard';
import { CONSULTANT_RANK } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.currentMonthlyCost) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName and currentMonthlyCost' },
        { status: 400 }
      );
    }

    // Map the input to the expected format
    const input: QuoteWizardInput = {
      consultantRank: body.consultantRank || 'BC',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      currentMonthlyCost: body.currentMonthlyCost,
      currentProvider: body.currentProvider,
      products: {
        internet: body.products?.internet,
        mobile: body.products?.mobile || [],
        tv: body.products?.tv || null,
        energie: body.products?.energie,
      },
      hasMyComfort: body.hasMyComfort || false,
      wifiBoosters: body.wifiBoosters || 0,
      hasVasteLijn: body.hasVasteLijn || false,
      extraDecoders: body.extraDecoders || 0,
    };

    // Generate the quote
    const quote = generateQuote(input);

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote', details: (error as Error).message },
      { status: 500 }
    );
  }
}
