import { NextRequest, NextResponse } from 'next/server';

function cleanPhoneNumber(phone?: string): string {
  return phone ? phone.replace(/[^0-9+]/g, '') : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = cleanPhoneNumber(body.phoneNumber);
    const maxAge = typeof body.maxAge === 'number' && body.maxAge > 0 ? body.maxAge : 48;

    const now = new Date();

    // Kịch bản mô phỏng tương thích với Mobile test cases và bản Java:
    // 1. Số '0368682926' hoặc đuôi '26', '00' -> SIM vừa đổi 2 giờ trước (Recent Swap)
    if (phone.endsWith('0368682926') || phone.endsWith('26') || phone.endsWith('00')) {
      const timestamp = phone === '0368682926'
        ? '2026-10-25T14:27:08+07:00'
        : new Date(now.getTime() - 2 * 3600 * 1000).toISOString();

      if (maxAge >= 2) {
        return NextResponse.json({
          swapped: true,
          latestSimChange: timestamp,
          riskLevel: 'CRITICAL',
          message: 'Phát hiện SIM vừa bị thay đổi gần đây! Kích hoạt thẩm định sinh trắc học eKYC.',
          purpose: 'dpv:FraudPreventionAndDetection',
        });
      }
    }

    // 2. Số đuôi '6666' hoặc '55' -> Đổi 50 giờ trước (Older Swap)
    if (phone.endsWith('6666') || phone.endsWith('55')) {
      const timestamp = new Date(now.getTime() - 50 * 3600 * 1000).toISOString();
      const swapped = maxAge >= 50;
      return NextResponse.json({
        swapped,
        latestSimChange: swapped ? timestamp : undefined,
        riskLevel: swapped ? 'HIGH' : 'SAFE',
        message: swapped
          ? 'SIM đổi 50 giờ trước, nằm trong cửa sổ kiểm tra'
          : 'SIM an toàn, đổi 50 giờ trước (ngoài mốc quét)',
        purpose: 'dpv:FraudPreventionAndDetection',
      });
    }

    // 3. Số SIM an toàn bình thường (> 1 năm không đổi)
    return NextResponse.json({
      swapped: false,
      latestSimChange: undefined,
      riskLevel: 'SAFE',
      message: 'SIM hoạt động ổn định, không có lịch sử đổi SIM trong khoảng thời gian kiểm tra',
      purpose: 'dpv:FraudPreventionAndDetection',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        swapped: false,
        error: error?.message || 'Invalid request body',
      },
      { status: 400 }
    );
  }
}

