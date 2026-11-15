'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Sun, Moon, X, LogIn } from 'lucide-react';
import { StudyTrack, UserProfile } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface MobileTopHeaderProps {
  activeTrack: StudyTrack;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userProfile: UserProfile | null;
  onOpenAuthModal: (reason?: AuthTriggerReason) => void;
  onOpenProfile: () => void;
  onGoHome: () => void;
}

export const MobileTopHeader: React.FC<MobileTopHeaderProps> = ({
  activeTrack,
  searchQuery,
  onSearchChange,
  userProfile,
  onOpenAuthModal,
  onOpenProfile,
  onGoHome,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#EFF3F4] dark:border-[#1E293B] px-3 py-2.5 transition-colors select-none">
      {isSearchOpen ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Cari materi ${activeTrack.toUpperCase()}...`}
              className="w-full pl-9 pr-8 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              onSearchChange('');
            }}
            className="text-xs font-bold text-slate-500 dark:text-slate-300 px-2 py-1.5"
          >
            Tutup
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          {/* Left: Compact Brand */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/20">
              <Image
                src="/logo.svg"
                alt="Criliant"
                width={18}
                height={18}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-[#0F1419] dark:text-white">
                CRILIANT
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]">
                {activeTrack.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right: Search, Theme & Account */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                searchQuery
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-[#EFF3F4] dark:border-[#1E293B] text-[#536471] dark:text-slate-300'
              }`}
              aria-label="Cari materi"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#EFF3F4] dark:border-[#1E293B] text-[#536471] dark:text-slate-300 flex items-center justify-center transition-colors"
              aria-label="Ubah Tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {userProfile ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#EFF3F4] dark:border-[#1E293B]"
              >
                <div className="w-6 h-6 rounded-lg bg-[#2563EB] text-white font-black text-[10px] flex items-center justify-center">
                  {userProfile.avatarInitial}
                </div>
                <span className="text-[11px] font-bold text-[#0F1419] dark:text-white max-w-[70px] truncate">
                  {userProfile.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal('general')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-extrabold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
