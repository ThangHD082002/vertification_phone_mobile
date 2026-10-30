'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Radio, ArrowRight, SlidersHorizontal, List } from 'lucide-react';
import { useMock, DEFAULT_TEST_CASES } from '@/context/MockContext';
import { DevModal } from '@/components/DevModal';

export default function LoginPage() {
  const router = useRouter();
  const {
    phoneNumber,
    setPhoneNumber,
    activeTestCase,
    applyTestCase,
  } = useMock();

  const [devModalVisible, setDevModalVisible] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/verify-loading');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-20">
      {/* Top bar with Logo & Dev Button */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <div className="w-10 h-10 rounded-xl bg-[#1E60E2] flex items-center justify-center font-bold text-white text-xl shadow-md">
          A
        </div>
        <button
          type="button"
          onClick={() => setDevModalVisible(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#162032] border border-[#23324A] text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{activeTestCase ? activeTestCase.code : 'Test Case'}</span>
        </button>
      </div>

      {/* Brand Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
        ABC Bank
      </h1>
      <p className="text-slate-400 text-xs mt-1 mb-3">
        Demo app kiểm thử Network API Viễn thông
      </p>

      {/* CAMARA Standard Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-400 text-[11px] font-semibold border border-sky-500/20">
          CAMARA Number Verification v0.3
        </span>
        <span className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-400 text-[11px] font-semibold border border-rose-500/20">
          SIM Swap v0.4
        </span>
      </div>

      {/* Card Đăng nhập */}
      <div className="bg-[#162032] border border-[#23324A] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1E60E2] text-white">
            FLOW A
          </span>
          <span className="text-xs font-semibold text-slate-200">
            A1. Đăng nhập / Nhận diện thuê bao
          </span>
        </div>

        <form onSubmit={handleContinue} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Số điện thoại:
            </label>
            <div className="flex items-center bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2.5 focus-within:border-blue-500 transition">
              <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="098 765 4321"
                className="w-full bg-transparent text-slate-100 font-semibold text-base focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 4G/5G Cellular Notice Box */}
          <div className="flex items-start space-x-2 bg-sky-500/10 border border-sky-500/25 rounded-xl p-3">
            <Radio className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Cần bật kết nối <strong className="text-sky-400">4G/5G Viettel</strong> để xác thực số điện thoại ngầm không cần mã OTP. Hỗ trợ đầu số 096, 097, 098, 086, 03x...
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99]"
          >
            <span className="text-sm">Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Test Presets */}
      <div className="mt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Chọn nhanh kịch bản test (Figma presets):
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {DEFAULT_TEST_CASES.slice(0, 4).map((tc) => {
            const isSelected = activeTestCase?.id === tc.id;
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => applyTestCase(tc)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-400 shadow-md'
                    : 'bg-[#162032] border-[#23324A] hover:border-slate-500'
                }`}
              >
                <div className={`text-[10px] font-bold ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                  {tc.code}: {tc.phoneNumber}
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {tc.title.split('(')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setDevModalVisible(true)}
          className="w-full flex items-center justify-center space-x-1.5 mt-3 py-2 text-blue-400 hover:text-blue-300 text-xs font-semibold transition"
        >
          <List className="w-4 h-4" />
          <span>Xem đầy đủ bảng ma trận 6 test cases & cấu hình</span>
        </button>
      </div>

      <DevModal visible={devModalVisible} onClose={() => setDevModalVisible(false)} />
    </div>
  );
}
