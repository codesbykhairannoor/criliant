'use client';

import React from 'react';
import { Home, BookOpen, Swords, Bookmark, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onStartExam: (modeId: string) => void;
  onOpenEditProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onStartExam,
  onOpenEditProfile,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-t border-[#EFF3F4] dark:border-[#1E293B] z-40 px-4 flex items-center justify-around transition-colors">
      {/* 1. Feed */}
      <button
        onClick={() => setCurrentTab('feed')}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${currentTab === 'feed' ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
          }`}
      >
        <Home className="w-5 h-5" />
        <span>Feed</span>
      </button>

      {/* 2. Bank Soal */}
      <button
        onClick={() => setCurrentTab('bank')}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${currentTab === 'bank' ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
          }`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Bank Soal</span>
      </button>

      {/* 3. Center Elevated Button: Tryout */}
      <div className="-mt-6">
        <button
          onClick={() => setCurrentTab('arena')}
          className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/35 border-4 border-white dark:border-[#0B0F19] active:scale-95 transition-transform"
        >
          <Swords className="w-6 h-6" />
        </button>
      </div>

      {/* 4. Bookmarks */}
      <button
        onClick={() => setCurrentTab('bookmarks')}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${currentTab === 'bookmarks' ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
          }`}
      >
        <Bookmark className="w-5 h-5" />
        <span>Simpan</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={onOpenEditProfile}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${currentTab === 'profile' ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white'
          }`}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </button>
    </nav>
  );
};
