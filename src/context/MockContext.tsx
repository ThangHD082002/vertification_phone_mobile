'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiLog, TestCase, VerificationScenario, SimSwapScenario } from '../types';
import {
  getDefaultBackendUrl,
  getRedirectUri,
  executeCarrierAuth,
  verifyNumberWithBackend,
  checkSimSwapWithBackend,
} from '../services/telcoApi';

/**
 * 6 KỊCH BẢN KIỂM THỬ CHUẨN TỪ BẢN FIGMA (TEST CASES MATRIX)
 */
export const DEFAULT_TEST_CASES: TestCase[] = [
  {
    id: 'tc-01',
    code: 'TC-01',
    title: '4G Viettel On-Net (Chuẩn Happy Flow)',
    description: 'Thiết bị đang dùng 4G Viettel, định danh IP tự động, đăng nhập không cần OTP. SIM an toàn.',
    phoneNumber: '098 765 4321',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SAFE',
    expectedResult: 'Xác thực thành công tức thì -> Chuyển tiền 50M thành công.',
    badge: 'NORMAL',
  },
  {
    id: 'tc-02',
    code: 'TC-02',
    title: 'Wifi / Mạng khác (Fallback sang SMS OTP)',
    description: 'Thiết bị đang kết nối Wifi hoặc mạng ngoại tuyến, không nhận diện được IP 4G ngầm.',
    phoneNumber: '098 111 2222',
    verifyScenario: 'FAIL',
    simSwapScenario: 'SAFE',
    expectedResult: 'Báo lỗi xác thực ngầm -> Hiển thị nút fallback nhập mã SMS OTP.',
    badge: 'FALLBACK',
  },
  {
    id: 'tc-03',
    code: 'TC-03',
    title: 'Chuyển tiền an toàn (SIM ổn định > 1 năm)',
    description: 'Số thuê bao hoạt động bình thường, không thay đổi thẻ SIM trong nhiều năm.',
    phoneNumber: '098 888 8888',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SAFE',
    expectedResult: 'SIM an toàn (swapped = false) -> Giao dịch hoàn tất.',
    badge: 'NORMAL',
  },
  {
    id: 'tc-04',
    code: 'TC-04',
    title: 'Phát hiện tráo SIM (Đổi SIM 2 giờ trước)',
    description: 'Kẻ gian vừa đổi phôi SIM / làm lại SIM 2 giờ trước nhằm chiếm đoạt tài khoản.',
    phoneNumber: '036 868 2926',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SWAPPED_RECENT',
    expectedResult: 'Cảnh báo gian lận (swapped = true) -> Khóa giao dịch, bắt xác thực FaceID eKYC.',
    badge: 'RISK',
  },
  {
    id: 'tc-05',
    code: 'TC-05',
    title: 'Biên an toàn (Đổi SIM 50 giờ trước, maxAge = 48h)',
    description: 'SIM đổi cách đây 50 giờ, vượt qua mốc quét rủi ro 48 giờ của ngân hàng.',
    phoneNumber: '097 555 6666',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SWAPPED_OLD',
    expectedResult: 'Không coi là rủi ro (swapped = false) -> Cho phép giao dịch.',
    badge: 'NORMAL',
  },
  {
    id: 'tc-06',
    code: 'TC-06',
    title: 'Lỗi hạ tầng Telco (Network API Timeout)',
    description: 'Cổng kết nối nhà mạng gặp sự cố tạm thời hoặc timeout phản hồi.',
    phoneNumber: '090 999 0000',
    verifyScenario: 'TIMEOUT',
    simSwapScenario: 'ERROR',
    expectedResult: 'Báo lỗi hệ thống -> Yêu cầu thử lại hoặc xử lý an toàn.',
    badge: 'FALLBACK',
  },
];

interface MockContextType {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  verifyScenario: VerificationScenario;
  setVerifyScenario: (scenario: VerificationScenario) => void;
  simSwapScenario: SimSwapScenario;
  setSimSwapScenario: (scenario: SimSwapScenario) => void;
  maxAgeHours: number;
  setMaxAgeHours: (hours: number) => void;
  developerMode: boolean;
  setDeveloperMode: (enabled: boolean) => void;
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  logs: ApiLog[];
  activeTestCase: TestCase | null;
  applyTestCase: (tc: TestCase) => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  useRealBackend: boolean;
  setUseRealBackend: (useReal: boolean) => void;
  runNumberVerification: (phone: string) => Promise<{ success: boolean; data: any; log: ApiLog }>;
  runSimSwapCheck: (phone: string, maxAge: number) => Promise<{ swapped: boolean; latestSimChange?: string; log: ApiLog }>;
  clearLogs: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export function MockProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumber] = useState('098 765 4321');
  const [verifyScenario, setVerifyScenario] = useState<VerificationScenario>('SUCCESS');
  const [simSwapScenario, setSimSwapScenario] = useState<SimSwapScenario>('SWAPPED_RECENT');
  const [maxAgeHours, setMaxAgeHours] = useState(48);
  const [developerMode, setDeveloperMode] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [activeTestCase, setActiveTestCase] = useState<TestCase | null>(DEFAULT_TEST_CASES[0]);

  // Cấu hình kết nối Backend:
  // Mặc định useRealBackend = true để gọi thẳng vào các Route Handler /api/v1 trên cùng domain Vercel!
  const [backendUrl, setBackendUrlState] = useState<string>('');
  const [useRealBackend, setUseRealBackendState] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBackendUrl = localStorage.getItem('telco_backend_url');
      if (savedBackendUrl !== null) {
        setBackendUrlState(savedBackendUrl);
      }
      const savedUseReal = localStorage.getItem('telco_use_real_backend');
      if (savedUseReal !== null) {
        setUseRealBackendState(savedUseReal === 'true');
      }
    }
  }, []);

  const setBackendUrl = (url: string) => {
    setBackendUrlState(url);
    if (typeof window !== 'undefined') {
      localStorage.setItem('telco_backend_url', url);
    }
  };

  const setUseRealBackend = (useReal: boolean) => {
    setUseRealBackendState(useReal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('telco_use_real_backend', String(useReal));
    }
  };

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const applyTestCase = (tc: TestCase) => {
    setActiveTestCase(tc);
    setPhoneNumber(tc.phoneNumber);
    setVerifyScenario(tc.verifyScenario);
    setSimSwapScenario(tc.simSwapScenario);
  };

  const clearLogs = () => setLogs([]);

  /**
   * THỰC HIỆN XÁC THỰC SỐ ĐIỆN THOẠI (NUMBER VERIFICATION)
   */
  const runNumberVerification = async (phone: string): Promise<{ success: boolean; data: any; log: ApiLog }> => {
    const startTime = Date.now();
    const redirectUri = getRedirectUri();

    if (useRealBackend) {
      try {
        console.log(`[Telco] Calling Number Verification via ${backendUrl || 'Next.js Internal Route Handler'}...`);

        // Bước 1 & 2: Lấy authorize URL và mở Consent popup
        const { code, state } = await executeCarrierAuth(backendUrl, redirectUri);

        // Bước 3: Gửi verify request về Backend (Route Handler hoặc Spring Boot)
        const { data, log } = await verifyNumberWithBackend(backendUrl, phone, code, redirectUri, state);

        setLogs((prev) => [log, ...prev]);
        return {
          success: data.devicePhoneNumberVerified === true,
          data,
          log,
        };
      } catch (err: any) {
        console.warn(`[Telco] Backend call failed (${err?.message}), recording error log...`);
        const failLog: ApiLog = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          method: 'POST',
          endpoint: '/number-verification/verify',
          url: `${backendUrl || ''}/api/v1/number-verification/verify`,
          requestHeaders: { 'Content-Type': 'application/json' },
          requestPayload: { phoneNumber: phone.replace(/\s+/g, '') },
          responsePayload: {
            error: 'CARRIER_AUTH_ERROR',
            message: err?.message || 'Lỗi trong quá trình xác thực với nhà mạng',
          },
          statusCode: 400,
          durationMs: Date.now() - startTime,
          statusText: '400 Bad Request',
        };
        setLogs((prev) => [failLog, ...prev]);
        return { success: false, data: failLog.responsePayload, log: failLog };
      }
    }

    // Luồng Mock Simulator (chỉ dùng khi người dùng tắt useRealBackend trong Dev Panel)
    await new Promise((resolve) => setTimeout(resolve, 800));
    const isSuccess = verifyScenario === 'SUCCESS';
    const isTimeout = verifyScenario === 'TIMEOUT';
    const durationMs = Date.now() - startTime;
    const nowIso = new Date().toISOString();

    const responsePayload = isSuccess
      ? {
          devicePhoneNumberVerified: true,
          match: true,
          message: 'Xác thực số điện thoại thuê bao thành công qua mạng di động Viettel (Mock Local)',
          operator: 'Viettel',
          verifiedAt: nowIso,
        }
      : isTimeout
      ? {
          code: 'GATEWAY_TIMEOUT',
          message: 'Telco Network API response timed out after 5000ms',
        }
      : {
          devicePhoneNumberVerified: false,
          match: false,
          message: 'Số điện thoại không khớp với SIM thiết bị (Fallback SMS OTP)',
        };

    const statusCode = isSuccess ? 200 : isTimeout ? 504 : 400;

    const log: ApiLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: nowIso,
      method: 'POST',
      endpoint: '/number-verification/verify',
      url: `${backendUrl || ''}/api/v1/number-verification/verify`,
      requestHeaders: {
        'Content-Type': 'application/json',
      },
      requestPayload: {
        phoneNumber: phone.replace(/\s+/g, ''),
      },
      responsePayload,
      statusCode,
      durationMs,
      statusText: isSuccess ? '200 OK' : isTimeout ? '504 Gateway Timeout' : '400 Bad Request',
    };

    setLogs((prev) => [log, ...prev]);
    return { success: isSuccess, data: responsePayload, log };
  };

  /**
   * THỰC HIỆN KIỂM TRA ĐỔI SIM (SIM SWAP CHECK)
   */
  const runSimSwapCheck = async (
    phone: string,
    maxAge: number
  ): Promise<{ swapped: boolean; latestSimChange?: string; log: ApiLog }> => {
    const startTime = Date.now();

    if (useRealBackend) {
      try {
        console.log(`[Telco] Calling SIM Swap check via ${backendUrl || 'Next.js Internal Route Handler'}...`);
        const { data, log } = await checkSimSwapWithBackend(backendUrl, phone, maxAge);
        setLogs((prev) => [log, ...prev]);
        return {
          swapped: data.swapped === true,
          latestSimChange: data.latestSimChange,
          log,
        };
      } catch (err: any) {
        console.warn(`[Telco] Backend SIM swap check failed (${err?.message}), recording error log...`);
      }
    }

    // Luồng Mock Simulator Fallback
    await new Promise((resolve) => setTimeout(resolve, 800));
    const isSwappedRecent = simSwapScenario === 'SWAPPED_RECENT';
    const isError = simSwapScenario === 'ERROR';

    const now = new Date();
    let latestSimDate: string | undefined;
    if (isSwappedRecent) {
      latestSimDate = '2026-10-25T14:27:08+07:00';
    } else if (simSwapScenario === 'SWAPPED_OLD') {
      latestSimDate = new Date(now.getTime() - 50 * 3600 * 1000).toISOString();
    } else {
      latestSimDate = new Date(now.getTime() - 400 * 24 * 3600 * 1000).toISOString();
    }

    const swapped = isSwappedRecent;
    const statusCode = isError ? 500 : 200;

    const responsePayload = isError
      ? {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'HLR/UDM query failure from Telco core',
        }
      : {
          swapped,
          latestSimChange: latestSimDate,
          riskLevel: swapped ? 'CRITICAL' : 'SAFE',
          purpose: 'dpv:FraudPreventionAndDetection',
        };

    const log: ApiLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: now.toISOString(),
      method: 'POST',
      endpoint: '/sim-swap/check',
      url: `${backendUrl || ''}/api/v1/sim-swap/check`,
      requestHeaders: {
        'Content-Type': 'application/json',
      },
      requestPayload: {
        phoneNumber: phone.replace(/\s+/g, ''),
        maxAge: maxAge,
      },
      responsePayload,
      statusCode,
      durationMs: Date.now() - startTime,
      statusText: isError ? '500 Internal Error' : '200 OK',
    };

    setLogs((prev) => [log, ...prev]);
    return { swapped, latestSimChange: latestSimDate, log };
  };

  return (
    <MockContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        verifyScenario,
        setVerifyScenario,
        simSwapScenario,
        setSimSwapScenario,
        maxAgeHours,
        setMaxAgeHours,
        developerMode,
        setDeveloperMode,
        themeMode,
        toggleTheme,
        logs,
        activeTestCase,
        applyTestCase,
        backendUrl,
        setBackendUrl,
        useRealBackend,
        setUseRealBackend,
        runNumberVerification,
        runSimSwapCheck,
        clearLogs,
      }}
    >
      {children}
    </MockContext.Provider>
  );
}

export function useMock() {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMock must be used within a MockProvider');
  }
  return context;
}
