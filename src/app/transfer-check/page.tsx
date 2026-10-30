'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';
import { ApiLog } from '@/types';

export default function TransferCheckPage() {
  const router = useRouter();
  const { phoneNumber, maxAgeHours, runSimSwapCheck } = useMock();
  const [currentLog, setCurrentLog] = useState<ApiLog | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeSimCheck() {
      try {
        const { swapped, log } = await runSimSwapCheck(phoneNumber, maxAgeHours);
        if (!isMounted) return;
        setCurrentLog(log);

        setTimeout(() => {
          if (swapped) {
            router.replace('/transfer-blocked');
          } else {
            router.replace('/transfer-success');
          }
        }, 700);
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
      {/* Scanner Circle */}
      <div className="relative w-24 h-24 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-pink-500/20 animate-ping opacity-75" />
        <ShieldAlert className="w-10 h-10 text-pink-500 animate-pulse" />
        <Loader2 className="w-5 h-5 text-pink-400 animate-spin absolute top-2" />
      </div>

      <h1 className="text-xl font-bold text-slate-100 mb-2">
        Đang kiểm tra an toàn...
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        Hệ thống đang truy vấn trạng thái thẻ SIM với nhà mạng viễn thông qua CAMARA SIM Swap API (Mục đích: Phòng chống gian lận - dpv:FraudPreventionAndDetection)...
      </p>

      {/* Query Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#162032] border border-[#23324A] text-pink-400 text-xs font-mono font-bold mb-5 shadow-sm">
        <span>Quét lịch sử đổi SIM: {maxAgeHours} giờ gần nhất</span>
      </div>

      {/* Console Box */}
      <div className="w-full">
        <ConsoleBox
          log={currentLog}
          isPending={!currentLog}
          pendingText={`POST /sim-swap/v0/check\nPayload: {"phoneNumber": "${phoneNumber.replace(/\s+/g, '')}", "maxAge": ${maxAgeHours}}\nPurpose: dpv:FraudPreventionAndDetection`}
        />
      </div>
    </div>
  );
}

