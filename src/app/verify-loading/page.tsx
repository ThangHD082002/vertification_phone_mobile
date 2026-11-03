'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2, ExternalLink, QrCode, ShieldCheck, Radio } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { getAuthorizeUrlInfo, getRedirectUri } from '@/services/telcoApi';

export default function VerifyLoadingPage() {
  const router = useRouter();
  const { phoneNumber, backendUrl } = useMock();
  const [authUrl, setAuthUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(2);
  const [showQr, setShowQr] = useState(false);
  const [statusText, setStatusText] = useState('Đang khởi tạo kết nối Viettel Open Gateway...');
  const isStarted = useRef(false);

  // Lấy chính xác SĐT từ state hoặc storage
  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  useEffect(() => {
    if (isStarted.current) return;
    isStarted.current = true;

    async function initRealCarrierFlow() {
      try {
        const redirectUri = getRedirectUri();
        console.log(`[RealFlow] Đang lấy Authorize URL thật cho SĐT: ${activePhone}...`);

        // Lưu SĐT vào storage để trang callback sử dụng
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('telco_phone_number', activePhone);
          localStorage.setItem('telco_phone_number', activePhone);
        }

        // Gọi Backend để sinh JAR JWT và URL Viettel thật
        const authData = await getAuthorizeUrlInfo(backendUrl, redirectUri);
        setAuthUrl(authData.authorizeUrl);
        setStatusText('Đã sẵn sàng. Đang chuyển hướng sang cổng xác thực Viettel...');

        // Bắt đầu đếm lùi để tự động chuyển hướng sang cổng Viettel
        let timer = 2;
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(interval);
            window.location.href = authData.authorizeUrl;
          }
        }, 1000);
      } catch (err: any) {
        console.error('[RealFlow] Lỗi khởi tạo Authorize URL:', err);
        setStatusText('Lỗi kết nối cổng Viettel Open Gateway');
      }
    }

    initRealCarrierFlow();
  }, [backendUrl, activePhone]);

  const handleOpenManually = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center bg-[#F4F6FA] text-slate-800">
      {/* Viettel Radar Spinner Container */}
      <div className="relative w-24 h-24 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-red-300 animate-ping opacity-75" />
        <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin" />
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-2">
        {statusText}
      </h1>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">
        Hệ thống đang mở kênh đối soát với <strong>Viettel 4G/5G</strong> để xác minh quyền sở hữu SIM thuê bao trực tiếp trên thiết bị...
      </p>

      {/* Phone Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold mb-5 shadow-sm">
        <Smartphone className="w-4 h-4 text-[#EE0033]" />
        <span>Thuê bao: {activePhone}</span>
      </div>

      {/* Action Buttons */}
      {authUrl && (
        <div className="w-full max-w-xs space-y-3 mb-5">
          <button
            type="button"
            onClick={handleOpenManually}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition transform active:scale-[0.98] text-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở trang xác thực Viettel {countdown > 0 ? `(${countdown}s)` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-slate-600 hover:text-slate-900 text-xs transition font-semibold"
          >
            <QrCode className="w-3.5 h-3.5 text-[#EE0033]" />
            <span>{showQr ? 'Ẩn mã QR' : 'Quét mã QR bằng điện thoại 4G Viettel'}</span>
          </button>

          {showQr && (
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg my-2 border border-slate-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(authUrl)}`}
                alt="QR Code Viettel"
                className="w-44 h-44 mx-auto rounded-lg"
              />
              <p className="text-[11px] text-slate-800 mt-2 font-bold">
                Bật 4G/5G Viettel và quét mã để xác thực
              </p>
            </div>
          )}
        </div>
      )}

      {/* Security Status Box */}
      <div className="w-full max-w-xs bg-white border border-slate-200/80 rounded-2xl p-4 text-left text-xs space-y-2 shadow-sm">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bảo mật hạ tầng viễn thông</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-[#EE0033]" />
          <span>Kênh truyền mã hóa RS256 định danh trực tiếp qua P-GW</span>
        </div>
      </div>
    </div>
  );
}
