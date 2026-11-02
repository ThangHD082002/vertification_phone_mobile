'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Radio, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function LoginPage() {
  const router = useRouter();
  const { phoneNumber, setPhoneNumber } = useMock();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/verify-loading');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-16">
      {/* Viettel Brand Top Header */}
      <div className="pt-3 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Viettel Logo Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EE0033] to-[#99001D] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-600/30 tracking-tight">
            V
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black tracking-tight text-white">Viettel</span>
              <span className="text-lg font-black tracking-tight text-[#EE0033]">Money</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Digital Finance & Telecom Gateway
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Open Gateway Live</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-[#141824] border border-[#232A3B] rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle red accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#EE0033]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EE0033] text-white">
            Silent Auth
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Xác thực mạng 4G/5G Viettel
          </span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-1">
          Đăng nhập tài khoản
        </h2>
        <p className="text-slate-400 text-xs mb-5">
          Nhận diện số thuê bao trực tiếp qua dữ liệu mạng di động, không cần chờ mã OTP.
        </p>

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Số điện thoại thuê bao:
            </label>
            <div className="flex items-center bg-[#0B0E17] border border-[#2B354B] rounded-2xl px-3.5 py-3 focus-within:border-[#EE0033] focus-within:ring-1 focus-within:ring-[#EE0033]/50 transition">
              <Phone className="w-4 h-4 text-[#EE0033] mr-2.5 shrink-0" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0983 784 276"
                className="w-full bg-transparent text-white font-bold text-base tracking-wide focus:outline-none placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* 4G/5G Cellular Status Badge */}
          <div className="flex items-start space-x-2.5 bg-[#EE0033]/10 border border-[#EE0033]/25 rounded-2xl p-3">
            <Radio className="w-4 h-4 text-[#EE0033] mt-0.5 shrink-0 animate-pulse" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vui lòng bật dữ liệu di động <strong className="text-[#EE0033]">4G/5G Viettel</strong> để hệ thống đối soát SIM tự động theo chuẩn GSMA Open Gateway.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 transition duration-150"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            <span className="text-sm font-bold tracking-wide">Xác thực với Viettel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* GSMA Open Gateway Tech Features */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tiêu chuẩn bảo mật viễn thông
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#141824] border border-[#232A3B] rounded-2xl p-3">
            <div className="text-[11px] font-bold text-white mb-0.5">Number Verification</div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Xác thực tức thì thẻ SIM vật lý / eSIM không qua SMS OTP, chống giả mạo số điện thoại.
            </p>
          </div>

          <div className="bg-[#141824] border border-[#232A3B] rounded-2xl p-3">
            <div className="text-[11px] font-bold text-white mb-0.5">SIM Swap Protection</div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Tự động phát hiện lịch sử tráo đổi SIM trong 48 giờ để khóa giao dịch rủi ro cao.
            </p>
          </div>
        </div>

        {/* Demo footnote */}
        <div className="text-center pt-2">
          <span className="text-[10px] text-slate-500">
            Hệ thống Viettel Open Gateway • Phiên bản tích hợp Production Ready
          </span>
        </div>
      </div>
    </div>
  );
}
