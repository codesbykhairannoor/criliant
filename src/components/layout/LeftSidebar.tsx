'use client';

import React from 'react';
import Image from 'next/image';
import {
  Home,
  Swords,
  BookOpen,
  Bookmark,
  BarChart3,
  User,
  PlusCircle,
  Target,
  Flame,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  LogOut
} from 'lucide-react';
import { StudyTrack, UserProfile } from '@/types';
import { STUDY_TRACKS } from '@/data/constants';
import { EXAM_PACKAGES } from '@/data/examPackages';
import { useTheme } from '@/context/ThemeContext';
import { formatUsername } from '@/utils/formatters';
import { AuthTriggerReason } from '@/components/auth/AuthModal';

interface LeftSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  userProfile: UserProfile | null;
  totalQuestionsCount?: number;
  onOpenCreatePost: () => void;
  onStartExam: (modeId: string) => void;
  onOpenEditProfile: () => void;
  onOpenAuthModal: (reason?: AuthTriggerReason) => void;
  onLogout: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeTrack,
  setActiveTrack,
  userProfile,
  onOpenCreatePost,
  onOpenAuthModal,
  onLogout,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const arenaLabel =
    activeTrack === 'snbt'
      ? 'Arena UTBK'
      : activeTrack === 'kedinasan'
        ? 'Arena Kedinasan'
        : 'Arena CAT';

  const navItems = [
    { id: 'feed', label: 'Feed Utama', icon: Home },
    { id: 'latihan', label: 'Latihan & Daily', icon: Flame },
    { id: 'arena', label: arenaLabel, icon: Swords },
    { id: 'bank', label: 'Bank Soal', icon: BookOpen },
    { id: 'bookmarks', label: 'Soal Tersimpan', icon: Bookmark },
  ];

  const tracks: StudyTrack[] = ['cpns', 'snbt', 'kedinasan'];

  return (
    <aside className="hidden md:flex flex-col justify-between w-60 xl:w-[252px] flex-shrink-0 h-screen sticky top-0 left-0 border-r border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#0B0F19] p-4 overflow-y-auto transition-colors z-30 select-none">
      {/* 1. TOP SECTION: BRAND & NAVIGATION */}
      <div className="space-y-6">
        {/* Clean Brand Header */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setCurrentTab('feed')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-xs transition-transform group-hover:scale-[1.03]">
              <Image
                src="/logo.svg"
                alt="Criliant"
                width={20}
                height={20}
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Criliant
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#111726] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center transition-colors"
            title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px] text-amber-400" strokeWidth={1.85} />
            ) : (
              <Moon className="w-[18px] h-[18px]" strokeWidth={1.85} />
            )}
          </button>
        </div>

        {/* Segmented Room / Track Switcher */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1 block">
            Kamar Ujian
          </span>
          <div className="bg-slate-100/80 dark:bg-[#090D16] p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-3 gap-1">
              {tracks.map((t) => {
                const info = STUDY_TRACKS[t];
                const isActive = activeTrack === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTrack(t)}
                    className={`h-9 px-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{info.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Menu (Crisp Icon + Label, Zero Badge Soup) */}
        <nav className="space-y-1" aria-label="Navigasi Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`w-full h-11 flex items-center gap-3 px-3.5 rounded-xl text-[15px] transition-colors group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100/80 dark:hover:bg-[#111726] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#2563EB] dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                  strokeWidth={isActive ? 2.1 : 1.85}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Primary CTA Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (!userProfile) {
                onOpenAuthModal('post');
                return;
              }
              onOpenCreatePost();
            }}
            className="w-full h-11 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>Buat Postingan</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: USER IDENTITY OR CLEAN SIGN-IN */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/90">
        {userProfile ? (
          <div
            onClick={() => setCurrentTab('profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setCurrentTab('profile');
            }}
            className={`p-2.5 rounded-xl cursor-pointer transition-colors border flex items-center justify-between gap-2 group ${
              currentTab === 'profile'
                ? 'bg-slate-100/80 dark:bg-[#111726] border-slate-200 dark:border-slate-700'
                : 'border-transparent hover:bg-slate-100/70 dark:hover:bg-[#111726]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-semibold text-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
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
              <div className="min-w-0">
                <span
                  className="font-semibold text-sm text-slate-900 dark:text-white truncate block group-hover:underline"
                  title={userProfile.name}
                >
                  {userProfile.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                  @{formatUsername(userProfile.username, userProfile.name)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center transition-colors flex-shrink-0"
              title="Keluar dari Akun"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.85} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onOpenAuthModal('general')}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" strokeWidth={2} />
              <span>Masuk / Daftar</span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Simpan progres &amp; rapor simulasi
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
