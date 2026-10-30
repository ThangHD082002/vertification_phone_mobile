'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { DevModal } from './DevModal';
import { useMock } from '../context/MockContext';

export function DevFloatingButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { developerMode, activeTestCase } = useMock();

  if (!developerMode) return null;

  return (
    <>
      <div className="fixed bottom-6 right-4 sm:right-[max(1rem,calc(50%-200px))] z-40">
        <button
          type="button"
          onClick={() => setModalVisible(true)}
          className="flex items-center space-x-1.5 bg-[#1E60E2] hover:bg-[#2563EB] text-white px-3 py-2 rounded-full shadow-lg border border-[#60A5FA] text-xs font-bold transition-all transform hover:scale-105 active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow" />
          <span>DEV: {activeTestCase ? activeTestCase.code : 'CUSTOM'}</span>
        </button>
      </div>

      <DevModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

