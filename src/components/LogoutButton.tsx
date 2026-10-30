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
        className={`w-full flex items-center justify-center space-x-2 border-1.5 border-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl py-3 text-sm font-bold transition ${className}`}
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
        className={`flex items-center justify-center space-x-1 py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold underline ${className}`}
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
      className={`flex items-center space-x-1 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-400 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{label || 'Đăng xuất'}</span>
    </button>
  );
}

