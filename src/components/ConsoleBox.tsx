'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ApiLog } from '../types';

interface ConsoleBoxProps {
  log?: ApiLog | null;
  defaultTitle?: string;
  isPending?: boolean;
  pendingText?: string;
}

export function ConsoleBox({
  log,
  defaultTitle = 'Network API Inspection',
  isPending = false,
  pendingText = 'POST /number-verification/v0/verify...',
}: ConsoleBoxProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-[#05080F] rounded-xl border border-[#1E293B] overflow-hidden my-3 w-full shadow-lg">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0B1324] border-b border-[#1E293B] text-left hover:bg-[#131D33] transition-colors"
      >
        <div className="flex items-center min-w-0 flex-1">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] mr-2 shrink-0 animate-pulse" />
          <span className="text-slate-200 text-xs font-mono font-semibold truncate">
            {log ? `${log.method} ${log.endpoint}` : defaultTitle}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-2">
          {log && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                log.statusCode === 200
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {log.statusText}
            </span>
          )}
          {collapsed ? (
            <ChevronDown size={14} className="text-slate-400" />
          ) : (
            <ChevronUp size={14} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Terminal Body */}
      {!collapsed && (
        <div className="p-3 text-left font-mono text-xs overflow-x-auto">
          {isPending ? (
            <div className="text-amber-400 leading-relaxed whitespace-pre-wrap">
              {`> ${pendingText}`}
              {'\n'}<span className="text-slate-400 text-[11px]">[Connecting to Telco P-GW / UDM Core...]</span>
            </div>
          ) : log ? (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">
                HOST: {log.url.split('/')[2] || 'telco-gateway'} {' '}|{' '} {log.durationMs}ms
              </div>

              {/* Request */}
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  -- REQUEST BODY --
                </div>
                <pre className="text-slate-200 text-xs bg-[#090D18] p-2 rounded border border-[#1E293B] overflow-x-auto">
                  {JSON.stringify(log.requestPayload, null, 2)}
                </pre>
              </div>

              {/* Response */}
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  -- RESPONSE ({log.statusCode}) --
                </div>
                <pre
                  className={`text-xs p-2 rounded border overflow-x-auto ${
                    log.statusCode === 200
                      ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                      : 'text-rose-400 bg-rose-950/20 border-rose-900/40'
                  }`}
                >
                  {JSON.stringify(log.responsePayload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 italic text-xs">
              Chưa có bản tin Network API nào được gọi.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
