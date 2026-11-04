'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Radio } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function TransferCheckPage() {
  const router = useRouter();
  const { phoneNumber, maxAgeHours, runSimSwapCheck } = useMock();

  const [targetPhone, setTargetPhone] = useState<string>('0983 784 276');
  const [targetMaxAge, setTargetMaxAge] = useState<number>(520);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = sessionStorage.getItem('telco_sim_check_phone') || localStorage.getItem('telco_phone_number') || phoneNumber || '0983 784 276';
      const savedMaxAge = sessionStorage.getItem('telco_sim_check_maxage');
      setTargetPhone(savedPhone);
      if (savedMaxAge) {
        setTargetMaxAge(parseInt(savedMaxAge, 10) || 520);
      } else {
        setTargetMaxAge(maxAgeHours || 520);
      }
    }
  }, [phoneNumber, maxAgeHours]);

  useEffect(() => {
    let isMounted = true;

    async function executeSimCheck() {
      // Đợi load state từ storage xong
      const phoneToCheck =
        (typeof window !== 'undefined' ? sessionStorage.getItem('telco_sim_check_phone') : null) ||
        targetPhone ||
        '0983 784 276';

      const maxAgeToCheck =
        (typeof window !== 'undefined' && sessionStorage.getItem('telco_sim_check_maxage')
          ? parseInt(sessionStorage.getItem('telco_sim_check_maxage')!, 10)
          : null) ||
        targetMaxAge ||
        520;

      try {
        console.log(`[SIM Swap Check] Đang gọi đối soát SIM thật cho SĐT: ${phoneToCheck}, maxAge: ${maxAgeToCheck}h...`);
        const result = await runSimSwapCheck(phoneToCheck, maxAgeToCheck);
        if (!isMounted) return;

        setTimeout(() => {
          // NẾU CÓ LỖI TỪ API (VD: 404, 500, mạng) HOẶC PHÁT HIỆN SIM ĐỔI (swapped = true)
          // -> BẮT BUỘC CHUYỂN ĐẾN TRANG TRANSFER-BLOCKED, TUYỆT ĐỐI KHÔNG SANG TRANSFER-SUCCESS!
          if (!result.success || result.error) {
            console.warn('[SIM Swap Check] Lỗi API hoặc không xác thực được:', result.error);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('telco_transfer_error', result.error || 'Lỗi đối soát SIM');
            }
            router.replace('/transfer-blocked');
          } else if (result.swapped) {
            console.warn('[SIM Swap Check] Phát hiện SIM Swap (swapped=true)! Chặn giao dịch!');
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('telco_transfer_error');
            }
            router.replace('/transfer-blocked');
          } else {
            console.log('[SIM Swap Check] Thẻ SIM an toàn (swapped=false). Chấp thuận giao dịch.');
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('telco_transfer_error');
            }
            router.replace('/transfer-success');
          }
        }, 900);
      } catch (err: any) {
        console.error('[SIM Swap Check] Lỗi ngoại lệ trong quá trình đối soát:', err);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('telco_transfer_error', err?.message || 'Lỗi kết nối Viettel Open Gateway');
        }
        if (isMounted) router.replace('/transfer-blocked');
      }
    }

    executeSimCheck();

    return () => {
      isMounted = false;
    };
  }, [runSimSwapCheck, router, targetPhone, targetMaxAge]);

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
        Hệ thống đang truy vấn trạng thái phôi thẻ SIM của thuê bao <strong className="text-slate-900 font-mono">{targetPhone}</strong> trực tiếp qua Viettel Open Gateway...
      </p>

      {/* Query Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-mono font-bold mb-6 shadow-sm">
        <Radio className="w-3.5 h-3.5 text-[#EE0033] animate-pulse" />
        <span>Quét lịch sử đổi SIM: {targetMaxAge} giờ qua</span>
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
