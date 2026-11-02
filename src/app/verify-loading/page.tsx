'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2, ExternalLink, QrCode } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';
import { getAuthorizeUrlInfo, getRedirectUri } from '@/services/telcoApi';
import { ApiLog } from '@/types';

export default function VerifyLoadingPage() {
  const router = useRouter();
  const { phoneNumber, backendUrl } = useMock();
  const [currentLog, setCurrentLog] = useState<ApiLog | null>(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(2);
  const [showQr, setShowQr] = useState(false);
  const [statusText, setStatusText] = useState('Đang khởi tạo yêu cầu ký số JAR...');
  const isStarted = useRef(false);

  useEffect(() => {
    if (isStarted.current) return;
    isStarted.current = true;

    async function initRealCarrierFlow() {
      try {
        const redirectUri = getRedirectUri();
        console.log('[RealFlow] Đang lấy Authorize URL thật từ Backend...');
        
        // Lưu SĐT vào storage để trang callback sử dụng
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('telco_phone_number', phoneNumber);
          localStorage.setItem('telco_phone_number', phoneNumber);
        }

        // Gọi Backend để sinh JAR JWT và URL Viettel thật
        const authData = await getAuthorizeUrlInfo(backendUrl, redirectUri);
        setAuthUrl(authData.authorizeUrl);
        setStatusText('Đã tạo liên kết ủy quyền 4G Viettel. Đang chuyển hướng...');

        const initLog: ApiLog = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          method: 'GET',
          endpoint: '/number-verification/authorize-url',
          url: `${backendUrl || ''}/api/v1/number-verification/authorize-url`,
          requestHeaders: { Accept: 'application/json' },
          requestPayload: { redirectUri, phoneNumber },
          responsePayload: {
            authorizeUrl: authData.authorizeUrl,
            clientId: authData.clientId,
            scope: authData.scope,
          },
          statusCode: 200,
          durationMs: 150,
          statusText: '200 OK',
        };
        setCurrentLog(initLog);

        // Bắt đầu đếm lùi để tự động chuyển hướng sang cổng Viettel
        let timer = 2;
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(interval);
            // Tự động chuyển trang sang cổng Viettel thật
            window.location.href = authData.authorizeUrl;
          }
        }, 1000);
      } catch (err: any) {
        console.error('[RealFlow] Lỗi khởi tạo Authorize URL:', err);
        setStatusText('Lỗi kết nối máy chủ xác thực');
      }
    }

    initRealCarrierFlow();
  }, [backendUrl, phoneNumber]);

  const handleOpenManually = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center">
      {/* Radar Spinner Container */}
      <div className="relative w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-75" />
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>

      <h1 className="text-xl font-bold text-slate-100 mb-2">
        {statusText}
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        Hệ thống đang chuyển sang màn hình ủy quyền nhà mạng <strong>Viettel 4G/5G</strong> để đối soát SIM...
      </p>

      {/* Phone Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#162032] border border-[#23324A] text-sky-400 text-xs font-mono font-bold mb-4 shadow-sm">
        <Smartphone className="w-3.5 h-3.5" />
        <span>MSISDN: {phoneNumber}</span>
      </div>

      {/* Action Buttons */}
      {authUrl && (
        <div className="w-full max-w-xs space-y-2.5 mb-5">
          <button
            type="button"
            onClick={handleOpenManually}
            className="w-full flex items-center justify-center space-x-2 bg-[#dc2626] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 transition transform active:scale-[0.99] text-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở trang Viettel ngay {countdown > 0 ? `(${countdown}s)` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-slate-400 hover:text-slate-200 text-xs transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{showQr ? 'Ẩn mã QR' : 'Hiện mã QR để quét bằng điện thoại 4G'}</span>
          </button>

          {showQr && (
            <div className="p-3 bg-white rounded-xl inline-block shadow-md my-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(authUrl)}`}
                alt="QR Code Viettel"
                className="w-44 h-44 mx-auto"
              />
              <p className="text-[10px] text-slate-700 mt-1 font-semibold">
                Bật 4G Viettel và quét mã để xác thực
              </p>
            </div>
          )}
        </div>
      )}

      {/* Console Box */}
      <div className="w-full">
        <ConsoleBox
          log={currentLog}
          isPending={!currentLog}
          pendingText={`GET /number-verification/v1/authorize-url\nPayload: {"phoneNumber": "${phoneNumber.replace(/\s+/g, '')}"}\nScope: number-verification:verify`}
        />
      </div>
    </div>
  );
}
