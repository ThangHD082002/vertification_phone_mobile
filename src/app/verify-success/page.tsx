'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Radio, ArrowRight } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';

export default function VerifySuccessPage() {
  const router = useRouter();
  const { phoneNumber, logs } = useMock();

  const verifyLog = logs.find((l) => l.endpoint.includes('number-verification')) || logs[0];

  const handleGoHome = () => {
    router.replace('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16">
      {/* Badge Flow */}
      <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-4">
        FLOW A3 • VERIFIED
      </div>

      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-100 mb-1.5 text-center">
        Xác thực thành công
      </h1>
      <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed mb-5">
        Thuê bao đã được nhận diện tự động qua dữ liệu mạng di động 4G/5G Viettel.
      </p>

      {/* Details Card */}
      <div className="w-full bg-[#162032] border border-[#23324A] rounded-2xl p-4 space-y-3 mb-3 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Thuê bao xác thực:</span>
          <span className="font-semibold text-slate-100">{phoneNumber}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Mạng kết nối:</span>
          <div className="flex items-center space-x-1 bg-emerald-500/15 px-2 py-0.5 rounded text-emerald-400 font-bold text-[11px]">
            <Radio className="w-3 h-3" />
            <span>Viettel 4G LTE</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Định danh thiết bị:</span>
          <span className="font-bold text-emerald-400">Khớp với SIM (100%)</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Phương thức:</span>
          <span className="font-medium text-slate-100">Không cần nhập OTP SMS</span>
        </div>
      </div>

      {/* Console Box */}
      <ConsoleBox log={verifyLog} defaultTitle="POST /number-verification/v0/verify (200 OK)" />

      {/* Action Button */}
      <button
        type="button"
        onClick={handleGoHome}
        className="w-full mt-2 flex items-center justify-center space-x-2 bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99]"
      >
        <span>Vào trang chủ</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

