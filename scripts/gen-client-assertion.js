const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Đường dẫn file private key (tìm ở thư mục sim_swap_documentation hoặc thư mục hiện tại)
let privateKeyPath = path.resolve('D:/Desktop/sim_swap_documentation/private_key.pem');
if (!fs.existsSync(privateKeyPath)) {
  privateKeyPath = path.resolve(__dirname, 'private_key.pem');
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Cấu hình theo Viettel Open Gateway
const clientId = process.env.CLIENT_ID || 'DwtkXuDmRQqP_k-tckFkDa7lm6nXtjoDiBEPkSv8Z98';
const tokenUrl = process.env.TOKEN_URL || 'https://developers-access.viettel.vn/security-domain/oauth/token';
const keyId = process.env.KEY_ID || 'vtt-api-gw';

function generateClientAssertion(cId = clientId, aud = tokenUrl, kid = keyId) {
  const header = {
    alg: 'RS256',
    kid: kid,
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: cId,
    sub: cId,
    aud: aud,
    iat: now,
    exp: now + 300, // 5 phút
    jti: now.toString() + Math.floor(Math.random() * 1000000).toString(),
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signInput = encodedHeader + '.' + encodedPayload;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(privateKey, 'base64url');

  return signInput + '.' + signature;
}

const token = generateClientAssertion();

console.log('================================================================');
console.log('🔑 GENERATED VIETTEL CLIENT_ASSERTION (JWT - RS256):');
console.log('================================================================');
console.log(token);
console.log('================================================================');
console.log('Thời hạn: 5 phút từ bây giờ.');
console.log('Dùng cho POST https://developers-access.viettel.vn/security-domain/oauth/token');
console.log('Param 1: client_assertion_type = urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
console.log('Param 2: client_assertion = (dán token trên vào)');
console.log('================================================================');
