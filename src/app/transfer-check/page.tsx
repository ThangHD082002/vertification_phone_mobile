'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Radio } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function TransferCheckPage() {
  const router = useRouter();
  const { phoneNumber, maxAgeHours, runSimSwapCheck } = useMock();

  useEffect(() => {
    let isMounted = true;

    async function executeSimCheck() {
      try {
        const { swapped } = await runSimSwapCheck(phoneNumber, maxAgeHours);
        if (!isMounted) return;

        setTimeout(() => {
          if (swapped) {
            router.replace('/transfer-blocked');
          } else {
            router.replace('/transfer-success');
          }
        }, 900);
      } catch {
        if (isMounted) router.replace('/transfer-blocked');
      }
    }

    executeSimCheck();

    return () => {
      isMounted = false;
    };
  }, [phoneNumber, maxAgeHours, runSimSwapCheck, router]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center">
      {/* Scanner Circle Viettel Red */}
      <div className="relative w-24 h-24 rounded-full bg-[#EE0033]/15 border border-[#EE0033]/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-[#EE0033]/25 animate-ping opacity-75" />
        <ShieldCheck className="w-10 h-10 text-[#EE0033]" />
        <Loader2 className="w-5 h-5 text-white animate-spin absolute top-2 right-2" />
      </div>

      <h1 className="text-xl font-bold text-white mb-2">
        Đang đối soát an toàn thẻ SIM...
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
        Hệ thống đang truy vấn trạng thái phôi thẻ SIM của thuê bao <strong>{phoneNumber}</strong> trực tiếp qua Viettel Open Gateway...
      </p>

      {/* Query Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141824] border border-[#232A3B] text-slate-200 text-xs font-mono font-bold mb-6 shadow-sm">
        <Radio className="w-3.5 h-3.5 text-[#EE0033] animate-pulse" />
        <span>Quét lịch sử đổi SIM: {maxAgeHours} giờ qua</span>
      </div>

      {/* Security Info Card */}
      <div className="w-full max-w-xs bg-[#141824] border border-[#232A3B] rounded-2xl p-4 text-xs text-slate-300 text-left space-y-2">
        <div className="font-bold text-white flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EE0033]"></span>
          <span>Cơ chế bảo vệ giao dịch tài chính</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ngăn chặn các cuộc tấn công SIM swap / chiếm đoạt mã OTP ngân hàng theo thời gian thực (Zero False Sense of Security).
        </p>
      </div>
    </div>
  );
}
