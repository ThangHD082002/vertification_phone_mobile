import { NextRequest, NextResponse } from 'next/server';

function cleanPhoneNumber(phone?: string): string {
  return phone ? phone.replace(/[^0-9+]/g, '') : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = cleanPhoneNumber(body.phoneNumber);
    const now = new Date();

    if (phone.endsWith('0368682926') || phone.endsWith('26') || phone.endsWith('00')) {
      const timestamp = phone === '0368682926'
        ? '2026-10-25T14:27:08+07:00'
        : new Date(now.getTime() - 2 * 3600 * 1000).toISOString();
      return NextResponse.json({
        phoneNumber: phone,
        latestSimChange: timestamp,
        swapped: true,
      });
    }

    const stableTimestamp = new Date(now.getTime() - 400 * 24 * 3600 * 1000).toISOString();
    return NextResponse.json({
      phoneNumber: phone,
      latestSimChange: stableTimestamp,
      swapped: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Invalid request body' },
      { status: 400 }
    );
  }
}
