'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import { Sparkles, Award, Flame, X, Search } from 'lucide-react';

interface FeedHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCashtag: string;
  setSelectedCashtag: (tag: string) => void;
  activeTrack: StudyTrack;
  setActiveTrack: (track: StudyTrack) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCashtag,
  setSelectedCashtag,
  activeTrack,
  setActiveTrack,
  searchQuery = '',
  onClearSearch,
}) => {
  const tabs = [
    { id: 'all', label: 'Semua', icon: Sparkles },
    { id: 'following', label: 'Mengikuti', icon: Flame },
    { id: 'quiz', label: 'Kuis', icon: Flame },
    { id: 'flex', label: 'Rapor', icon: Award },
  ];

  const hasActiveTagFilter = selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending');
  const hasSearchFilter = searchQuery.trim().length > 0;

  return (
    <div className="md:sticky md:top-2 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md z-20 transition-colors select-none mb-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 1. UNIVERSE / ROOM SWITCHER (Mobile only, desktop uses LeftSidebar) */}
      <div className="md:hidden p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0D1322]">
        <div className="hidden sm:flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Kamar Ujian Aktif:
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {activeTrack === 'cpns'
              ? 'Standar SKD CAT BKN'
              : activeTrack === 'snbt'
                ? 'Standar BPPP Kemendikbud'
                : 'Standar SPMB Kedinasan'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTrack('cpns')}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
              activeTrack === 'cpns'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span className="truncate">CPNS</span>
          </button>

          <button
            onClick={() => setActiveTrack('snbt')}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
              activeTrack === 'snbt'
                ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🎓</span>
            <span className="truncate">SNBT</span>
          </button>

          <button
            onClick={() => setActiveTrack('kedinasan')}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
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
              className={`py-1.5 sm:py-2 px-1 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#162137] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 hidden sm:inline flex-shrink-0" />
              <span className="tracking-tight truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tag or Search Filter Chip */}
      {(hasActiveTagFilter || hasSearchFilter) && (
        <div className="px-3.5 py-2 bg-blue-50/70 dark:bg-blue-950/40 border-t border-[#EFF3F4] dark:border-[#1E293B] flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {hasActiveTagFilter && (
              <span className="inline-flex items-center gap-1 font-extrabold text-[#2563EB] dark:text-[#38BDF8] bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                {selectedCashtag}
                <button
                  onClick={() => setSelectedCashtag('#Semua')}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Hapus filter tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {hasSearchFilter && (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                <Search className="w-3 h-3" />
                <span>&ldquo;{searchQuery}&rdquo;</span>
                {onClearSearch && (
                  <button
                    onClick={onClearSearch}
                    className="hover:text-slate-900 dark:hover:text-white"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedCashtag('#Semua');
              onClearSearch?.();
            }}
            className="text-[11px] font-bold text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Reset Filter</span>
          </button>
        </div>
      )}
    </div>
  );
};
