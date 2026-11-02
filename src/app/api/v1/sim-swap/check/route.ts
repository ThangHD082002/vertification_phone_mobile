import { NextRequest, NextResponse } from 'next/server';
import { checkSimSwapWithViettel, formatPhoneNumber } from '@/lib/viettelGateway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = body.phoneNumber || '';
    const maxAge = typeof body.maxAge === 'number' && body.maxAge > 0 ? body.maxAge : 520;

    if (!rawPhone) {
      return NextResponse.json(
        {
          swapped: false,
          error: 'Vui lòng cung cấp số điện thoại cần kiểm tra SIM Swap',
        },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(rawPhone);
    console.log(`[SIM Swap] Kiểm tra SIM Swap số: ${formattedPhone}, maxAge=${maxAge}h`);

    // Gọi trực tiếp Viettel Open Gateway qua Client Credentials Grant
    const result = await checkSimSwapWithViettel(formattedPhone, maxAge);

    return NextResponse.json({
      phoneNumber: formattedPhone,
      swapped: result.swapped,
      latestSimChange: result.latestSimChange,
      riskLevel: result.riskLevel,
      message: result.message,
      purpose: 'dpv:FraudPreventionAndDetection',
      raw: result.raw,
    });
  } catch (error: any) {
    console.error('[SIM Swap] Lỗi kiểm tra SIM Swap:', error);
    return NextResponse.json(
      {
        swapped: false,
        error: error?.message || 'Lỗi kiểm tra SIM Swap với Viettel Open Gateway',
      },
      { status: 400 }
    );
  }
}
