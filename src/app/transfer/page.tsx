'use client';

import { useMock } from '@/context/MockContext';
import { AlertCircle, ArrowLeft, CreditCard, Lock, Radio, ShieldCheck } from 'lucide-react';
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

  // Module kiểm tra SIM Swap: Cố định đầu +84, chỉ lưu các chữ số thuê bao phía sau
  const [phoneDigits, setPhoneDigits] = useState('368682926');
  const [maxAge, setMaxAge] = useState<number>(600);
  const [validationError, setValidationError] = useState<string>('');

  const handlePhoneDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    // Nếu người dùng gõ hoặc paste số bắt đầu bằng 84 (ví dụ 84368682926) hoặc 0 (ví dụ 0339046482)
    if (val.startsWith('84') && val.length > 9) {
      val = val.slice(2);
    } else if (val.startsWith('0')) {
      val = val.slice(1);
    }
    setPhoneDigits(val);
    if (validationError) setValidationError('');
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneDigits.trim()) {
      setValidationError('Vui lòng nhập số điện thoại cần kiểm tra SIM Swap');
      return;
    }

    if (phoneDigits.trim().length < 8) {
      setValidationError('Số điện thoại không hợp lệ (phải có ít nhất 9 chữ số)');
      return;
    }

    if (!maxAge || maxAge <= 0) {
      setValidationError('Vui lòng chọn hoặc nhập thời gian kiểm tra (maxAge) lớn hơn 0');
      return;
    }

    // Format chuẩn Viettel Open Gateway: +84xxxxxxxxx (VD: +84368682926)
    const formattedPhone = `+84${phoneDigits.trim()}`;

    // Lưu thông số vào sessionStorage để màn transfer-check sử dụng trực tiếp
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('telco_sim_check_phone', formattedPhone);
      sessionStorage.setItem('telco_sim_check_maxage', String(maxAge));
      sessionStorage.removeItem('telco_transfer_error');
    }

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
                Tài khoản thanh toán ({activePhone})
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

        {/* MODULE KIỂM TRA SIM SWAP BẮT BUỘC - VIETTEL OPEN GATEWAY */}
        <div className="bg-white border-2 border-red-100 rounded-2xl p-4 space-y-3.5 text-xs shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-[#EE0033] font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Kiểm soát rủi ro viễn thông (SIM Swap Check)</span>
            </div>
            <span className="inline-flex items-center justify-center whitespace-nowrap text-[10px] bg-red-50 text-[#EE0033] px-2 py-0.5 rounded-full font-bold border border-red-100">
              Bắt buộc
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Hệ thống sẽ đối soát trực tiếp với cơ sở dữ liệu hạ tầng mạng Viettel theo số thuê bao và khoảng thời gian bên dưới trước khi duyệt lệnh chuyển tiền.
          </p>

          {/* SĐT kiểm tra với đầu +84 cố định */}
          <div>
            <label className="text-slate-700 block mb-1 font-semibold flex items-center justify-between">
              <span>Số điện thoại kiểm tra SIM Swap:</span>
              <span className="text-[10px] text-red-500 font-bold">* Bắt buộc</span>
            </label>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-[#EE0033] focus-within:ring-1 focus-within:ring-[#EE0033]/20 transition overflow-hidden">
              {/* Prefix +84 cố định */}
              <div className="flex items-center space-x-1.5 px-3 py-2.5 bg-slate-100 border-r border-slate-200 text-slate-800 font-mono font-bold text-sm shrink-0 select-none">
                <span className="w-2 h-2 rounded-full bg-[#EE0033]" />
                <span className="text-[#EE0033] font-bold">+84</span>
              </div>

              {/* Input các chữ số sau +84 */}
              <input
                type="tel"
                value={phoneDigits}
                onChange={handlePhoneDigitsChange}
                placeholder="368682926 hoặc 0339046482"
                className="w-full bg-transparent px-3 py-2.5 text-slate-900 font-mono text-sm font-bold focus:outline-none tracking-wide"
              />
            </div>
          </div>

          {/* maxAge & Presets */}
          <div>
            <label className="text-slate-700 block mb-1.5 font-semibold flex items-center justify-between">
              <span>Thời gian quét lịch sử đổi SIM (maxAge):</span>
              <span className="text-[10px] text-red-500 font-bold">* Bắt buộc</span>
            </label>

            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              {[24, 48, 520, 600].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => {
                    setMaxAge(hours);
                    if (validationError) setValidationError('');
                  }}
                  className={`py-1.5 px-1 rounded-xl text-center font-bold text-[11px] transition border ${maxAge === hours
                    ? 'bg-[#EE0033] text-white border-[#EE0033] shadow-sm shadow-red-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {hours === 600 ? '600h (Test)' : hours === 520 ? '520h (Chuẩn)' : `${hours}h`}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[11px] shrink-0">Hoặc tự nhập:</span>
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-[#EE0033]">
                <input
                  type="number"
                  min={1}
                  max={8760}
                  value={maxAge || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setMaxAge(isNaN(val) ? 0 : val);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full bg-transparent text-slate-900 font-mono font-bold text-xs focus:outline-none"
                  placeholder="Nhập số giờ"
                />
                <span className="text-slate-500 text-[11px] font-bold ml-1">giờ</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * Truy vấn ngược thời gian từ HLR/AUC Viettel (600 giờ tương đương 25 ngày).
            </p>
          </div>

          {validationError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
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
