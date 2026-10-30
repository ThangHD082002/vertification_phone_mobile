'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Mail, RefreshCw, MessageSquare } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';

export default function VerifyFailedPage() {
  const router = useRouter();
  const { phoneNumber, logs } = useMock();

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  const verifyLog = logs.find((l) => l.endpoint.includes('number-verification')) || logs[0];

  const handleRetry = () => {
    router.replace('/verify-loading');
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setOtpModalVisible(false);
      router.replace('/dashboard');
    } else {
      alert('Vui lòng nhập đủ 6 chữ số OTP');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16">
      {/* Badge Flow */}
      <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold mb-4">
        FLOW A4 • FALLBACK
      </div>

      {/* Warning Icon */}
      <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/30">
        <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-100 mb-1.5 text-center">
        Chưa xác thực được
      </h1>
      <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed mb-5">
        Không thể xác minh số thuê bao tự động qua kết nối di động ngầm.
      </p>

      {/* Reasons Card */}
      <div className="w-full bg-[#162032] border border-[#23324A] rounded-2xl p-4 space-y-2 mb-3 text-xs">
        <h2 className="text-amber-400 font-bold mb-1.5">Nguyên nhân phổ biến:</h2>
        <div className="flex items-start space-x-2 text-slate-300">
          <span className="text-amber-400 font-bold">•</span>
          <span>Thiết bị đang bật kết nối Wi-Fi (IP thiết bị không đi qua trạm P-GW của Viettel).</span>
        </div>
        <div className="flex items-start space-x-2 text-slate-300">
          <span className="text-amber-400 font-bold">•</span>
          <span>
            Khe SIM chính trên máy không phải là số thuê bao: <strong className="text-white font-mono">{phoneNumber}</strong>.
          </span>
        </div>
        <div className="flex items-start space-x-2 text-slate-300">
          <span className="text-amber-400 font-bold">•</span>
          <span>Dữ liệu di động (Cellular Data) chưa được kích hoạt.</span>
        </div>
      </div>

      {/* Console Box */}
      <ConsoleBox log={verifyLog} defaultTitle="POST /number-verification/v0/verify (400 Bad Request)" />

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 mt-2">
        <button
          type="button"
          onClick={() => setOtpModalVisible(true)}
          className="w-full flex items-center justify-center space-x-2 bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99]"
        >
          <Mail className="w-4 h-4" />
          <span>Xác thực bằng OTP qua SMS</span>
        </button>

        <button
          type="button"
          onClick={handleRetry}
          className="w-full flex items-center justify-center space-x-2 py-3 text-sky-400 hover:text-sky-300 font-semibold text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Thử lại kết nối di động</span>
        </button>
      </div>

      {/* OTP SMS Modal */}
      {otpModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#162032] border border-[#23324A] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              Nhập mã xác thực SMS OTP
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Mã gồm 6 chữ số đã được gửi tới số điện thoại {phoneNumber}
            </p>

            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl py-3 px-4 text-center font-mono text-2xl font-bold tracking-widest text-slate-100 focus:outline-none focus:border-blue-500"
                autoFocus
              />

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setOtpModalVisible(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E60E2] text-white font-bold text-xs hover:bg-blue-600 transition"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

