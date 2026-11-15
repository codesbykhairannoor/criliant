'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatusPill: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    // 1. Initial status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    // 2. Register Service Worker in production/client
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 3. Network listeners
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredNotice) return null;

  return (
    <aside
      aria-label="Status koneksi jaringan"
      className={`fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-[100] px-3.5 py-1.5 rounded-full shadow-xl backdrop-blur-md text-[11px] font-black flex items-center gap-2 border transition-all animate-in slide-in-from-top-2 duration-300 pointer-events-none select-none max-w-[92vw] truncate text-white ${
        !isOnline
          ? 'bg-amber-500/95 dark:bg-amber-600/95 border-amber-300 dark:border-amber-400 shadow-amber-500/20'
          : 'bg-emerald-600/95 dark:bg-emerald-700/95 border-emerald-400 dark:border-emerald-500 shadow-emerald-500/20'
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span className="truncate">Mode Offline Aktif — Bank soal & riwayat tersimpan tetap lancar</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
          <span>Koneksi Pulih — Data tersinkronisasi</span>
        </>
      )}
    </aside>
  );
};
