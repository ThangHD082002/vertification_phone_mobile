import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForToken,
  verifyPhoneNumberWithViettel,
  formatPhoneNumber,
} from '@/lib/viettelGateway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPhone = body.phoneNumber || '';
    const code = body.code || '';
    const customRedirectUri = body.redirectUri;

    const origin = request.nextUrl.origin;
    const redirectUri = customRedirectUri || `${origin}/telco-callback`;

    if (!rawPhone) {
      return NextResponse.json(
        {
          devicePhoneNumberVerified: false,
          match: false,
          message: 'Vui lòng cung cấp số điện thoại cần xác minh',
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          devicePhoneNumberVerified: false,
          match: false,
          message: 'Yêu cầu mã code xác thực từ luồng ủy quyền Viettel 4G/5G (/authorize)',
        },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(rawPhone);

    // Bước 1: Đổi authorization_code lấy access_token thật từ Viettel
    console.log(`[Verify] Đang đổi code lấy token: code=${code.substring(0, 10)}..., redirectUri=${redirectUri}`);
    const tokenData = await exchangeCodeForToken(code, redirectUri);
    const accessToken = tokenData.access_token;
    console.log(`[Verify] Đã nhận access_token: ${accessToken.substring(0, 25)}...`);

    // Bước 2: Gọi API đối soát số điện thoại thật với mạng Viettel
    console.log(`[Verify] Đang đối soát SĐT: ${formattedPhone}`);
    const verifyResult = await verifyPhoneNumberWithViettel(accessToken, formattedPhone);

    const verified = verifyResult.devicePhoneNumberVerified;
    const nowIso = new Date().toISOString();

    const response = {
      devicePhoneNumberVerified: verified,
      match: verified,
      phoneNumber: formattedPhone,
      message: verified
        ? 'Xác thực số điện thoại thuê bao thành công qua mạng di động Viettel 4G/5G'
        : 'Số điện thoại không khớp với thông tin SIM trên thiết bị (Mismatch)',
      operator: 'Viettel',
      verifiedAt: nowIso,
      raw: verifyResult.raw,
    };

    return NextResponse.json(response, { status: verified ? 200 : 400 });
  } catch (error: any) {
    console.error('[Verify] Lỗi xác thực Viettel:', error);
    return NextResponse.json(
      {
        devicePhoneNumberVerified: false,
        match: false,
        message: error?.message || 'Lỗi kết nối tới cổng Viettel Open Gateway',
      },
      { status: 400 }
    );
  }
}
