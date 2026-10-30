import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = 'eyJraWQiOiJ2dHQtYXBpLWd3IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.mock_access_token_' + Math.random().toString(36).substring(2);
  
  return NextResponse.json({
    access_token: token,
    token_type: 'bearer',
    expires_in: 300,
    scope: 'number-verification:verify',
  });
}
