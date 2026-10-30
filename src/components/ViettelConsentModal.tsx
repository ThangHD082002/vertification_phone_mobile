'use client';

import React from 'react';

interface ViettelConsentModalProps {
  visible: boolean;
  onApprove: (code: string) => void;
  onReject: () => void;
}

export function ViettelConsentModal({
  visible,
  onApprove,
  onReject,
}: ViettelConsentModalProps) {
  if (!visible) return null;

  const handleApprove = () => {
    const authCode = 'vtt_code_' + Math.random().toString(36).substring(2, 18);
    onApprove(authCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-white rounded-3xl p-6 text-center shadow-2xl text-slate-800 animate-in zoom-in-95 duration-200">
        {/* Viettel Logo */}
        <div className="text-[#ee0033] text-2xl font-black tracking-tighter mb-4 lowercase">
          viettel
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
          Chia sẻ dữ liệu với Number Verification Application
        </h3>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Bạn đang cho phép <strong>Number Verification Application</strong> sử dụng dịch vụ xác thực thuê bao:
        </p>

        {/* Badges */}
        <div className="flex justify-center gap-2 mb-4">
          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg">
            Xác minh số điện thoại
          </span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg">
            Chia sẻ số điện thoại
          </span>
        </div>

        {/* Terms */}
        <p className="text-[11px] text-slate-500 mb-5 leading-relaxed text-left">
          Để tiếp tục sử dụng dịch vụ, Viettel sẽ chia sẻ thông tin số điện thoại của bạn với <strong>ABC Bank</strong>.<br />
          Xem <span className="text-[#ee0033] underline font-semibold cursor-pointer">Chính sách quyền riêng tư</span> và <span className="text-[#ee0033] underline font-semibold cursor-pointer">Điều khoản dịch vụ</span>.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleApprove}
            className="w-full py-3.5 bg-[#ee0033] hover:bg-[#cc002c] active:bg-[#b00026] text-white font-bold rounded-xl text-sm shadow-lg shadow-red-500/25 transition transform active:scale-[0.99]"
          >
            ✓ Đồng ý & Xác thực
          </button>

          <button
            type="button"
            onClick={onReject}
            className="w-full py-2.5 bg-transparent hover:bg-slate-50 text-slate-500 border border-slate-300 rounded-xl text-xs font-semibold transition"
          >
            ✕ Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

