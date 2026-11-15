'use client';

import React from 'react';
import { Home, BookOpen, Swords, Flame, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  bankInitialGroup?: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  bankInitialGroup = 'SEMUA',
  onSelectTab,
  onOpenProfile,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-t border-[#EFF3F4] dark:border-[#1E293B] z-40 px-2 flex items-center justify-around transition-colors select-none">
      {/* 1. Feed */}
      <button
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-[10px] font-bold transition-colors ${
          currentTab === 'feed'
            ? 'text-[#2563EB] dark:text-[#38BDF8]'
            : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Feed</span>
      </button>

      {/* 2. Latihan & Daily */}
      <button
        onClick={() => onSelectTab('latihan')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-[10px] font-bold transition-colors ${
          currentTab === 'latihan'
            ? 'text-amber-500 dark:text-amber-400'
            : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span>Latihan</span>
      </button>

      {/* 3. Center Elevated Button: Arena */}
      <div className="flex flex-col items-center -mt-5">
        <button
          onClick={() => onSelectTab('arena')}
          aria-label="Buka Arena Simulasi dan Kontes"
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[#0B0F19] active:scale-95 transition-all ${
            currentTab === 'arena'
              ? 'bg-indigo-600 text-white shadow-indigo-500/40'
              : 'bg-[#2563EB] text-white shadow-blue-500/35'
          }`}
        >
          <Swords className="w-5 h-5" />
        </button>
        <span
          className={`text-[10px] font-bold mt-0.5 ${
            currentTab === 'arena'
              ? 'text-[#2563EB] dark:text-[#38BDF8]'
              : 'text-[#536471] dark:text-slate-400'
          }`}
        >
          Arena
        </span>
      </div>

      {/* 4. Bank Soal */}
      <button
        onClick={() => onSelectTab('bank')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-[10px] font-bold transition-colors ${
          currentTab === 'bank'
            ? 'text-[#2563EB] dark:text-[#38BDF8]'
            : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Bank Soal</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={onOpenProfile}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 text-[10px] font-bold transition-colors ${
          currentTab === 'profile'
            ? 'text-[#2563EB] dark:text-[#38BDF8]'
            : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </button>
    </nav>
  );
};
