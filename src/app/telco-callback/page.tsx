'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (code) {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('telco_auth_code', code);
          localStorage.setItem('telco_auth_code', code);

          // Nếu đang mở trong popup window
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(
              {
                type: 'TELCO_AUTH_SUCCESS',
                code,
                state,
              },
              '*'
            );
            setTimeout(() => {
              window.close();
            }, 300);
            return;
          }
        }
      } catch {
        // ignore
      }

      // Nếu chạy cùng tab, tự chuyển về verify-loading
      setTimeout(() => {
        router.replace('/verify-loading');
      }, 500);
    }
  }, [code, state, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-5">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>

      <h1 className="text-xl font-bold text-slate-100 mb-2">
        Đang hoàn tất xác thực...
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        Đã nhận diện tín hiệu viễn thông Viettel. Cửa sổ này sẽ tự động đóng.
      </p>

      {code && (
        <div className="inline-flex items-center space-x-2 bg-[#162032] border border-[#23324A] px-3.5 py-1.5 rounded-lg text-emerald-400 font-mono text-xs max-w-full truncate">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">Code: {code}</span>
        </div>
      )}
    </div>
  );
}

export default function TelcoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
