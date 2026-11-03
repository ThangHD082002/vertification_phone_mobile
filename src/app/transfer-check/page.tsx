'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Radio } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function TransferCheckPage() {
  const router = useRouter();
  const { phoneNumber, maxAgeHours, runSimSwapCheck } = useMock();

  const targetPhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  useEffect(() => {
    let isMounted = true;

    async function executeSimCheck() {
      try {
        console.log(`[SIM Swap Check] Đang gọi đối soát SIM thật cho SĐT: ${targetPhone}...`);
        const { swapped } = await runSimSwapCheck(targetPhone, maxAgeHours);
        if (!isMounted) return;

        setTimeout(() => {
          if (swapped) {
            router.replace('/transfer-blocked');
          } else {
            router.replace('/transfer-success');
          }
        }, 900);
      } catch (err) {
        console.error('[SIM Swap Check] Lỗi đối soát:', err);
        if (isMounted) router.replace('/transfer-blocked');
      }
    }

    executeSimCheck();

    return () => {
      isMounted = false;
    };
  }, [targetPhone, maxAgeHours, runSimSwapCheck, router]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center bg-[#F4F6FA] text-slate-800">
      {/* Scanner Circle Viettel Red */}
      <div className="relative w-24 h-24 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6 shadow-sm">
        <div className="absolute inset-0 rounded-full border border-red-300 animate-ping opacity-75" />
        <ShieldCheck className="w-10 h-10 text-[#EE0033]" />
        <Loader2 className="w-5 h-5 text-[#EE0033] animate-spin absolute top-2 right-2" />
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-2">
        Đang đối soát an toàn thẻ SIM...
      </h1>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        Hệ thống đang truy vấn trạng thái phôi thẻ SIM của thuê bao <strong className="text-slate-900">{targetPhone}</strong> trực tiếp qua Viettel Open Gateway...
      </p>

      {/* Query Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-mono font-bold mb-6 shadow-sm">
        <Radio className="w-3.5 h-3.5 text-[#EE0033] animate-pulse" />
        <span>Quét lịch sử đổi SIM: {maxAgeHours} giờ qua</span>
      </div>

      {/* Security Info Card */}
      <div className="w-full max-w-xs bg-white border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 text-left space-y-2 shadow-sm">
        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EE0033]"></span>
          <span>Cơ chế bảo vệ giao dịch tài chính</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Ngăn chặn các cuộc tấn công SIM swap / chiếm đoạt mã OTP ngân hàng theo thời gian thực (Zero False Sense of Security).
        </p>
      </div>
    </div>
  );
}
