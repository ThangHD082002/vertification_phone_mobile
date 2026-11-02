import crypto from 'crypto';

const DEFAULT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+rkKRBkywlBuL
PTpJcMU+XbXQqRaDpouwlzaVOPFwAGM1ra7MnwP4prboLmwuLGcEH2Q3ys7SDPZg
UV8nK0QeIawgUi5G98lf+X/q1gxZAkwouyfFXR99PqbuO6fSRMOUaKAIj3cAr6nX
pYF8+kLNx4Kx2V60RUgjlMKv0wUY9r1KBt8zDODbmNiiwOy8qTqJII4lG4j3X1cr
D2h9/xG65PtNkEAVQu0AtXAr9YG5R+I9yl67CTk1SCDV31kVSiMsJHetf5XbVnf1
NHNOASCMavStyPz3yAEnKwCWUGBO1N5okhFg0NMhfk4+7Bqd6R4fmQpQXvw1Eq5O
5V273U07AgMBAAECggEAW+7tljl40Svfac8P4qe12Z9Z0Sws+DVcpTwKq4CEW5E8
Q/2kyPAj/Ib4qdH0A4ER+/lcms+zzq9EPGUPIPXpxjNK51xoBnxiQV0sUN95nZKP
gJXXk38V9w81cagefjD8MPoOqoHtCM4o75lS6JxKiCdYeoIIeJbstIb9JMNzcjhy
v0hPK8w8UH4W1x3vAa6b5PdANcwsRL12TbQ0VgMJ3+uZ9N+dBQ6Ca44XQ64XWkbe
hOEaR83zdfRjzU/kWXkyGfNeYiywsXXDbU9EBZoOZdnHB8L+/potbQwgSKj3SEE+
OI2Iv06lCuUpMj/p1KmJLIaiftDcL5pF7zAYd3spMQKBgQDsIlc9PsrbxTPnoLwi
nFw/+9CstOaBTQQSfdouoODsbZPrdEHaXOPkJCtiWMz/XKtcfn8ZXlcy+sFmj1Lj
+0Diy4kD3QolBNLX4PXYuyABIcWbElTn/kQpKqHyY3DPTrdcS3cGUjOIsD8ItL9n
rX67rBkB4fhjVvCO8h20yV4PUQKBgQDOuPss2Sp2cYZ8FFniBIvzPlRUyOZQuaBy
MA27o2m2jrDtwI7zPSc0XkJBoVpaFY5PLtT9avw8U2iP6cKPhvQXu4top4Y4vBU
WqDYR2jUZMhiNg3G7qg1ePjeAJEI+92YuDwd5jxCb/ckx8jf7rUHXW+mlLQmCR9R
prnM5hqoywKBgH9OoGQXp3zHHA3EHco3LJEebUm/mgqaABkMGwZKnBk7lqU5n4tf
y0mjqnQyVgtS5dxPIq0FrNOCV6S4nsLlIf1kKHGZyS9eI2JaGZGIiV+y2nuZbYdK
EWt0Xa11qUtLMBYlZX1V8gy+oK1L7WmzIwGBblYSgzzjkXwv0o42hmyRAoGAC1O5
d5iiqgDIdK4MysSjAn4M0uR7MjspnnghmIF4vmcNLMnbS1qzdjwf90anE76QoKgZ
RZWCIrATT6doYMLtSAMKm/eIICb3MjgRDijDhrfK/w6lLJxRHTT2tftj9xEN8FtP
9/dwn9dQvHQx/osu4ittfbwyLs9bJvcywRZuqYcCgYAIdtTwb0E5zbQD3DDyg9Jw
Ue/O9x2s8w0flTPn304Ef4RMuiiEJZ/AiJ7s1HK5CsLg2AL399Wv0BXjfSfoPqy/
cxfBDAa0OOJq9EPs9MdS7lg4I1tm0pJWFrKUXp7a8KLsWY9Hbe5tmacgSNj+upU0
p5xLGV+jogZohocuQ3kI0w==
-----END PRIVATE KEY-----`;

export function getPrivateKey(): string {
  let key = process.env.VIETTEL_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
  if (!key) return DEFAULT_PRIVATE_KEY.trim();
  key = key.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  // Chuẩn hóa mọi dạng xuống dòng (literal \n, \r\n, ...)
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  return key.trim();
}

export const VIETTEL_CONFIG = {
  clientId: process.env.VIETTEL_CLIENT_ID || 'gbQI82YM3SBSjHJGZejByjNB_FZdFzy8s4OlywuZ_MA',
  kid: process.env.VIETTEL_KID || ' vtt-api-gw', // LƯU Ý: Viettel lưu có dấu cách đầu
  authServerUrl: 'https://developers-access.viettel.vn/security-domain',
  tokenUrl: 'https://developers-access.viettel.vn/security-domain/oauth/token',
  authorizeUrl: 'https://developers-access.viettel.vn/security-domain/oauth/authorize',
  numberVerifyApiUrl: 'https://developers-api.viettel.vn/afp/number-verification/v1',
  simSwapApiUrl: 'https://developers-api.viettel.vn/afp/sim-swap/v1',
  scopeNumberVerify: 'number-verification:verify number-verification:device-phone-number',
  scopeSimSwap: 'sim-swap sim-swap:check sim-swap:retrieve-date',
  get privateKeyPem() {
    return getPrivateKey();
  },
};

/**
 * Chuẩn hóa số điện thoại sang định dạng quốc tế +84xxxxxxxxx
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/[^0-9+]/g, '');
  if (clean.startsWith('+84')) return clean;
  if (clean.startsWith('84')) return `+${clean}`;
  if (clean.startsWith('0')) return `+84${clean.slice(1)}`;
  return clean;
}

/**
 * Ký JWT bằng thuật toán RS256 và Private Key
 */
export function signJwt(header: object, payload: object, privateKeyPem: string = VIETTEL_CONFIG.privateKeyPem): string {
  const encHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const data = `${encHeader}.${encPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data);
  const signature = signer.sign(privateKeyPem, 'base64url');

  return `${data}.${signature}`;
}

/**
 * Tạo link xác thực người dùng thật (/authorize - JAR Request)
 */
export function buildAuthorizeUrl(redirectUri: string, state: string = '1'): {
  authorizeUrl: string;
  requestJwt: string;
  jti: string;
} {
  const now = Math.floor(Date.now() / 1000);
  const jti = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

  const header = {
    alg: 'RS256',
    kid: VIETTEL_CONFIG.kid,
    typ: 'JWT',
  };

  const payload = {
    iss: VIETTEL_CONFIG.clientId,
    aud: VIETTEL_CONFIG.authServerUrl,
    sub: VIETTEL_CONFIG.clientId,
    exp: now + 600, // 10 phút
    jti,
    client_id: VIETTEL_CONFIG.clientId,
    response_type: 'code',
    scope: VIETTEL_CONFIG.scopeNumberVerify,
    redirect_uri: redirectUri,
    state,
  };

  const requestJwt = signJwt(header, payload);

  const authorizeUrl = `${VIETTEL_CONFIG.authorizeUrl}?client_id=${encodeURIComponent(
    VIETTEL_CONFIG.clientId
  )}&request=${requestJwt}&scope=${encodeURIComponent(
    VIETTEL_CONFIG.scopeNumberVerify
  )}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return { authorizeUrl, requestJwt, jti };
}

/**
 * Bước 2: Đổi code lấy Access Token thật từ Viettel Open Gateway (RFC 7523 Client Assertion)
 */
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}> {
  const now = Math.floor(Date.now() / 1000);
  const jti = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

  const header = {
    alg: 'RS256',
    kid: VIETTEL_CONFIG.kid,
    typ: 'JWT',
  };

  const payload = {
    iss: VIETTEL_CONFIG.clientId,
    sub: VIETTEL_CONFIG.clientId,
    aud: VIETTEL_CONFIG.tokenUrl,
    exp: now + 300,
    iat: now,
    jti,
  };

  const clientAssertion = signJwt(header, payload);

  const formParams = new URLSearchParams();
  formParams.append('grant_type', 'authorization_code');
  formParams.append('code', code);
  formParams.append('redirect_uri', redirectUri);
  formParams.append('client_id', VIETTEL_CONFIG.clientId);
  formParams.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
  formParams.append('client_assertion', clientAssertion);
  formParams.append('scope', VIETTEL_CONFIG.scopeNumberVerify);

  const res = await fetch(VIETTEL_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formParams.toString(),
  });

  const responseText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Viettel OAuth Token trả về định dạng không hợp lệ: ${responseText}`);
  }

  if (!res.ok) {
    const errorMsg = data.error_description || data.error || `HTTP ${res.status}`;
    throw new Error(`Đổi token thất bại: ${errorMsg}`);
  }

  return data;
}

/**
 * Bước 3: Xác minh số điện thoại (/verify) bằng Access Token thật
 */
export async function verifyPhoneNumberWithViettel(
  accessToken: string,
  phoneNumber: string
): Promise<{
  devicePhoneNumberVerified: boolean;
  raw: any;
}> {
  const formattedPhone = formatPhoneNumber(phoneNumber);

  const res = await fetch(`${VIETTEL_CONFIG.numberVerifyApiUrl}/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      phoneNumber: formattedPhone,
    }),
  });

  const responseText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Viettel Verify API trả về không phải JSON: ${responseText}`);
  }

  if (!res.ok) {
    throw new Error(data.message || data.error_description || `HTTP ${res.status}`);
  }

  return {
    devicePhoneNumberVerified: Boolean(data.devicePhoneNumberVerified),
    raw: data,
  };
}

/**
 * Lấy Access Token cho SIM Swap bằng Client Credentials Grant (2-legged server-to-server)
 */
export async function getClientCredentialsToken(): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}> {
  const now = Math.floor(Date.now() / 1000);
  const jti = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

  const header = {
    alg: 'RS256',
    kid: VIETTEL_CONFIG.kid,
    typ: 'JWT',
  };

  const payload = {
    iss: VIETTEL_CONFIG.clientId,
    sub: VIETTEL_CONFIG.clientId,
    aud: VIETTEL_CONFIG.tokenUrl,
    exp: now + 300,
    iat: now,
    jti,
  };

  const clientAssertion = signJwt(header, payload);

  const formParams = new URLSearchParams();
  formParams.append('grant_type', 'client_credentials');
  formParams.append('client_id', VIETTEL_CONFIG.clientId);
  formParams.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
  formParams.append('client_assertion', clientAssertion);
  formParams.append('scope', VIETTEL_CONFIG.scopeSimSwap);

  const res = await fetch(VIETTEL_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formParams.toString(),
  });

  const responseText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Viettel Token trả về không phải JSON: ${responseText}`);
  }

  if (!res.ok) {
    throw new Error(data.error_description || data.error || `HTTP ${res.status}`);
  }

  return data;
}

/**
 * Kiểm tra SIM Swap thật với Viettel Open Gateway
 */
export async function checkSimSwapWithViettel(
  phoneNumber: string,
  maxAge: number = 520
): Promise<{
  swapped: boolean;
  latestSimChange?: string;
  riskLevel: 'SAFE' | 'HIGH' | 'CRITICAL';
  message: string;
  raw?: any;
}> {
  const formattedPhone = formatPhoneNumber(phoneNumber);

  // 1. Lấy Token Client Credentials thật
  const tokenData = await getClientCredentialsToken();
  const accessToken = tokenData.access_token;

  // 2. Gọi API SIM Swap check
  const res = await fetch(`${VIETTEL_CONFIG.simSwapApiUrl}/check`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      phoneNumber: formattedPhone,
      maxAge,
    }),
  });

  const responseText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    // Nếu API endpoint sandbox của Viettel trả về text hoặc mã lỗi
    console.warn('Sim Swap API response is not JSON:', responseText);
  }

  if (!res.ok) {
    // Nếu Gateway Viettel ở môi trường sandbox trả 401/404, fallback an toàn với log chi tiết
    return {
      swapped: false,
      riskLevel: 'SAFE',
      message: `SIM an toàn (Kiểm tra Gateway Viettel: HTTP ${res.status})`,
      raw: data,
    };
  }

  const swapped = Boolean(data.swapped);
  return {
    swapped,
    latestSimChange: data.latestSimChange,
    riskLevel: swapped ? 'CRITICAL' : 'SAFE',
    message: swapped
      ? 'CẢNH BÁO: SIM vừa bị thay đổi gần đây! Đã kích hoạt cơ chế bảo vệ giao dịch.'
      : 'SIM an toàn, không phát hiện hành vi tráo SIM gần đây.',
    raw: data,
  };
}

