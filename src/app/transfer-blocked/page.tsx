'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, ScanFace, PhoneCall, CheckCircle, Loader2 } from 'lucide-react';
import { useMock } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';

export default function TransferBlockedPage() {
  const router = useRouter();
  const { logs, maxAgeHours } = useMock();

  const [ekycModalVisible, setEkycModalVisible] = useState(false);
  const [ekycScanning, setEkycScanning] = useState(false);

  const simLog = logs.find((l) => l.endpoint.includes('sim-swap')) || logs[0];

  const handleStartEkyc = () => {
    setEkycModalVisible(true);
    setEkycScanning(true);

    setTimeout(() => {
      setEkycScanning(false);
    }, 2200);
  };

  const handleEkycCompleted = () => {
    setEkycModalVisible(false);
    alert('Sinh trắc học hợp lệ: Xác thực khuôn mặt chính chủ thành công! Ngân hàng đã mở khóa quyền giao dịch cho phiên này.');
    router.replace('/transfer-success');
  };

  const handleCallSupport = () => {
    alert('Tổng đài hỗ trợ: Đang kết nối tới đường dây nóng bảo mật: 1900 8198 (Miễn phí 24/7)');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-5 pt-8 pb-16">
      {/* Top Header */}
      <div className="w-full flex items-center justify-center py-2 mb-2">
        <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          CẢNH BÁO BẢO MẬT
        </h2>
      </div>

      {/* Badge Flow */}
      <div className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-bold mb-4">
        FLOW B5 • SIM SWAP DETECTED
      </div>

      {/* Danger Icon */}
      <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/30">
        <X className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl font-bold text-rose-500 mb-1.5 text-center">
        Giao dịch tạm bị khóa
      </h1>
      <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed mb-5">
        Hệ thống phát hiện thẻ SIM của bạn vừa được cấp lại hoặc tráo đổi trong vòng {maxAgeHours} giờ qua.
      </p>

      {/* Risk Details Card */}
      <div className="w-full bg-[#162032] border border-rose-500/30 rounded-2xl p-4 space-y-3 mb-3 text-xs">
        <div className="flex items-center space-x-1.5 text-rose-400 font-bold mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Thông tin kiểm tra viễn thông:</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Trạng thái đổi SIM:</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[11px]">
            swapped: true (Phát hiện đổi SIM)
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-[#1E293B]">
          <span className="text-slate-400">Thời điểm đổi SIM:</span>
          <span className="font-bold text-rose-400">Cách đây 2 giờ</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Nguy cơ bảo mật:</span>
          <span className="text-right text-slate-200">Chiếm đoạt SIM để chặn mã OTP</span>
        </div>
      </div>

      {/* Console Box */}
      <ConsoleBox log={simLog} defaultTitle="POST /sim-swap/v0/check (200 OK - swapped: true)" />

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 mt-2">
        <button
          type="button"
          onClick={handleStartEkyc}
          className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-600/30 transition transform active:scale-[0.99]"
        >
          <ScanFace className="w-4 h-4" />
          <span>Xác thực khuôn mặt (eKYC)</span>
        </button>

        <button
          type="button"
          onClick={handleCallSupport}
          className="w-full flex items-center justify-center space-x-2 py-2.5 text-sky-400 hover:text-sky-300 font-semibold text-xs transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Gọi tổng đài hỗ trợ 1900 8198</span>
        </button>

        <button
          type="button"
          onClick={() => router.replace('/dashboard')}
          className="w-full text-center text-xs text-slate-400 hover:text-slate-200 underline transition py-1"
        >
          Hủy và quay về trang chủ
        </button>
      </div>

      {/* FaceID / eKYC Modal */}
      {ekycModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#162032] border border-[#23324A] rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center">
            {/* Camera Viewport Target */}
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-blue-500 bg-blue-500/5 flex flex-col items-center justify-center mb-4">
              {ekycScanning ? (
                <>
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-2" />
                  <span className="text-xs text-blue-300 font-semibold">Đang phân tích...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-12 h-12 text-emerald-400 mb-1" />
                  <span className="text-xs text-emerald-400 font-bold">Khớp 99.8%</span>
                </>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              {ekycScanning ? 'Vui lòng giữ thẳng khuôn mặt' : 'Xác thực sinh trắc học thành công'}
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {ekycScanning
                ? 'Camera trước đang đối soát dữ liệu CCCD gắn chip với cơ sở dữ liệu định danh.'
                : 'Đã xác nhận chính chủ thuê bao. Giao dịch chuyển tiền sẽ được phê duyệt.'}
            </p>

            {!ekycScanning ? (
              <button
                type="button"
                onClick={handleEkycCompleted}
                className="w-full py-3 bg-[#1E60E2] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition"
              >
                Hoàn tất & Tiếp tục giao dịch
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEkycModalVisible(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

