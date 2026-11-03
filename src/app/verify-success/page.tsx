'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Radio, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function VerifySuccessPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();

  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  const handleGoHome = () => {
    router.replace('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-10 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Viettel Verified Badge */}
      <div className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-5 flex items-center space-x-1.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>VIETTEL OPEN GATEWAY • VERIFIED</span>
      </div>

      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/25">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1.5 text-center">
        Xác thực thành công
      </h1>
      <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed mb-6">
        Thuê bao đã được nhận diện tự động qua dữ liệu mạng di động 4G/5G Viettel.
      </p>

      {/* Details Card - Light Theme */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3.5 mb-6 text-xs shadow-sm">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Số thuê bao xác minh:</span>
          <span className="font-bold text-slate-900 font-mono text-sm">{activePhone}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Mạng kết nối:</span>
          <div className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-700 font-bold text-[11px] border border-emerald-100">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Viettel 4G/5G LTE</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Định danh phần cứng SIM:</span>
          <span className="font-bold text-emerald-600">Trùng khớp 100% với SIM thiết bị</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500">Phương thức xác thực:</span>
          <span className="font-semibold text-slate-800">Silent Auth (Không cần mã OTP SMS)</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleGoHome}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
      >
        <span className="text-sm font-bold">Vào Viettel Money</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
