'use client';

import { useMock } from '@/context/MockContext';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TransferSuccessPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();

  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  const handleDone = () => {
    router.replace('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-10 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Viettel Badge */}
      <div className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-5 flex items-center space-x-1.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>GIAO DỊCH ĐÃ ĐƯỢC BẢO VỆ</span>
      </div>

      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/25">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
        Chuyển tiền thành công
      </h1>
      <div className="text-3xl font-black text-emerald-600 mb-6">
        20.000.000 đ
      </div>

      {/* Details Card - Light Theme */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3.5 mb-6 text-xs shadow-sm">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Tài khoản nguồn:</span>
          <span className="font-bold text-slate-900 font-mono">Viettel Silent ({activePhone})</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Người thụ hưởng:</span>
          <span className="font-bold text-slate-900 uppercase">NGUYỄN THỊ MAI</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Ngân hàng nhận:</span>
          <span className="font-semibold text-slate-800">MB - Ngân hàng Quân Đội</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Mã giao dịch:</span>
          <span className="font-mono font-bold text-slate-700">VTM261102987654</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500">Kiểm tra SIM Swap:</span>
          <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-emerald-700 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thẻ SIM an toàn (swapped: false)</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleDone}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
      >
        <span className="text-sm font-bold">Về trang chủ Viettel Silent</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
