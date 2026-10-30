'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Moon, Sun, Server, Cpu, Trash2 } from 'lucide-react';
import { useMock, DEFAULT_TEST_CASES } from '@/context/MockContext';
import { ConsoleBox } from '@/components/ConsoleBox';

export default function DevPanelPage() {
  const router = useRouter();
  const {
    themeMode,
    toggleTheme,
    activeTestCase,
    applyTestCase,
    logs,
    clearLogs,
    backendUrl,
    useRealBackend,
  } = useMock();

  return (
    <div className="flex-1 flex flex-col p-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-[#1E293B] -mx-5 px-5 mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#162032] border border-[#23324A] flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
          Dev Panel & Test Cases
        </h1>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          {themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Backend Status Banner */}
      <div
        className={`p-3 rounded-xl border mb-5 text-xs ${
          useRealBackend
            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}
      >
        <div className="flex items-center space-x-2 font-bold mb-1">
          {useRealBackend ? <Server className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
          <span>{useRealBackend ? 'Backend Mode: Connected to Spring Boot' : 'Offline Mock Mode (In-Memory Simulator)'}</span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">Endpoint: {backendUrl}</div>
      </div>

      {/* Test Cases Matrix */}
      <h2 className="text-sm font-bold text-slate-100 mb-1">
        Bảng ma trận kịch bản (Figma Matrix)
      </h2>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Chọn bất kỳ test case nào dưới đây để nạp tự động thông số số điện thoại, trạng thái kết nối mạng và lịch sử đổi SIM:
      </p>

      <div className="space-y-3 mb-6">
        {DEFAULT_TEST_CASES.map((tc) => {
          const isSelected = activeTestCase?.id === tc.id;
          return (
            <div
              key={tc.id}
              onClick={() => {
                applyTestCase(tc);
                router.replace('/');
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition text-xs ${
                isSelected
                  ? 'bg-[#1E293B] border-blue-400 shadow-md'
                  : 'bg-[#162032] border-[#23324A] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                    tc.badge === 'RISK'
                      ? 'bg-rose-600'
                      : tc.badge === 'FALLBACK'
                      ? 'bg-amber-600'
                      : 'bg-blue-600'
                  }`}
                >
                  {tc.code}
                </span>
                <span className="font-bold text-slate-100 flex-1">{tc.title}</span>
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                {tc.description}
              </p>

              <div className="flex items-center text-[11px] mb-1">
                <span className="text-slate-400 w-16">Số ĐT test:</span>
                <span className="font-mono font-bold text-blue-400">{tc.phoneNumber}</span>
              </div>

              <div className="flex items-start text-[11px] mb-2.5">
                <span className="text-slate-400 w-16 shrink-0">Kỳ vọng:</span>
                <span
                  className={`font-semibold ${
                    tc.badge === 'RISK' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {tc.expectedResult}
                </span>
              </div>

              <div
                className={`py-1.5 text-center rounded-lg text-[11px] font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                {isSelected ? '✓ Kịch bản đang hoạt động' : 'Bấm để nạp kịch bản này & quay về Login'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lịch sử API Logs */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-slate-100">
          Lịch sử gọi Telco Network API ({logs.length})
        </h2>
        {logs.length > 0 && (
          <button
            type="button"
            onClick={clearLogs}
            className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa log</span>
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          Chưa có lượt gọi API nào. Hãy thực hiện đăng nhập hoặc chuyển tiền để xem log.
        </p>
      ) : (
        <div className="space-y-2">
          {logs.slice(0, 5).map((l) => (
            <ConsoleBox key={l.id} log={l} />
          ))}
        </div>
      )}
    </div>
  );
}
