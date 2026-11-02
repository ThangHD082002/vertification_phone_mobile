'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TransferSuccessPage() {
  const router = useRouter();

  const handleDone = () => {
    router.replace('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-10 pb-16">
      {/* Viettel Badge */}
      <div className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-5 flex items-center space-x-1.5">
        <ShieldCheck className="w-4 h-4" />
        <span>GIAO DỊCH ĐÃ ĐƯỢC BẢO VỆ</span>
      </div>

      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-500/30">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-1 text-center">
        Chuyển tiền thành công
      </h1>
      <div className="text-3xl font-black text-emerald-400 mb-6">
        20.000.000 đ
      </div>

      {/* Details Card */}
      <div className="w-full bg-[#141824] border border-[#232A3B] rounded-3xl p-5 space-y-3.5 mb-6 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-[#1E2536]">
          <span className="text-slate-400">Người thụ hưởng:</span>
          <span className="font-bold text-white uppercase">NGUYỄN THỊ MAI</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E2536]">
          <span className="text-slate-400">Ngân hàng nhận:</span>
          <span className="font-semibold text-slate-200">MB - Ngân hàng Quân Đội</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E2536]">
          <span className="text-slate-400">Mã giao dịch:</span>
          <span className="font-mono font-bold text-slate-300">VTM261102987654</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Kiểm tra SIM Swap:</span>
          <div className="flex items-center space-x-1 bg-emerald-500/15 px-2.5 py-0.5 rounded-full text-emerald-400 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Thẻ SIM an toàn (swapped: false)</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleDone}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 transition duration-150"
      >
        <span className="text-sm font-bold">Về trang chủ Viettel Money</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
