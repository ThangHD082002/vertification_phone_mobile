'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2, ShieldCheck } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';
import { ViettelConsentModal } from '@/components/ViettelConsentModal';
import {
  getAuthorizeUrlInfo,
  verifyNumberWithBackend,
  getRedirectUri,
} from '@/services/telcoApi';
import { ApiLog } from '@/types';

export default function VerifyLoadingPage() {
  const router = useRouter();
  const { phoneNumber, backendUrl, useRealBackend, logs } = useMock();
  const [currentLog, setCurrentLog] = useState<ApiLog | null>(null);
  const [consentVisible, setConsentVisible] = useState(false);
  const [authState, setAuthState] = useState<string>('');
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const isStarted = useRef(false);

  useEffect(() => {
    if (isStarted.current) return;
    isStarted.current = true;

    async function initFlow() {
      try {
        const redirectUri = getRedirectUri();
        // Bước 1: Lấy thông tin Authorize URL từ Backend
        const authData = await getAuthorizeUrlInfo(backendUrl, redirectUri);
        setAuthState(authData.state);
        setAuthUrl(authData.authorizeUrl);

        // Hiển thị màn hình Viettel Consent In-App chuẩn (không bị trình duyệt chặn popup)
        setConsentVisible(true);
      } catch (err) {
        console.warn('Cannot fetch authorize URL, proceeding directly:', err);
        setConsentVisible(true);
      }
    }

    initFlow();
  }, [backendUrl]);

  const handleApproveConsent = async (code: string) => {
    setConsentVisible(false);
    setIsVerifying(true);

    try {
      const redirectUri = getRedirectUri();
      // Bước 2: Gửi code và SĐT về Backend verify
      const { data, log } = await verifyNumberWithBackend(
        backendUrl,
        phoneNumber,
        code,
        redirectUri,
        authState
      );

      setCurrentLog(log);

      setTimeout(() => {
        if (data.devicePhoneNumberVerified) {
          router.replace('/verify-success');
        } else {
          router.replace('/verify-failed');
        }
      }, 700);
    } catch (err: any) {
      console.error('Verify error:', err);
      router.replace('/verify-failed');
    }
  };

  const handleRejectConsent = () => {
    setConsentVisible(false);
    const failLog: ApiLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint: '/number-verification/verify',
      url: `${backendUrl || ''}/api/v1/number-verification/verify`,
      requestHeaders: { 'Content-Type': 'application/json' },
      requestPayload: { phoneNumber: phoneNumber.replace(/\s+/g, '') },
      responsePayload: {
        error: 'ACCESS_DENIED',
        message: 'Người dùng đã từ chối cấp quyền truy cập dữ liệu thuê bao Viettel',
      },
      statusCode: 400,
      durationMs: 120,
      statusText: '400 Bad Request',
    };
    setCurrentLog(failLog);

    setTimeout(() => {
      router.replace('/verify-failed');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center">
      {/* Radar Spinner Container */}
      <div className="relative w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-75" />
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>

      <h1 className="text-xl font-bold text-slate-100 mb-2">
        {isVerifying ? 'Đang đối soát số điện thoại...' : 'Đang kết nối cổng Viettel...'}
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        {isVerifying
          ? 'Gửi mã xác thực viễn thông về máy chủ để kiểm tra khớp với SIM thiết bị...'
          : 'Yêu cầu ủy quyền dữ liệu mạng di động 4G/5G Viettel Open Gateway...'}
      </p>

      {/* Phone Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#162032] border border-[#23324A] text-sky-400 text-xs font-mono font-bold mb-5 shadow-sm">
        <Smartphone className="w-3.5 h-3.5" />
        <span>MSISDN: {phoneNumber}</span>
      </div>

      {/* Console Box */}
      <div className="w-full">
        <ConsoleBox
          log={currentLog}
          isPending={!currentLog}
          pendingText={`GET /number-verification/v0/authorize-url\nPOST /number-verification/v0/verify\nPayload: {"phoneNumber": "${phoneNumber.replace(/\s+/g, '')}"}`}
        />
      </div>

      {/* Viettel Consent Screen Modal (In-App) */}
      <ViettelConsentModal
        visible={consentVisible}
        onApprove={handleApproveConsent}
        onReject={handleRejectConsent}
      />
    </div>
  );
}
