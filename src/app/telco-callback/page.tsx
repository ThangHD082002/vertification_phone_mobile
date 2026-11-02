'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { verifyNumberWithBackend, getRedirectUri } from '@/services/telcoApi';
import { useMock } from '@/context/MockContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { backendUrl, phoneNumber } = useMock();
  const [statusMessage, setStatusMessage] = useState('Đang tiếp nhận kết quả từ Viettel Open Gateway...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const isProcessed = useRef(false);

  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    async function processCallback() {
      // 1. Trường hợp Viettel trả về lỗi
      if (error) {
        console.warn('[Callback] Viettel trả lỗi:', error, errorDescription);
        const errMsg = errorDescription || error;
        setErrorDetails(errMsg);
        setStatusMessage(`Viettel từ chối: ${errMsg}`);

        setTimeout(() => {
          router.replace('/verify-failed');
        }, 1800);
        return;
      }

      // 2. Trường hợp nhận được authorization code thành công từ Viettel
      if (code) {
        setStatusMessage('Đã nhận mã Code. Đang đối soát số thuê bao...');
        try {
          const redirectUri = getRedirectUri();
          const targetPhone =
            sessionStorage.getItem('telco_phone_number') ||
            localStorage.getItem('telco_phone_number') ||
            phoneNumber;

          console.log(`[Callback] Bắt đầu verify với Viettel: code=${code.substring(0, 8)}..., phone=${targetPhone}`);

          const { data } = await verifyNumberWithBackend(
            backendUrl,
            targetPhone,
            code,
            redirectUri
          );

          if (data.devicePhoneNumberVerified) {
            setStatusMessage('Xác thực số điện thoại thành công 100%!');
            if (typeof window !== 'undefined') {
              localStorage.setItem('telco_is_verified', 'true');
            }
            setTimeout(() => {
              router.replace('/verify-success');
            }, 800);
          } else {
            setStatusMessage(data.message || 'Số điện thoại không khớp với SIM thiết bị');
            setTimeout(() => {
              router.replace('/verify-failed');
            }, 1200);
          }
        } catch (err: any) {
          console.error('[Callback] Lỗi đổi token và verify:', err);
          setErrorDetails(err?.message || 'Lỗi đối soát với Viettel');
          setStatusMessage('Lỗi đối soát với cổng Viettel Open Gateway');
          setTimeout(() => {
            router.replace('/verify-failed');
          }, 1500);
        }
      }
    }

    processCallback();
  }, [code, error, errorDescription, backendUrl, phoneNumber, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#EE0033]/15 border border-[#EE0033]/30 flex items-center justify-center mb-5">
        {error ? (
          <AlertTriangle className="w-10 h-10 text-amber-400" />
        ) : (
          <Loader2 className="w-10 h-10 text-[#EE0033] animate-spin" />
        )}
      </div>

      <h1 className="text-xl font-bold text-white mb-2">
        {statusMessage}
      </h1>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
        {error
          ? 'Không thể hoàn tất ủy quyền. Vui lòng đảm bảo bạn đang sử dụng mạng 4G/5G Viettel.'
          : 'Hệ thống đang trao đổi chữ ký số với Viettel Core Network để hoàn tất đăng nhập.'}
      </p>

      {code && (
        <div className="inline-flex items-center space-x-2 bg-[#141824] border border-[#232A3B] px-3.5 py-1.5 rounded-full text-emerald-400 font-mono text-xs max-w-full truncate mb-4 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">Code: {code}</span>
        </div>
      )}

      {errorDetails && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-2xl max-w-xs mb-4">
          Chi tiết lỗi: {errorDetails}
        </div>
      )}

      <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-500 mt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Bảo mật hạ tầng Viettel Open Gateway Live</span>
      </div>
    </div>
  );
}

export default function TelcoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#EE0033] animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
