'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2 } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';
import { ApiLog } from '@/types';

export default function VerifyLoadingPage() {
  const router = useRouter();
  const { phoneNumber, runNumberVerification } = useMock();
  const [currentLog, setCurrentLog] = useState<ApiLog | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeVerification() {
      try {
        const { success, log } = await runNumberVerification(phoneNumber);
        if (!isMounted) return;
        setCurrentLog(log);

        // Chờ 700ms để kịp nhìn thấy kết quả log nhảy trên Console
        setTimeout(() => {
          if (success) {
            router.replace('/verify-success');
          } else {
            router.replace('/verify-failed');
          }
        }, 700);
      } catch {
        if (isMounted) router.replace('/verify-failed');
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [phoneNumber, runNumberVerification, router]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-5 pb-16 text-center">
      {/* Radar Spinner Container */}
      <div className="relative w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-75" />
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>

      <h1 className="text-xl font-bold text-slate-100 mb-2">
        Đang xác thực số thuê bao...
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        Gửi yêu cầu xác thực tới Telco Network API thông qua IP kết nối 4G Viettel (Network-Based Authentication)...
      </p>

      {/* Phone Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#162032] border border-[#23324A] text-sky-400 text-xs font-mono font-bold mb-5 shadow-sm">
        <Smartphone className="w-3.5 h-3.5" />
        <span>MSISDN: {phoneNumber}</span>
      </div>

      {/* Console Box */}
      <div className="w-full">
        <ConsoleBox
          log={currentLog}
          isPending={!currentLog}
          pendingText={`POST /number-verification/v0/verify\nPayload: {"phoneNumber": "${phoneNumber.replace(/\s+/g, '')}"}`}
        />
      </div>
    </div>
  );
}
