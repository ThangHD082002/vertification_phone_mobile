import { NextRequest, NextResponse } from 'next/server';

function cleanPhoneNumber(phone?: string): string {
  return phone ? phone.replace(/[^0-9+]/g, '') : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = cleanPhoneNumber(body.phoneNumber);
    const code = body.code || '';

    // Kịch bản kiểm thử khớp với bản Java Spring Boot:
    // 1. Số có đuôi '1112222' hoặc '88' hoặc code chứa 'fail' -> Giả lập không khớp (Mismatch)
    // 2. Các số hợp lệ còn lại (0987654321, 0368682926...) -> Giả lập khớp thành công (Verified)
    const isMismatch =
      phone.endsWith('1112222') ||
      phone.endsWith('88') ||
      code.toLowerCase().includes('fail');

    const verified = !isMismatch;
    const nowIso = new Date().toISOString();

    const response = {
      devicePhoneNumberVerified: verified,
      match: verified,
      message: verified
        ? 'Xác thực số điện thoại thuê bao thành công qua mạng di động Viettel'
        : 'Số điện thoại không khớp với thông tin SIM trên thiết bị (Mismatch)',
      operator: 'Viettel',
      verifiedAt: nowIso,
    };

    const status = verified ? 200 : 400;
    return NextResponse.json(response, { status });
  } catch (error: any) {
    return NextResponse.json(
      {
        devicePhoneNumberVerified: false,
        match: false,
        message: error?.message || 'Invalid request body',
      },
      { status: 400 }
    );
  }
}
