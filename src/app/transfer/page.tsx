'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';

export default function TransferPage() {
  const router = useRouter();

  const [recipientBank, setRecipientBank] = useState('Ngân hàng XYZ');
  const [recipientAccount, setRecipientAccount] = useState('9876543210');
  const [recipientName, setRecipientName] = useState('NGUYEN VAN B');
  const [amount, setAmount] = useState('50.000.000');
  const [message, setMessage] = useState('Thanh toan hop dong 10/2026');

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/transfer-check');
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-16">
      {/* Nav Header */}
      <div className="flex items-center justify-between py-2 border-b border-[#1E293B] -mx-5 px-5 mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#162032] border border-[#23324A] flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-100">Chuyển tiền</h1>
        <div className="w-9" />
      </div>

      {/* Flow Badge */}
      <div className="inline-flex self-start px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold mb-4">
        FLOW B2 • GIAO DỊCH GIÁ TRỊ LỚN
      </div>

      <form onSubmit={handleConfirmTransfer} className="space-y-4">
        {/* Nguồn tiền */}
        <div className="bg-[#162032] border border-[#23324A] rounded-2xl p-4 text-xs">
          <span className="text-slate-400 block mb-2 font-medium">Từ tài khoản nguồn:</span>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono font-bold text-slate-100 text-sm">
                1903 1481 0175 4241
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Khả dụng: <strong className="text-emerald-400 font-bold">182.450.000 đ</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin người nhận */}
        <div className="bg-[#162032] border border-[#23324A] rounded-2xl p-4 space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Ngân hàng thụ hưởng:</label>
            <input
              type="text"
              value={recipientBank}
              onChange={(e) => setRecipientBank(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Số tài khoản người nhận:</label>
            <input
              type="text"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Tên người nhận:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-100 font-bold uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Số tiền */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Số tiền chuyển (VND):</label>
            <div className="flex items-center bg-[#0F172A] border-2 border-blue-500 rounded-xl px-3 py-2 mb-2">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-slate-100 font-black text-xl focus:outline-none"
              />
              <span className="text-blue-400 font-bold ml-2">VND</span>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex space-x-2">
              {['10.000.000', '20.000.000', '50.000.000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                    amount === val
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Lời nhắn */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Nội dung chuyển tiền:</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cảnh báo SIM Swap */}
        <div className="flex items-start space-x-2.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            <h2 className="font-bold text-rose-400 mb-0.5">Chính sách an toàn bảo vệ tài khoản:</h2>
            Giao dịch trên 10 triệu sẽ kích hoạt kiểm tra <strong className="text-rose-400 font-bold">SIM Swap tự động</strong> với nhà mạng để phòng chống hành vi chiếm đoạt SIM nhận mã OTP.
          </div>
        </div>

        {/* Nút xác nhận */}
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-[#1E60E2] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99]"
        >
          <span>Xác nhận chuyển tiền</span>
          <ShieldCheck className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
