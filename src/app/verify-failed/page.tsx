'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Mail, RefreshCw, Radio } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function VerifyFailedPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();

  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  const handleRetry = () => {
    router.replace('/verify-loading');
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setOtpModalVisible(false);
      router.replace('/dashboard');
    } else {
      alert('Vui lòng nhập đủ 6 chữ số OTP');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-10 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Alert Badge */}
      <div className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-5 flex items-center space-x-1.5 shadow-sm">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span>CHƯA XÁC THỰC QUA 4G</span>
      </div>

      {/* Warning Icon */}
      <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/25">
        <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1.5 text-center">
        Chưa xác thực được
      </h1>
      <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed mb-6">
        Không thể nhận diện số thuê bao tự động qua kết nối di động ngầm.
      </p>

      {/* Reasons Card - Light Theme */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 mb-6 text-xs shadow-sm">
        <h2 className="text-amber-700 font-bold text-sm mb-1">Gợi ý xử lý:</h2>
        <div className="flex items-start space-x-2.5 text-slate-700">
          <Radio className="w-4 h-4 text-[#EE0033] mt-0.5 shrink-0" />
          <span>Vui lòng <strong>tắt Wi-Fi</strong> và <strong>bật kết nối 4G/5G Viettel</strong> trên điện thoại.</span>
        </div>
        <div className="flex items-start space-x-2.5 text-slate-700">
          <span className="text-[#EE0033] font-bold">•</span>
          <span>
            Đảm bảo SIM chính trên máy đúng là số thuê bao: <strong className="text-slate-900 font-mono">{activePhone}</strong>.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={handleRetry}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-bold">Thử lại qua 4G Viettel</span>
        </button>

        <button
          type="button"
          onClick={() => setOtpModalVisible(true)}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl border border-slate-200 shadow-sm transition text-xs"
        >
          <Mail className="w-4 h-4 text-[#EE0033]" />
          <span>Đăng nhập bằng mã SMS OTP (Dự phòng)</span>
        </button>
      </div>

      {/* OTP Modal */}
      {otpModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nhập mã xác thực OTP</h3>
            <p className="text-xs text-slate-500 mb-4">
              Mã xác thực 6 chữ số đã được gửi tới số điện thoại <strong className="text-slate-800">{activePhone}</strong>
            </p>
            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center font-mono font-black text-2xl tracking-widest bg-slate-50 border border-slate-300 rounded-2xl py-3 text-slate-900 focus:outline-none focus:border-[#EE0033]"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#EE0033] to-[#BA0024] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md"
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
