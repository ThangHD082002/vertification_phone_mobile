'use client';

import { LogoutButton } from '@/components/LogoutButton';
import { useMock } from '@/context/MockContext';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  QrCode,
  Send,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();
  const [showBalance, setShowBalance] = useState(true);

  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  const handleStartTransfer = () => {
    router.push('/transfer');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-28 bg-[#F4F6FA] text-slate-800">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-5 pt-2">
        <div className="flex items-center space-x-3">
          {/* Avatar Viettel */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EE0033] to-[#BA0024] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-red-600/20">
            NB
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Tài khoản Viettel Silent</span>
            <span className="text-base font-bold text-slate-900 tracking-tight">Nguyễn Văn Bình</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <LogoutButton variant="header" />
        </div>
      </div>

      {/* Viettel Silent Account Card (Iconic Viettel Red Card) */}
      <div className="bg-gradient-to-br from-[#EE0033] via-[#D80027] to-[#99001D] rounded-3xl p-5 shadow-lg shadow-red-500/20 text-white mb-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-red-100 tracking-wider">
              {activePhone}
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

        <div className="flex justify-between items-center text-xs pt-1 border-t border-white/20">
          <span className="font-bold tracking-wider text-red-100 uppercase">NGUYEN VAN BINH</span>
          <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đã xác thực SIM 4G</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions (Viettel Style Light Theme) */}
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <button
          type="button"
          onClick={handleStartTransfer}
          className="flex flex-col items-center group"
        >
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#EE0033] text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 mt-2 text-center">Chuyển tiền</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-white text-slate-800 flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:scale-105 transition">
            <Smartphone className="w-5 h-5 text-[#EE0033]" />
          </div>
          <span className="text-[11px] font-medium text-slate-600 mt-2 text-center">Nạp ĐT / 4G</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-white text-slate-800 flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:scale-105 transition">
            <QrCode className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] font-medium text-slate-600 mt-2 text-center">Quét QR</span>
        </button>

        <button type="button" className="flex flex-col items-center group">
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-white text-slate-800 flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:scale-105 transition">
            <Wallet className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] font-medium text-slate-600 mt-2 text-center">Nạp/Rút tiền</span>
        </button>
      </div>

      {/* Viettel Open Gateway Shield Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#EE0033]" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">
            Bảo vệ chủ động bởi Viettel Open Gateway
          </h2>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Mỗi khi thực hiện giao dịch chuyển tiền giá trị lớn, hệ thống sẽ tự động đối soát lịch sử tráo đổi SIM (SIM Swap Check) với nhà mạng Viettel để ngăn chặn triệt để gian lận chiếm đoạt tài khoản.
        </p>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Lịch sử giao dịch gần đây</h2>
        <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs shadow-sm">
          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#EE0033] flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 truncate">Đăng ký gói Data 5G Viettel</div>
              <div className="text-[11px] text-slate-400">Hôm nay • 09:15</div>
            </div>
            <div className="font-bold text-[#EE0033]">-135.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 truncate">Nhận tiền từ MBBank</div>
              <div className="text-[11px] text-slate-400">Hôm qua • 15:30</div>
            </div>
            <div className="font-bold text-emerald-600">+5.000.000 đ</div>
          </div>

          <div className="flex items-center p-3.5 space-x-3">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#EE0033] flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 truncate">Thanh toán cước Internet Viettel</div>
              <div className="text-[11px] text-slate-400">28/10/2026 • 10:00</div>
            </div>
            <div className="font-bold text-[#EE0033]">-350.000 đ</div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Transfer Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-30">
        <div className="w-full max-w-[430px] p-4 bg-white/95 border-t border-slate-200 backdrop-blur pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={handleStartTransfer}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-sm font-bold">Chuyển tiền nhanh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
