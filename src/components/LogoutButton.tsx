'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'header' | 'button' | 'text';
  label?: string;
  className?: string;
}

export function LogoutButton({ variant = 'header', label, className = '' }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={`w-full flex items-center justify-center space-x-2 border border-red-200 bg-red-50 hover:bg-red-100 text-[#EE0033] rounded-2xl py-3 text-sm font-bold transition shadow-sm ${className}`}
      >
        <LogOut className="w-4 h-4" />
        <span>{label || 'Đăng xuất'}</span>
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={`flex items-center justify-center space-x-1 py-2 text-[#EE0033] hover:underline text-xs font-semibold ${className}`}
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{label || 'Đăng xuất về màn Đăng nhập'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center space-x-1 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-[#EE0033] px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{label || 'Đăng xuất'}</span>
    </button>
  );
}
