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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-40 px-2 flex items-center justify-around transition-colors select-none">
      {/* 1. Feed */}
      <button
        type="button"
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] py-1 text-xs font-semibold transition-colors ${
          currentTab === 'feed'
            ? 'text-[#2563EB] dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" strokeWidth={currentTab === 'feed' ? 2.1 : 1.85} />
        <span>Feed</span>
      </button>

      {/* 2. Latihan & Daily */}
      <button
        type="button"
        onClick={() => onSelectTab('latihan')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] py-1 text-xs font-semibold transition-colors ${
          currentTab === 'latihan'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" strokeWidth={currentTab === 'latihan' ? 2.1 : 1.85} />
        <span>Latihan</span>
      </button>

      {/* 3. Arena */}
      <button
        type="button"
        onClick={() => onSelectTab('arena')}
        aria-label="Buka Arena Simulasi dan Kontes"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] py-1 text-xs font-semibold transition-colors ${
          currentTab === 'arena'
            ? 'text-[#2563EB] dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Swords className="w-5 h-5" strokeWidth={currentTab === 'arena' ? 2.1 : 1.85} />
        <span>Arena</span>
      </button>

      {/* 4. Bank Soal */}
      <button
        type="button"
        onClick={() => onSelectTab('bank')}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] py-1 text-xs font-semibold transition-colors ${
          currentTab === 'bank'
            ? 'text-[#2563EB] dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5" strokeWidth={currentTab === 'bank' ? 2.1 : 1.85} />
        <span>Bank</span>
      </button>

      {/* 5. Profile */}
      <button
        type="button"
        onClick={onOpenProfile}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] py-1 text-xs font-semibold transition-colors ${
          currentTab === 'profile'
            ? 'text-[#2563EB] dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <User className="w-5 h-5" strokeWidth={currentTab === 'profile' ? 2.1 : 1.85} />
        <span>Profil</span>
      </button>
    </nav>
  );
};
