import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'DwtkXuDmRQqP_ktckFkDa7lm6nXtjoDiBEPkSv8Z98';
const DEFAULT_SCOPE = 'number-verification:verify number-verification:device-phone-number';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customRedirectUri = searchParams.get('redirectUri');

  // Lấy origin của chính trang web hiện tại (hỗ trợ Vercel https://... và localhost)
  const origin = request.nextUrl.origin;
  const redirectUri = customRedirectUri || `${origin}/telco-callback`;

  const state = 'state_' + Math.random().toString(36).substring(2, 10);
  const authorizeUrl = `${origin}/api/v1/mock/viettel/oauth/authorize?client_id=${encodeURIComponent(
    CLIENT_ID
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(DEFAULT_SCOPE)}&state=${state}`;

  return NextResponse.json({
    authorizeUrl,
    state,
    clientId: CLIENT_ID,
    redirectUri,
    scope: DEFAULT_SCOPE,
  });
}

