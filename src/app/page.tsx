'use client';

import { useMock } from '@/context/MockContext';
import { ArrowRight, Phone, Radio, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { phoneNumber, setPhoneNumber } = useMock();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('telco_phone_number', cleanPhone);
      sessionStorage.setItem('telco_phone_number', cleanPhone);
    }
    setPhoneNumber(cleanPhone);
    router.push('/verify-loading');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Viettel Brand Top Header */}
      <div className="pt-3 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Viettel Logo Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EE0033] to-[#BA0024] flex items-center justify-center font-black text-white text-lg shadow-md shadow-red-600/20 tracking-tight">
            V
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">Viettel</span>
              <span className="text-lg font-black tracking-tight text-[#EE0033]">Silent</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Digital Finance & Telecom Gateway
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Viettel Silent Live</span>
        </div>
      </div>

      {/* Main Login Card - Light Theme */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* Subtle red accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#EE0033]/5 rounded-full blur-2xl pointer-events-none" />

        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Đăng nhập
        </h2>

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus-within:bg-white focus-within:border-[#EE0033] focus-within:ring-2 focus-within:ring-[#EE0033]/15 transition">
              <Phone className="w-4 h-4 text-[#EE0033] mr-2.5 shrink-0" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại (VD: 0983 784 276)"
                className="w-full bg-transparent text-slate-900 font-bold text-base tracking-wide focus:outline-none placeholder-slate-400"
                required
              />
            </div>

          </div>

          {/* 4G/5G Cellular Status Badge */}
          <div className="flex items-start space-x-2.5 bg-red-50 border border-red-100 rounded-2xl p-3.5">
            <Radio className="w-4 h-4 text-[#EE0033] mt-0.5 shrink-0 animate-pulse" />
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Vui lòng bật dữ liệu di động <strong className="text-[#EE0033]">4G/5G Viettel</strong> để hệ thống đối soát SIM tự động theo chuẩn GSMA Open Gateway.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
          >
            <span className="text-sm font-bold tracking-wide">Xác thực với Viettel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* GSMA Open Gateway Tech Features */}
      <div className="mt-5 space-y-3">
        {/* Demo footnote */}
        <div className="text-center pt-2">
          <span className="text-[11px] text-slate-400">
            Hệ thống Viettel Open Gateway • Phiên bản tích hợp Production Ready
          </span>
        </div>
      </div>
    </div>
  );
}
