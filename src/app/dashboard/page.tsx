'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Eye,
  EyeOff,
  Send,
  Wallet,
  Receipt,
  Grid,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
} from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { DevModal } from '@/components/DevModal';
import { LogoutButton } from '@/components/LogoutButton';

export default function DashboardPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();

  const [showBalance, setShowBalance] = useState(true);
  const [devVisible, setDevVisible] = useState(false);

  const handleStartTransfer = () => {
    router.push('/transfer');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-28">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-5 pt-2">
        <div>
          <span className="text-[11px] text-slate-400 block">Tài khoản thanh toán</span>
          <span className="text-xl font-bold text-slate-100">Xin chào, Bình</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setDevVisible(true)}
            className="w-8 h-8 rounded-full bg-[#162032] border border-[#23324A] flex items-center justify-center text-sky-400 hover:text-white transition"
            title="Dev Panel"
          >
            <Wrench className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#1E60E2] text-white flex items-center justify-center font-bold text-xs">
            B
          </div>
          <LogoutButton variant="header" />
        </div>
      </div>

      {/* Bank Account Card */}
      <div className="bg-gradient-to-br from-[#1E60E2] to-[#1446A0] rounded-2xl p-5 shadow-xl text-white mb-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-300" />
            <span className="font-mono text-xs text-blue-100 tracking-wider">
              1903 1481 0175 4241
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="text-blue-200 hover:text-white transition"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-xs text-blue-200 mb-1">Số dư khả dụng</div>
        <div className="text-2xl font-black tracking-tight mb-5">
          {showBalance ? '182.450.000 đ' : '•••••••• đ'}
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold tracking-wider text-blue-100">NGUYEN VAN BINH</span>
          <div className="flex items-center space-x-1 bg-black/25 px-2 py-1 rounded-md text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Features */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          type="button"
          onClick={handleStartTransfer}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#1E60E2] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-200 mt-1.5 text-center">Chuyển tiền</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-200 mt-1.5 text-center">Nạp tiền</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-200 mt-1.5 text-center">Hóa đơn</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#334155] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-200 mt-1.5 text-center">Dịch vụ khác</span>
        </button>
      </div>

      {/* Banner Flow B */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 mb-6">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-amber-400">
            FLOW B: KIỂM TRA SIM SWAP BẢO MẬT
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Khi thực hiện giao dịch chuyển tiền lớn (ví dụ 50.000.000 đ), ABC Bank sẽ tự động gọi API nhà mạng để kiểm tra xem SIM có vừa bị làm lại/đổi SIM không.
        </p>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-bold text-slate-100 mb-3">Giao dịch gần đây</h2>
        <div className="bg-[#162032] border border-[#23324A] rounded-2xl divide-y divide-[#1E293B] overflow-hidden text-xs">
          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 truncate">Nạp tiền Vietlott SMS</div>
              <div className="text-[11px] text-slate-400">Hôm nay • 09:15</div>
            </div>
            <div className="font-bold text-rose-400">-50.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 truncate">The Coffee Bean & Tea Leaf</div>
              <div className="text-[11px] text-slate-400">Hôm qua • 16:30</div>
            </div>
            <div className="font-bold text-rose-400">-65.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 truncate">Lương tháng 10/2026</div>
              <div className="text-[11px] text-slate-400">25/10/2026 • 11:00</div>
            </div>
            <div className="font-bold text-emerald-400">+25.000.000 đ</div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Transfer Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-30">
        <div className="w-full max-w-[430px] p-4 bg-[#0B111E]/95 border-t border-[#1E293B] backdrop-blur pointer-events-auto">
          <button
            type="button"
            onClick={handleStartTransfer}
            className="w-full flex items-center justify-center space-x-2 bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Chuyển tiền</span>
          </button>
        </div>
      </div>

      <DevModal visible={devVisible} onClose={() => setDevVisible(false)} />
    </div>
  );
}

