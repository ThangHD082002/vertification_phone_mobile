'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  Smartphone,
  QrCode,
  Lock,
} from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { LogoutButton } from '@/components/LogoutButton';

export default function DashboardPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();
  const [showBalance, setShowBalance] = useState(true);

  const handleStartTransfer = () => {
    router.push('/transfer');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-28">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-5 pt-2">
        <div className="flex items-center space-x-3">
          {/* Avatar Viettel */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EE0033] to-[#8C0017] text-white flex items-center justify-center font-bold text-sm shadow-md">
            NB
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Tài khoản Viettel Money</span>
            <span className="text-base font-bold text-white tracking-tight">Nguyễn Văn Bình</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <LogoutButton variant="header" />
        </div>
      </div>

      {/* Viettel Money Account Card */}
      <div className="bg-gradient-to-br from-[#EE0033] via-[#D80027] to-[#8A0018] rounded-3xl p-5 shadow-2xl text-white mb-6 relative overflow-hidden border border-red-500/30">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-red-100 tracking-wider">
              {phoneNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="text-red-100 hover:text-white transition p-1"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-xs text-red-100 mb-1 font-medium">Số dư khả dụng</div>
        <div className="text-3xl font-black tracking-tight mb-5">
          {showBalance ? '52.450.000 đ' : '•••••••• đ'}
        </div>

        <div className="flex justify-between items-center text-xs pt-1 border-t border-white/15">
          <span className="font-bold tracking-wider text-red-100 uppercase">NGUYEN VAN BINH</span>
          <div className="flex items-center space-x-1 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đã xác thực SIM 4G</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions (Viettel Style) */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          type="button"
          onClick={handleStartTransfer}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#EE0033] text-white flex items-center justify-center shadow-lg shadow-red-600/25 group-hover:scale-105 transition">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mt-2 text-center">Chuyển tiền</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#1E2536] text-white flex items-center justify-center border border-[#2B354B] shadow-md group-hover:scale-105 transition">
            <Smartphone className="w-5 h-5 text-[#EE0033]" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-2 text-center">Nạp ĐT / 4G</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#1E2536] text-white flex items-center justify-center border border-[#2B354B] shadow-md group-hover:scale-105 transition">
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-2 text-center">Quét QR</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#1E2536] text-white flex items-center justify-center border border-[#2B354B] shadow-md group-hover:scale-105 transition">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-2 text-center">Nạp/Rút tiền</span>
        </button>
      </div>

      {/* Viettel Open Gateway Shield Card */}
      <div className="bg-[#141824] border border-[#232A3B] rounded-2xl p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-[#EE0033]/20 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#EE0033]" />
          </div>
          <h2 className="text-xs font-bold text-white">
            Bảo vệ chủ động bởi Viettel Open Gateway
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Mỗi khi thực hiện giao dịch chuyển tiền giá trị lớn, hệ thống sẽ tự động đối soát lịch sử tráo đổi SIM (SIM Swap Check) với nhà mạng Viettel để ngăn chặn triệt để gian lận chiếm đoạt tài khoản.
        </p>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3">Lịch sử giao dịch gần đây</h2>
        <div className="bg-[#141824] border border-[#232A3B] rounded-2xl divide-y divide-[#1E2536] overflow-hidden text-xs">
          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#EE0033]/15 text-[#EE0033] flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">Đăng ký gói Data 5G Viettel</div>
              <div className="text-[11px] text-slate-400">Hôm nay • 09:15</div>
            </div>
            <div className="font-bold text-[#EE0033]">-135.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">Nhận tiền từ MBBank</div>
              <div className="text-[11px] text-slate-400">Hôm qua • 15:30</div>
            </div>
            <div className="font-bold text-emerald-400">+5.000.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#EE0033]/15 text-[#EE0033] flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">Thanh toán cước Internet Viettel</div>
              <div className="text-[11px] text-slate-400">28/10/2026 • 10:00</div>
            </div>
            <div className="font-bold text-[#EE0033]">-350.000 đ</div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Transfer Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-30">
        <div className="w-full max-w-[430px] p-4 bg-[#0D1017]/95 border-t border-[#1F2430] backdrop-blur pointer-events-auto">
          <button
            type="button"
            onClick={handleStartTransfer}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 transition duration-150"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-sm font-bold">Chuyển tiền nhanh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
