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
    title: '4G Viettel On-Net (Happy Flow)',
    description: 'Thiết bị đang dùng 4G Viettel, định danh IP tự động, đăng nhập không cần OTP. SIM an toàn.',
    phoneNumber: '0983 784 276',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SAFE',
    expectedResult: 'Xác thực thành công tức thì -> Chuyển tiền an toàn.',
    badge: 'NORMAL',
  },
  {
    id: 'tc-02',
    code: 'TC-02',
    title: 'Wifi / Ngoại mạng (Fallback sang SMS OTP)',
    description: 'Thiết bị đang kết nối Wifi hoặc mạng ngoại tuyến, không nhận diện được IP 4G ngầm.',
    phoneNumber: '0983 784 276',
    verifyScenario: 'FAIL',
    simSwapScenario: 'SAFE',
    expectedResult: 'Báo lỗi xác thực ngầm -> Hiển thị nút fallback nhập mã SMS OTP.',
    badge: 'FALLBACK',
  },
  {
    id: 'tc-03',
    code: 'TC-03',
    title: 'Chuyển tiền an toàn (SIM ổn định)',
    description: 'Số thuê bao hoạt động bình thường, không thay đổi thẻ SIM trong nhiều năm.',
    phoneNumber: '0983 784 276',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SAFE',
    expectedResult: 'SIM an toàn (swapped = false) -> Giao dịch hoàn tất.',
    badge: 'NORMAL',
  },
  {
    id: 'tc-04',
    code: 'TC-04',
    title: 'Phát hiện tráo SIM (Đổi SIM gần đây)',
    description: 'Kẻ gian vừa đổi phôi SIM / làm lại SIM nhằm chiếm đoạt tài khoản.',
    phoneNumber: '0983 784 276',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SWAPPED_RECENT',
    expectedResult: 'Cảnh báo gian lận (swapped = true) -> Khóa giao dịch, bắt xác thực FaceID eKYC.',
    badge: 'RISK',
  },
  {
    id: 'tc-05',
    code: 'TC-05',
    title: 'Biên an toàn (maxAge = 48h)',
    description: 'SIM đổi ngoài khoảng thời gian giám sát an toàn của Viettel Open Gateway.',
    phoneNumber: '0983 784 276',
    verifyScenario: 'SUCCESS',
    simSwapScenario: 'SWAPPED_OLD',
    expectedResult: 'Không coi là rủi ro (swapped = false) -> Cho phép giao dịch.',
    badge: 'NORMAL',
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
  runSimSwapCheck: (
    phone: string,
    maxAge: number
  ) => Promise<{
    success: boolean;
    swapped: boolean;
    error?: string;
    latestSimChange?: string;
    log: ApiLog;
  }>;
  clearLogs: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export function MockProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumberState] = useState('0983 784 276');
  const [verifyScenario, setVerifyScenario] = useState<VerificationScenario>('SUCCESS');
  const [simSwapScenario, setSimSwapScenario] = useState<SimSwapScenario>('SWAPPED_RECENT');
  const [maxAgeHours, setMaxAgeHours] = useState(48);
  const [developerMode, setDeveloperMode] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [activeTestCase, setActiveTestCase] = useState<TestCase | null>(DEFAULT_TEST_CASES[0]);

  // Cấu hình kết nối Backend:
  // Mặc định useRealBackend = true để gọi thẳng vào các Route Handler /api/v1 trên cùng domain Vercel!
  const [backendUrl, setBackendUrlState] = useState<string>('');
  const [useRealBackend, setUseRealBackendState] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number');
      if (savedPhone) {
        setPhoneNumberState(savedPhone);
      }
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

  const setPhoneNumber = (phone: string) => {
    setPhoneNumberState(phone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('telco_phone_number', phone);
      sessionStorage.setItem('telco_phone_number', phone);
    }
  };

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
    return { success: false, data: null, log: {} as any };
  };

  /**
   * THỰC HIỆN KIỂM TRA ĐỔI SIM THẬT QUA VIETTEL OPEN GATEWAY (SIM SWAP CHECK)
   */
  const runSimSwapCheck = async (
    phone: string,
    maxAge: number
  ): Promise<{
    success: boolean;
    swapped: boolean;
    error?: string;
    latestSimChange?: string;
    log: ApiLog;
  }> => {
    const startTime = Date.now();
    try {
      console.log(`[Telco] Kiểm tra SIM Swap thật với Viettel: phone=${phone}, maxAge=${maxAge}h`);
      const { data, log } = await checkSimSwapWithBackend(backendUrl, phone, maxAge);
      setLogs((prev) => [log, ...prev]);
      return {
        success: true,
        swapped: data.swapped === true,
        latestSimChange: data.latestSimChange,
        log,
      };
    } catch (err: any) {
      console.error(`[Telco] Lỗi gọi Viettel SIM Swap: ${err?.message}`);
      const failLog: ApiLog = err?.log || {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        method: 'POST',
        endpoint: '/sim-swap/check',
        url: `${backendUrl || ''}/api/v1/sim-swap/check`,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestPayload: { phoneNumber: phone.replace(/\s+/g, ''), maxAge },
        responsePayload: {
          error: 'SIM_SWAP_ERROR',
          message: err?.message || 'Không thể kết nối máy chủ SIM Swap Viettel',
        },
        statusCode: 400,
        durationMs: Date.now() - startTime,
        statusText: '400 Bad Request',
      };
      if (err?.log) {
        setLogs((prev) => [err.log, ...prev]);
      } else {
        setLogs((prev) => [failLog, ...prev]);
      }
      return {
        success: false,
        swapped: false,
        error: err?.message || 'Không thể kết nối máy chủ SIM Swap Viettel',
        log: failLog,
      };
    }
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
