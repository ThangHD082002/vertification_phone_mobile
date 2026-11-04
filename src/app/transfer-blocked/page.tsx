'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, ScanFace, PhoneCall, CheckCircle, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function TransferBlockedPage() {
  const router = useRouter();
  const { phoneNumber, maxAgeHours } = useMock();

  const [activePhone, setActivePhone] = useState('0983 784 276');
  const [activeMaxAge, setActiveMaxAge] = useState(520);
  const [transferError, setTransferError] = useState<string | null>(null);

  const [ekycModalVisible, setEkycModalVisible] = useState(false);
  const [ekycScanning, setEkycScanning] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone =
        sessionStorage.getItem('telco_sim_check_phone') ||
        localStorage.getItem('telco_phone_number') ||
        phoneNumber ||
        '0983 784 276';
      const savedMaxAge = sessionStorage.getItem('telco_sim_check_maxage');
      const err = sessionStorage.getItem('telco_transfer_error');

      setActivePhone(savedPhone);
      if (savedMaxAge) setActiveMaxAge(parseInt(savedMaxAge, 10) || 520);
      else setActiveMaxAge(maxAgeHours || 520);
      setTransferError(err);
    }
  }, [phoneNumber, maxAgeHours]);

  const handleStartEkyc = () => {
    setEkycModalVisible(true);
    setEkycScanning(true);

    setTimeout(() => {
      setEkycScanning(false);
    }, 2200);
  };

  const handleEkycCompleted = () => {
    setEkycModalVisible(false);
    alert('Sinh trắc học hợp lệ: Xác thực khuôn mặt chính chủ thành công! Hệ thống đã mở khóa quyền giao dịch.');
    router.replace('/transfer-success');
  };

  const handleCallSupport = () => {
    alert('Đang kết nối tới Tổng đài hỗ trợ Viettel: 1800 8098 (Miễn phí 24/7)');
  };

  const handleRetry = () => {
    router.replace('/transfer');
  };

  // TRƯỜNG HỢP 1: LỖI KẾT NỐI / LỖI API VIETTEL (Fail-Secure)
  if (transferError) {
    return (
      <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16 bg-[#F4F6FA] text-slate-800">
        {/* Error Badge */}
        <div className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4 flex items-center space-x-1.5 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>LỖI ĐỐI SOÁT VIỄN THÔNG (FAIL-SECURE)</span>
        </div>

        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-amber-500/25">
          <X className="w-8 h-8 stroke-[3]" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">
          Giao dịch chưa thể thực hiện
        </h1>
        <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed mb-5">
          Hệ thống bảo vệ giao dịch không nhận được phản hồi an toàn từ dịch vụ đối soát SIM Viettel. Nhằm bảo vệ tài khoản của bạn, lệnh chuyển tiền tạm thời được giữ lại.
        </p>

        {/* Error Details Card */}
        <div className="w-full bg-white border border-amber-200 rounded-3xl p-5 space-y-3 mb-6 text-xs shadow-sm">
          <div className="flex items-center space-x-2 text-amber-700 font-bold border-b border-slate-100 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Chi tiết lỗi ghi nhận:</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
            <span className="text-slate-500">Số thuê bao kiểm tra:</span>
            <span className="font-bold text-slate-900 font-mono">{activePhone}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
            <span className="text-slate-500">Thời gian quét (maxAge):</span>
            <span className="font-semibold text-slate-800 font-mono">{activeMaxAge} giờ</span>
          </div>

          <div className="py-1 border-b border-slate-100">
            <span className="text-slate-500 block mb-1">Mã lỗi hệ thống:</span>
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-[11px] font-mono text-amber-900 break-words leading-relaxed">
              {transferError}
            </div>
          </div>

          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-500">Chính sách xử lý:</span>
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[10px] border border-red-100">
              Chặn an toàn (Fail-Secure)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-bold">Thử lại giao dịch</span>
          </button>

          <button
            type="button"
            onClick={handleCallSupport}
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl border border-slate-200 shadow-sm transition text-xs"
          >
            <PhoneCall className="w-4 h-4 text-[#EE0033]" />
            <span>Gọi Tổng đài Viettel: 1800 8098 (Miễn phí)</span>
          </button>

          <button
            type="button"
            onClick={() => router.replace('/dashboard')}
            className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-800 transition font-medium"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP 2: THỰC SỰ BỊ PHÁT HIỆN SIM SWAP (swapped: true)
  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16 bg-[#F4F6FA] text-slate-800">
      {/* Alert Badge */}
      <div className="px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-4 flex items-center space-x-1.5 shadow-sm">
        <AlertTriangle className="w-4 h-4 text-[#EE0033]" />
        <span>CẢNH BÁO BẢO MẬT VIETTEL</span>
      </div>

      {/* Danger Icon */}
      <div className="w-16 h-16 rounded-full bg-[#EE0033] flex items-center justify-center text-white mb-3 shadow-lg shadow-red-600/25">
        <X className="w-8 h-8 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
        Giao dịch tạm thời bị khóa
      </h1>
      <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed mb-5">
        Viettel Open Gateway phát hiện thẻ SIM của thuê bao <strong className="text-slate-800">{activePhone}</strong> vừa được cấp lại hoặc thay đổi trong vòng {activeMaxAge} giờ qua.
      </p>

      {/* Risk Details Card */}
      <div className="w-full bg-white border border-red-200 rounded-3xl p-5 space-y-3.5 mb-6 text-xs shadow-sm">
        <div className="flex items-center space-x-2 text-[#EE0033] font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Chi tiết đối soát viễn thông:</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Số thuê bao:</span>
          <span className="font-bold text-slate-900 font-mono">{activePhone}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Trạng thái phôi SIM:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[11px] border border-red-100">
            swapped: true (Phát hiện đổi SIM)
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500">Khoảng thời gian quét:</span>
          <span className="font-bold text-slate-900">{activeMaxAge} giờ qua</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500">Cơ chế bảo vệ:</span>
          <span className="text-slate-700 font-medium">Yêu cầu xác thực sinh trắc học eKYC</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={handleStartEkyc}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-red-600/20 transition duration-150"
        >
          <ScanFace className="w-5 h-5" />
          <span className="text-sm font-bold">Xác thực khuôn mặt eKYC</span>
        </button>

        <button
          type="button"
          onClick={handleCallSupport}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-2xl border border-slate-200 shadow-sm transition text-xs"
        >
          <PhoneCall className="w-4 h-4 text-[#EE0033]" />
          <span>Gọi Tổng đài Viettel: 1800 8098 (Miễn phí)</span>
        </button>

        <button
          type="button"
          onClick={() => router.replace('/dashboard')}
          className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-800 transition font-medium"
        >
          Quay về trang chủ
        </button>
      </div>

      {/* eKYC Facial Scan Modal */}
      {ekycModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">Xác thực sinh trắc học eKYC</h3>
            <p className="text-xs text-slate-500 mb-6">
              Vui lòng nhìn thẳng vào camera để xác minh khuôn mặt chính chủ
            </p>

            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-dashed border-[#EE0033] flex items-center justify-center bg-slate-50 mb-6 overflow-hidden">
              {ekycScanning ? (
                <>
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-[#EE0033] animate-spin" />
                  <div className="absolute bottom-4 text-[11px] font-bold text-white bg-black/70 px-3 py-1 rounded-full">
                    Đang quét khuôn mặt...
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-emerald-600">Trùng khớp 99.8%</span>
                </div>
              )}
            </div>

            {!ekycScanning && (
              <button
                type="button"
                onClick={handleEkycCompleted}
                className="w-full bg-gradient-to-r from-[#EE0033] to-[#BA0024] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md"
              >
                Mở khóa giao dịch & Tiếp tục
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
