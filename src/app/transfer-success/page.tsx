'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';

export default function TransferSuccessPage() {
  const router = useRouter();
  const { logs } = useMock();

  const simLog = logs.find((l) => l.endpoint.includes('sim-swap')) || logs[0];

  const handleDone = () => {
    router.replace('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16">
      {/* Badge Flow */}
      <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-4">
        FLOW B4 • SIM SAFE & APPROVED
      </div>

      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-100 mb-1 text-center">
        Giao dịch thành công
      </h1>
      <div className="text-2xl font-black text-emerald-400 mb-5">
        50.000.000 đ
      </div>

      {/* Details Card */}
      <div className="w-full bg-[#162032] border border-[#23324A] rounded-2xl p-4 space-y-3 mb-3 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Người thụ hưởng:</span>
          <span className="font-semibold text-slate-100">NGUYEN VAN B</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Ngân hàng nhận:</span>
          <span className="font-semibold text-slate-100">Ngân hàng XYZ</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Mã giao dịch:</span>
          <span className="font-mono font-bold text-slate-200">FT261028987123</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Kiểm tra SIM Swap:</span>
          <div className="flex items-center space-x-1 bg-emerald-500/15 px-2 py-0.5 rounded text-emerald-400 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>An toàn (swapped: false)</span>
          </div>
        </div>
      </div>

      {/* Console Box */}
      <ConsoleBox log={simLog} defaultTitle="POST /sim-swap/v0/check (200 OK - swapped: false)" />

      {/* Action Button */}
      <button
        type="button"
        onClick={handleDone}
        className="w-full mt-2 flex items-center justify-center bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99]"
      >
        <span>Về trang chủ</span>
      </button>
    </div>
  );
}

