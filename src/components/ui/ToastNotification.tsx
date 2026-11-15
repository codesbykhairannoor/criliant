'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';

export interface ToastData {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#111726] p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200 select-none">
      <div className="p-2 rounded-xl flex-shrink-0 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : toast.type === 'warning' ? (
          <ShieldAlert className="w-5 h-5 text-amber-500" />
        ) : (
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
          {toast.title}
        </h5>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
