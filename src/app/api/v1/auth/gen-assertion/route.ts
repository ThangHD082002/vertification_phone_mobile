import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Private key từ file hoặc biến môi trường
function getPrivateKey(): string {
  if (process.env.TELCO_PRIVATE_KEY) {
    return process.env.TELCO_PRIVATE_KEY.replace(/\\n/g, '\n');
  }

  const localPaths = [
    path.resolve(process.cwd(), 'scripts/private_key.pem'),
    path.resolve('D:/Desktop/sim_swap_documentation/private_key.pem'),
  ];

  for (const p of localPaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  return '';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId') || 'DwtkXuDmRQqP_k-tckFkDa7lm6nXtjoDiBEPkSv8Z98';
  const tokenUrl = searchParams.get('tokenUrl') || 'https://developers-access.viettel.vn/security-domain/oauth/token';
  const keyId = searchParams.get('keyId') || 'vtt-api-gw';

  const privateKey = getPrivateKey();
  if (!privateKey) {
    return NextResponse.json(
      { error: 'Private key not found. Please set TELCO_PRIVATE_KEY env var or provide private_key.pem.' },
      { status: 500 }
    );
  }

  const header = {
    alg: 'RS256',
    kid: keyId,
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientId,
    sub: clientId,
    aud: tokenUrl,
    iat: now,
    exp: now + 300, // 5 phút
    jti: now.toString() + Math.floor(Math.random() * 1000000).toString(),
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signInput = `${encodedHeader}.${encodedPayload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(privateKey, 'base64url');
  const clientAssertion = `${signInput}.${signature}`;

  return NextResponse.json({
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: clientAssertion,
    expires_in: 300,
    created_at: new Date(now * 1000).toISOString(),
    expires_at: new Date((now + 300) * 1000).toISOString(),
  });
}
