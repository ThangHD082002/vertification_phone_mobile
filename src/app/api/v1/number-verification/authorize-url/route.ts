import { NextRequest, NextResponse } from 'next/server';
import { buildAuthorizeUrl, VIETTEL_CONFIG } from '@/lib/viettelGateway';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customRedirectUri = searchParams.get('redirectUri');

    // Mặc định dùng redirectUri hiện tại (https://vertification-phone-mobile.vercel.app/telco-callback)
    const origin = request.nextUrl.origin;
    const redirectUri = customRedirectUri || `${origin}/telco-callback`;

    const state = 'state_' + Math.random().toString(36).substring(2, 10);

    // Ký JAR request thật gửi tới máy chủ Viettel Open Gateway
    const { authorizeUrl, requestJwt, jti } = buildAuthorizeUrl(redirectUri, state);

    return NextResponse.json({
      authorizeUrl,
      state,
      clientId: VIETTEL_CONFIG.clientId,
      redirectUri,
      scope: VIETTEL_CONFIG.scopeNumberVerify,
      requestJwt,
      jti,
    });
  } catch (error: any) {
    console.error('Error generating authorize URL:', error);
    return NextResponse.json(
      {
        error: 'AUTHORIZE_URL_ERROR',
        message: error?.message || 'Không thể tạo URL xác thực Viettel',
      },
      { status: 500 }
    );
  }
}
