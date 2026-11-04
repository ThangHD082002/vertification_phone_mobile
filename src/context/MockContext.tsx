'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ApiLog } from '../types';
import {
  getDefaultBackendUrl,
  getRedirectUri,
  executeCarrierAuth,
  verifyNumberWithBackend,
  checkSimSwapWithBackend,
} from '../services/telcoApi';

interface TelcoContextType {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  maxAgeHours: number;
  setMaxAgeHours: (hours: number) => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  logs: ApiLog[];
  clearLogs: () => void;
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
}

const TelcoContext = createContext<TelcoContextType | undefined>(undefined);

export function TelcoProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumberState] = useState('0983 784 276');
  const [maxAgeHours, setMaxAgeHours] = useState(520);
  const [backendUrl, setBackendUrlState] = useState<string>('');
  const [logs, setLogs] = useState<ApiLog[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone =
        localStorage.getItem('telco_phone_number') ||
        sessionStorage.getItem('telco_phone_number');
      if (savedPhone) {
        setPhoneNumberState(savedPhone);
      }
      const savedBackendUrl = localStorage.getItem('telco_backend_url');
      if (savedBackendUrl !== null) {
        setBackendUrlState(savedBackendUrl);
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

  const clearLogs = () => setLogs([]);

  /**
   * 100% GỌI THẬT VIETTEL OPEN GATEWAY - NUMBER VERIFICATION
   */
  const runNumberVerification = useCallback(
    async (phone: string): Promise<{ success: boolean; data: any; log: ApiLog }> => {
      const startTime = Date.now();
      const redirectUri = getRedirectUri();

      try {
        console.log(`[Telco] Gọi Viettel Number Verification thật cho SĐT: ${phone}...`);

        // Bước 1 & 2: Lấy authorize URL và mở Consent popup
        const { code, state } = await executeCarrierAuth(backendUrl, redirectUri);

        // Bước 3: Gửi verify request về Backend đối soát với Viettel OAuth
        const { data, log } = await verifyNumberWithBackend(backendUrl, phone, code, redirectUri, state);

        setLogs((prev) => [log, ...prev]);
        return {
          success: data.devicePhoneNumberVerified === true,
          data,
          log,
        };
      } catch (err: any) {
        console.error(`[Telco] Lỗi xác thực số điện thoại Viettel: ${err?.message}`);
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
    },
    [backendUrl]
  );

  /**
   * 100% GỌI THẬT VIETTEL OPEN GATEWAY - SIM SWAP CHECK
   */
  const runSimSwapCheck = useCallback(
    async (
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
    },
    [backendUrl]
  );

  return (
    <TelcoContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        maxAgeHours,
        setMaxAgeHours,
        backendUrl,
        setBackendUrl,
        logs,
        clearLogs,
        runNumberVerification,
        runSimSwapCheck,
      }}
    >
      {children}
    </TelcoContext.Provider>
  );
}

export function useTelco() {
  const context = useContext(TelcoContext);
  if (!context) {
    throw new Error('useTelco must be used within a TelcoProvider');
  }
  return context;
}

// Giữ lại alias useMock & MockProvider để các page hiện tại import không bị break
export const useMock = useTelco;
export const MockProvider = TelcoProvider;
