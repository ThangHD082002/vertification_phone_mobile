'use client';

import { useMock } from '@/context/MockContext';
import { ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function TransferPage() {
  const router = useRouter();
  const { phoneNumber } = useMock();

  const activePhone =
    phoneNumber ||
    (typeof window !== 'undefined' ? localStorage.getItem('telco_phone_number') || sessionStorage.getItem('telco_phone_number') : '') ||
    '0983 784 276';

  const [recipientBank, setRecipientBank] = useState('MB - Ngân hàng Quân Đội');
  const [recipientAccount, setRecipientAccount] = useState('0988 888 999');
  const [recipientName, setRecipientName] = useState('NGUYỄN THỊ MAI');
  const [amount, setAmount] = useState('20.000.000');
  const [message, setMessage] = useState('Chuyen tien hop dong');

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/transfer-check');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Nav Header */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200/80 -mx-5 px-5 mb-4 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">Chuyển tiền nhanh</h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleConfirmTransfer} className="space-y-4">
        {/* Nguồn tiền Viettel Silent */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-xs shadow-sm">
          <span className="text-slate-500 block mb-2 font-medium">Nguồn tiền trích nợ:</span>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EE0033] to-[#BA0024] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono font-bold text-slate-900 text-sm">
                Viettel Silent ({activePhone})
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Khả dụng: <strong className="text-emerald-600 font-bold">52.450.000 đ</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin người nhận */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 text-xs shadow-sm">
          <div>
            <label className="text-slate-600 block mb-1 font-medium">Ngân hàng thụ hưởng:</label>
            <input
              type="text"
              value={recipientBank}
              onChange={(e) => setRecipientBank(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#EE0033] text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-medium">Số tài khoản / Số điện thoại:</label>
            <input
              type="text"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:border-[#EE0033]"
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-medium">Tên người nhận:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold uppercase focus:bg-white focus:outline-none focus:border-[#EE0033]"
            />
          </div>

          {/* Số tiền */}
          <div>
            <label className="text-slate-600 block mb-1 font-medium">Số tiền chuyển (VND):</label>
            <div className="flex items-center bg-slate-50 border-2 border-[#EE0033] rounded-xl px-3.5 py-2.5 mb-2 focus-within:bg-white">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-slate-900 font-black text-xl focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-500 ml-2">VND</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Phí chuyển tiền: <strong className="text-emerald-600">Miễn phí 100%</strong>
            </div>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-medium">Lời nhắn:</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#EE0033]"
            />
          </div>
        </div>

        {/* Security Info Card */}
        <div className="flex items-start space-x-2.5 bg-red-50 border border-red-100 rounded-2xl p-3.5 text-xs text-slate-700 shadow-sm">
          <Lock className="w-4 h-4 text-[#EE0033] mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Giao dịch chuyển tiền được kiểm soát an toàn bởi <strong>Viettel Open Gateway SIM Swap Protection</strong>. Hệ thống tự động phát hiện mọi bất thường về tráo đổi SIM trước khi duyệt lệnh chuyển tiền.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-bold">Xác nhận chuyển tiền</span>
        </button>
      </form>
    </div>
  );
}
