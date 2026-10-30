'use client';

import React, { useState } from 'react';
import { Wrench, X, Moon, Sun, Trash2, Server, Check } from 'lucide-react';
import { useMock, DEFAULT_TEST_CASES } from '../context/MockContext';
import { VerificationScenario, SimSwapScenario } from '../types';

interface DevModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DevModal({ visible, onClose }: DevModalProps) {
  const {
    phoneNumber,
    setPhoneNumber,
    verifyScenario,
    setVerifyScenario,
    simSwapScenario,
    setSimSwapScenario,
    maxAgeHours,
    setMaxAgeHours,
    developerMode,
    setDeveloperMode,
    themeMode,
    toggleTheme,
    activeTestCase,
    applyTestCase,
    backendUrl,
    setBackendUrl,
    useRealBackend,
    setUseRealBackend,
    clearLogs,
  } = useMock();

  const [activeTab, setActiveTab] = useState<'CONTROLLER' | 'MATRIX'>('CONTROLLER');

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#162032] border border-[#23324A] rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E293B] bg-[#0B1324]">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-100">
              Dev Panel & Test Cases
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#1E293B] bg-[#0F172A] px-3">
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'CONTROLLER'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('CONTROLLER')}
          >
            C1. Mock Controller
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'MATRIX'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('MATRIX')}
          >
            C2. Ma trận 6 Test Cases
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'CONTROLLER' && (
            <>
              {/* Dev Mode toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-slate-200">Chế độ Developer (Hiển thị log):</span>
                <button
                  type="button"
                  onClick={() => setDeveloperMode(!developerMode)}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition ${
                    developerMode ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {developerMode ? 'BẬT' : 'TẮT'}
                </button>
              </div>

              {/* Real Backend toggle */}
              <div className="flex items-center justify-between py-1 border-t border-[#1E293B] pt-3">
                <div>
                  <div className="font-medium text-slate-200">Kết nối Backend thật (:8088):</div>
                  <div className="text-[11px] text-slate-400">Gọi API Spring Boot thực tế</div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseRealBackend(!useRealBackend)}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition ${
                    useRealBackend ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {useRealBackend ? 'BẬT' : 'TẮT'}
                </button>
              </div>

              {useRealBackend && (
                <div className="space-y-1 bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B]">
                  <label className="text-[11px] text-slate-400 block font-medium">
                    Địa chỉ Backend Spring Boot:
                  </label>
                  <input
                    type="text"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="http://localhost:8088/api/v1"
                    className="w-full bg-[#05080F] border border-[#23324A] rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Theme toggle */}
              <div className="flex items-center justify-between py-1 border-t border-[#1E293B] pt-3">
                <span className="font-medium text-slate-200">Giao diện (Theme):</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1E293B] rounded-lg text-slate-200 hover:bg-[#283952] transition"
                >
                  {themeMode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              {/* SĐT test */}
              <div className="space-y-1.5 border-t border-[#1E293B] pt-3">
                <label className="font-medium text-slate-200 block">Số điện thoại kiểm thử:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="098 765 4321"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Kịch bản Number Verification */}
              <div className="space-y-1.5 border-t border-[#1E293B] pt-3">
                <label className="font-medium text-slate-200 block">Kịch bản Number Verification:</label>
                <div className="flex flex-wrap gap-2">
                  {(['SUCCESS', 'FAIL', 'TIMEOUT'] as VerificationScenario[]).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setVerifyScenario(sc)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                        verifyScenario === sc
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-[#0F172A] text-slate-300 border-[#334155] hover:bg-[#1E293B]'
                      }`}
                    >
                      {sc === 'SUCCESS' ? '✓ Thành công (4G On-Net)' : sc === 'FAIL' ? '✕ Thất bại (Wifi / OTP)' : '⏱ Timeout (504)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kịch bản SIM Swap */}
              <div className="space-y-1.5 border-t border-[#1E293B] pt-3">
                <label className="font-medium text-slate-200 block">Kịch bản SIM Swap (Đổi SIM):</label>
                <div className="flex flex-wrap gap-2">
                  {(['SAFE', 'SWAPPED_RECENT', 'SWAPPED_OLD', 'ERROR'] as SimSwapScenario[]).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setSimSwapScenario(sc)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                        simSwapScenario === sc
                          ? sc === 'SWAPPED_RECENT'
                            ? 'bg-rose-600 text-white border-rose-400 font-bold'
                            : 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-[#0F172A] text-slate-300 border-[#334155] hover:bg-[#1E293B]'
                      }`}
                    >
                      {sc === 'SAFE'
                        ? '✓ SIM an toàn (>1 năm)'
                        : sc === 'SWAPPED_RECENT'
                        ? '⚠️ Vừa đổi SIM 2h (Rủi ro)'
                        : sc === 'SWAPPED_OLD'
                        ? '✓ Đổi 50h trước (Ngoài 48h)'
                        : '✕ Lỗi HLR 500'}
                    </button>
                  ))}
                </div>
              </div>

              {/* maxAge Hours */}
              <div className="space-y-1.5 border-t border-[#1E293B] pt-3">
                <label className="font-medium text-slate-200 block">
                  Ngưỡng quét rủi ro (maxAge): {maxAgeHours} giờ
                </label>
                <div className="flex gap-2">
                  {[24, 48, 72].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setMaxAgeHours(hours)}
                      className={`px-4 py-1.5 rounded-lg border transition ${
                        maxAgeHours === hours
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-[#0F172A] text-slate-300 border-[#334155] hover:bg-[#1E293B]'
                      }`}
                    >
                      {hours} giờ
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear logs */}
              <div className="border-t border-[#1E293B] pt-3">
                <button
                  type="button"
                  onClick={clearLogs}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa lịch sử log API</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'MATRIX' && (
            <div className="space-y-3">
              {DEFAULT_TEST_CASES.map((item) => {
                const isSelected = activeTestCase?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      applyTestCase(item);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#1E293B] border-blue-400'
                        : 'bg-[#0F172A] border-[#23324A] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                        {item.code}
                      </span>
                      <span className="font-bold text-slate-100 flex-1">{item.title}</span>
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="flex items-center text-[11px] mb-1">
                      <span className="text-slate-400 w-16">SĐT Test:</span>
                      <span className="font-mono font-bold text-blue-400">{item.phoneNumber}</span>
                    </div>

                    <div className="flex items-start text-[11px] mb-2">
                      <span className="text-slate-400 w-16 shrink-0">Kỳ vọng:</span>
                      <span
                        className={`font-semibold ${
                          item.badge === 'RISK' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.expectedResult}
                      </span>
                    </div>

                    <div className="text-center py-1 bg-blue-500/10 text-blue-400 rounded text-[11px] font-semibold">
                      {isSelected ? '✓ Đang kích hoạt' : 'Bấm để nạp kịch bản này'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B1324]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition text-sm"
          >
            Áp dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
