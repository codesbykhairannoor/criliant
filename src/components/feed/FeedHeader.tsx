'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import { Sparkles, Award, Flame, X } from 'lucide-react';

interface FeedHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCashtag: string;
  setSelectedCashtag: (tag: string) => void;
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCashtag,
  setSelectedCashtag,
  activeTrack,
  setActiveTrack,
}) => {
  const tabs = [
    { id: 'all', label: 'Semua', icon: Sparkles },
    { id: 'following', label: 'Mengikuti', icon: Flame },
    { id: 'quiz', label: 'Kuis Mikro', icon: Flame },
    { id: 'flex', label: 'Rapor Flex', icon: Award },
  ];

  const hasActiveTagFilter = selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending');

  return (
    <div className="sticky top-0 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md z-30 transition-colors select-none mb-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 1. UNIVERSE / ROOM SWITCHER (Duolingo Style: Isolasi Ruang Belajar) */}
      <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0D1322]">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Kamar Ujian Aktif:
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {activeTrack === 'cpns' ? 'Standar SKD CAT BKN' : activeTrack === 'snbt' ? 'Standar BPPP Kemendikbud' : 'Standar SPMB Kedinasan'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setActiveTrack('cpns')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTrack === 'cpns'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span className="truncate">CPNS 2026</span>
          </button>

          <button
            onClick={() => setActiveTrack('snbt')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTrack === 'snbt'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🎓</span>
            <span className="truncate">SNBT UTBK</span>
          </button>

          <button
            onClick={() => setActiveTrack('kedinasan')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTrack === 'kedinasan'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span className="truncate">Kedinasan</span>
          </button>
        </div>
      </div>

      {/* Main Feed Category Tabs */}
      <div className="grid grid-cols-4 p-1 bg-slate-100/60 dark:bg-slate-900/60 rounded-xl m-1.5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtle Active Filter Chip (Only appears when user clicked a trending cashtag) */}
      {hasActiveTagFilter && (
        <div className="px-4 py-2 bg-blue-50/70 dark:bg-blue-950/40 border-t border-[#EFF3F4] dark:border-[#1E293B] flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            <span className="text-[#536471] dark:text-slate-400 font-medium">Filter Topik:</span>
            <span className="font-extrabold text-[#2563EB] dark:text-[#38BDF8] bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
              {selectedCashtag}
            </span>
          </div>
          <button
            onClick={() => setSelectedCashtag('#Semua')}
            className="text-[11px] font-bold text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white flex items-center gap-1 transition-colors"
            title="Reset ke semua topik"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hapus Filter</span>
          </button>
        </div>
      )}
    </div>
  );
};
