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
    <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 transition-colors select-none">
      {isSearchOpen ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Cari materi ${activeTrack.toUpperCase()}...`}
              className="w-full h-10 pl-10 pr-9 bg-slate-50 dark:bg-[#111726] text-base font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="w-8 h-8 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              onSearchChange('');
            }}
            className="h-10 px-3 text-sm font-semibold text-slate-600 dark:text-slate-300"
          >
            Tutup
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          {/* Left: Compact Brand */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-xs">
              <Image
                src="/logo.svg"
                alt="Criliant"
                width={18}
                height={18}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                Criliant
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400">
                {activeTrack.toUpperCase()}
              </span>
            </div>
          </button>

          {/* Right: Search, Theme & Account */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                searchQuery
                  ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-400'
                  : 'bg-slate-50 dark:bg-[#111726] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              aria-label="Cari materi"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
              aria-label="Ubah Tema"
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px] text-amber-400" strokeWidth={1.85} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.85} />
              )}
            </button>

            {userProfile ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="h-10 flex items-center gap-2 pl-1.5 pr-3 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center overflow-hidden shrink-0">
                  {userProfile.avatarPhotoUrl ? (
                    <img
                      src={userProfile.avatarPhotoUrl}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userProfile.avatarInitial
                  )}
                </div>
                <span
                  className="text-sm font-semibold text-slate-900 dark:text-white max-w-[84px] truncate"
                  title={userProfile.name}
                >
                  {userProfile.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuthModal('general')}
                className="h-10 flex items-center gap-1.5 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-xs"
              >
                <LogIn className="w-4 h-4" strokeWidth={2} />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
