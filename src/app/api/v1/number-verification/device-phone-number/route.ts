import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      phoneNumber: '+84368682926',
      operator: 'Viettel',
      verified: true,
      code: body?.code,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Invalid request' },
      { status: 400 }
    );
  }
}
