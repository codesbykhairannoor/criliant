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
  totalQuestionsCount = 60,
  onOpenCreatePost,
  onOpenEditProfile,
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
    { id: 'feed', label: 'Feed Utama', icon: Home, badge: 'Live' },
    { id: 'latihan', label: 'Latihan & Daily', icon: Flame, badge: 'Streak' },
    { id: 'arena', label: arenaLabel, icon: Swords, badge: 'ELO' },
    { id: 'bank', label: 'Bank Soal', icon: BookOpen, badge: `${totalQuestionsCount}+` },
    { id: 'bookmarks', label: 'Soal Tersimpan', icon: Bookmark },
  ];

  const tracks: StudyTrack[] = ['cpns', 'snbt', 'kedinasan'];

  return (
    <aside className="hidden md:flex flex-col justify-between w-52 xl:w-56 flex-shrink-0 h-screen sticky top-0 left-0 border-r border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] p-3 overflow-y-auto transition-colors z-30 select-none">
      {/* 1. TOP SECTION: BRAND & MINIMALIST NAVIGATION */}
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1">
          <div
            onClick={() => setCurrentTab('feed')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-md shadow-blue-500/20">
              <Image
                src="/logo.svg"
                alt="Criliant"
                width={22}
                height={22}
                className="drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-[#0F1419] dark:text-white">CRILIANT</span>
                <span className="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#536471] dark:text-slate-400 mt-0.5">Social Education Hub</p>
            </div>
          </div>

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#536471] dark:text-slate-300 border border-[#EFF3F4] dark:border-[#1E293B] flex items-center justify-center transition-all"
            title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Sleek Segmented Track Switcher (CPNS / SNBT / Kedinasan) */}
        <div className="bg-[#F8FAFC] dark:bg-[#090D16] p-1 rounded-xl border border-[#EFF3F4] dark:border-[#1E293B]">
          <div className="grid grid-cols-3 gap-1">
            {tracks.map((t) => {
              const info = STUDY_TRACKS[t];
              const isActive = activeTrack === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTrack(t)}
                  className={`text-[10px] font-extrabold py-1.5 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 ${isActive
                    ? 'bg-white dark:bg-[#0F172A] text-[#0F1419] dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700'
                    : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                    }`}
                >
                  <span className="text-sm leading-none">{info.iconEmoji}</span>
                  <span className="truncate w-full">{info.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Clean Menu (Zero Duplicate Items) */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${isActive
                  ? 'bg-[#0F1419] dark:bg-white text-white dark:text-[#0F1419] shadow-sm'
                  : 'text-[#0F1419] dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white dark:text-[#0F1419]' : 'text-[#536471] dark:text-slate-400'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#0F1419]'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Single Primary Action Button (Twitter-Style Clean Compose) */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (!userProfile) {
                onOpenAuthModal('post');
                return;
              }
              onOpenCreatePost();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all tracking-tight"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Postingan / Kuis</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: USER IDENTITY OR GUEST MODE */}
      <div className="pt-3 border-t border-[#EFF3F4] dark:border-[#1E293B]">
        {userProfile ? (
          <div
            onClick={() => setCurrentTab('profile')}
            className={`p-2.5 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] cursor-pointer transition-all border border-transparent hover:border-[#EFF3F4] dark:hover:border-[#1E293B] group relative ${
              currentTab === 'profile' ? 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-800' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0F1419] dark:bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <span
                      className="font-extrabold text-xs text-[#0F1419] dark:text-white truncate block group-hover:underline"
                      title={userProfile.name}
                    >
                      {userProfile.name}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono block truncate">
                      @{formatUsername(userProfile.username, userProfile.name)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogout();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                    title="Keluar dari Akun"
                    aria-label="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#EFF3F4] dark:border-[#1E293B] space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center font-bold text-xs flex-shrink-0">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-xs text-[#0F1419] dark:text-white block leading-tight">
                  Mode Tamu (Guest)
                </span>
                <span className="text-[10px] text-[#536471] dark:text-slate-400 block truncate">
                  Bebas baca stream & materi
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenAuthModal('general')}
              className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-sm transition-all text-center flex items-center justify-center gap-1.5 active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk / Daftar Akun</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
