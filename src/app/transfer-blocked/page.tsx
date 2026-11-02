'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, ScanFace, PhoneCall, CheckCircle, Loader2 } from 'lucide-react';
import { useMock } from '@/context/MockContext';

export default function TransferBlockedPage() {
  const router = useRouter();
  const { maxAgeHours } = useMock();

  const [ekycModalVisible, setEkycModalVisible] = useState(false);
  const [ekycScanning, setEkycScanning] = useState(false);

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

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-10 pb-16">
      {/* Alert Badge */}
      <div className="px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold mb-5 flex items-center space-x-1.5">
        <AlertTriangle className="w-4 h-4" />
        <span>CẢNH BÁO BẢO MẬT VIETTEL</span>
      </div>

      {/* Danger Icon */}
      <div className="w-20 h-20 rounded-full bg-[#EE0033] flex items-center justify-center text-white mb-4 shadow-xl shadow-red-600/30">
        <X className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-1.5 text-center">
        Giao dịch tạm thời bị khóa
      </h1>
      <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed mb-6">
        Viettel Open Gateway phát hiện thẻ SIM của bạn vừa được cấp lại hoặc thay đổi trong vòng {maxAgeHours} giờ qua.
      </p>

      {/* Risk Details Card */}
      <div className="w-full bg-[#141824] border border-[#EE0033]/30 rounded-3xl p-5 space-y-3.5 mb-6 text-xs">
        <div className="flex items-center space-x-2 text-[#EE0033] font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Chi tiết đối soát viễn thông:</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E2536]">
          <span className="text-slate-400">Trạng thái phôi SIM:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[11px]">
            swapped: true (Phát hiện đổi SIM)
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E2536]">
          <span className="text-slate-400">Thời điểm đổi SIM:</span>
          <span className="font-bold text-white">Cách đây 2 giờ</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Cơ chế bảo vệ:</span>
          <span className="text-slate-300">Yêu cầu xác thực sinh trắc học</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={handleStartEkyc}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] hover:to-[#A8001F] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 transition duration-150"
        >
          <ScanFace className="w-5 h-5" />
          <span className="text-sm font-bold">Xác thực khuôn mặt eKYC</span>
        </button>

        <button
          type="button"
          onClick={handleCallSupport}
          className="w-full flex items-center justify-center space-x-2 bg-[#1A2030] hover:bg-[#20283D] text-slate-200 font-bold py-3.5 px-4 rounded-2xl border border-[#2B354B] transition text-xs"
        >
          <PhoneCall className="w-4 h-4 text-[#EE0033]" />
          <span>Gọi Tổng đài Viettel: 1800 8098 (Miễn phí)</span>
        </button>

        <button
          type="button"
          onClick={() => router.replace('/dashboard')}
          className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition"
        >
          Quay về trang chủ
        </button>
      </div>

      {/* eKYC Facial Scan Modal */}
      {ekycModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#141824] border border-[#2B354B] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1">Xác thực sinh trắc học eKYC</h3>
            <p className="text-xs text-slate-400 mb-6">
              Vui lòng nhìn thẳng vào camera để xác minh khuôn mặt chính chủ
            </p>

            {/* Camera Viewport Simulation */}
            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-dashed border-[#EE0033] flex items-center justify-center bg-[#0B0E17] mb-6 overflow-hidden">
              {ekycScanning ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#EE0033]/20 via-transparent to-[#EE0033]/20 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-[#EE0033] animate-spin" />
                  <div className="absolute bottom-4 text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full">
                    Đang quét khuôn mặt...
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-emerald-400">Trùng khớp 99.8%</span>
                </div>
              )}
            </div>

            {!ekycScanning && (
              <button
                type="button"
                onClick={handleEkycCompleted}
                className="w-full bg-gradient-to-r from-[#EE0033] to-[#BA0024] hover:from-[#E0002F] text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-red-600/30"
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
