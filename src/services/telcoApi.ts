import { ApiLog } from '../types';

export interface AuthorizeUrlResult {
  authorizeUrl: string;
  state: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface NumberVerifyResult {
  devicePhoneNumberVerified: boolean;
  match?: boolean;
  message?: string;
  operator?: string;
  verifiedAt?: string;
}

export interface SimSwapCheckResult {
  swapped: boolean;
  latestSimChange?: string;
  riskLevel?: string;
  purpose?: string;
  message?: string;
}

/**
 * Tự động xác định địa chỉ IP máy tính chạy backend Spring Boot (port 8088)
 */
export function getDefaultBackendUrl(): string {
  if (typeof window !== 'undefined') {
    // Nếu chạy qua port khác trên localhost hoặc IP máy nội bộ
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8088/api/v1`;
    }
  }
  return 'http://localhost:8088/api/v1';
}

/**
 * Tạo redirect URI theo domain Next.js hiện tại
 */
export function getRedirectUri(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/telco-callback`;
  }
  return 'http://localhost:3000/telco-callback';
}

/**
 * Bước 1 & 2: Lấy URL Authorize và mở Popup / Tab xác thực mạng di động 4G/5G
 */
export async function executeCarrierAuth(
  backendUrl: string,
  redirectUri: string = getRedirectUri()
): Promise<{ code: string; state?: string; authorizeUrl: string; durationMs: number }> {
  const startTime = Date.now();
  const endpoint = `${backendUrl}/number-verification/authorize-url?redirectUri=${encodeURIComponent(redirectUri)}`;

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to get authorize URL: HTTP ${res.status}`);
  }

  const data: AuthorizeUrlResult = await res.json();
  const authorizeUrl = data.authorizeUrl;

  // Trên Web: Mở Popup hoặc xử lý callback qua BroadcastChannel / localStorage / postMessage
  if (typeof window !== 'undefined') {
    return new Promise((resolve, reject) => {
      const popupWidth = 460;
      const popupHeight = 620;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;

      const popup = window.open(
        authorizeUrl,
        'telco_auth_popup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,toolbar=no,menubar=no`
      );

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Carrier authentication timed out after 30 seconds'));
      }, 30000);

      const checkStorageOrMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'TELCO_AUTH_SUCCESS') {
          cleanup();
          resolve({
            code: event.data.code,
            state: event.data.state || data.state,
            authorizeUrl,
            durationMs: Date.now() - startTime,
          });
        }
      };

      const storageListener = (event: StorageEvent) => {
        if (event.key === 'telco_auth_code' && event.newValue) {
          const code = event.newValue;
          localStorage.removeItem('telco_auth_code');
          cleanup();
          resolve({
            code,
            state: data.state,
            authorizeUrl,
            durationMs: Date.now() - startTime,
          });
        }
      };

      const pollPopupClosed = setInterval(() => {
        // Kiểm tra xem sessionStorage/localStorage có code chưa
        const savedCode = sessionStorage.getItem('telco_auth_code') || localStorage.getItem('telco_auth_code');
        if (savedCode) {
          sessionStorage.removeItem('telco_auth_code');
          localStorage.removeItem('telco_auth_code');
          cleanup();
          resolve({
            code: savedCode,
            state: data.state,
            authorizeUrl,
            durationMs: Date.now() - startTime,
          });
          return;
        }

        if (popup && popup.closed) {
          cleanup();
          reject(new Error('User cancelled or closed network carrier authentication popup'));
        }
      }, 500);

      function cleanup() {
        clearTimeout(timeoutId);
        clearInterval(pollPopupClosed);
        window.removeEventListener('message', checkStorageOrMessage);
        window.removeEventListener('storage', storageListener);
        if (popup && !popup.closed) {
          try {
            popup.close();
          } catch {
            // ignore
          }
        }
      }

      window.addEventListener('message', checkStorageOrMessage);
      window.addEventListener('storage', storageListener);
    });
  }

  throw new Error('Window environment not found');
}

/**
 * Bước 3: Gửi số điện thoại và code về backend để đối soát
 */
export async function verifyNumberWithBackend(
  backendUrl: string,
  phoneNumber: string,
  code: string,
  redirectUri: string = getRedirectUri(),
  state?: string
): Promise<{ data: NumberVerifyResult; log: ApiLog }> {
  const startTime = Date.now();
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  const url = `${backendUrl}/number-verification/verify`;
  const payload = {
    phoneNumber: cleanPhone,
    code,
    redirectUri,
    state,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const durationMs = Date.now() - startTime;
  const statusText = `${res.status} ${res.statusText || (res.ok ? 'OK' : 'Error')}`;
  const responseData: NumberVerifyResult = await res.json();

  const log: ApiLog = {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    method: 'POST',
    endpoint: '/number-verification/verify',
    url,
    requestHeaders: headers,
    requestPayload: payload,
    responsePayload: responseData,
    statusCode: res.status,
    durationMs,
    statusText,
  };

  return { data: responseData, log };
}

/**
 * Gọi API kiểm tra tráo SIM (SIM Swap Check)
 */
export async function checkSimSwapWithBackend(
  backendUrl: string,
  phoneNumber: string,
  maxAge: number = 48
): Promise<{ data: SimSwapCheckResult; log: ApiLog }> {
  const startTime = Date.now();
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  const url = `${backendUrl}/sim-swap/check`;
  const payload = {
    phoneNumber: cleanPhone,
    maxAge,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const durationMs = Date.now() - startTime;
  const statusText = `${res.status} ${res.statusText || (res.ok ? 'OK' : 'Error')}`;
  const responseData: SimSwapCheckResult = await res.json();

  const log: ApiLog = {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    method: 'POST',
    endpoint: '/sim-swap/check',
    url,
    requestHeaders: headers,
    requestPayload: payload,
    responsePayload: responseData,
    statusCode: res.status,
    durationMs,
    statusText,
  };

  return { data: responseData, log };
}
