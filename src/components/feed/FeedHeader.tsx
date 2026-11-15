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
    { id: 'all', label: 'Semua' },
    { id: 'following', label: 'Mengikuti' },
    { id: 'quiz', label: 'Kuis' },
    { id: 'flex', label: 'Rapor' },
  ];

  const hasActiveTagFilter = selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending');
  const hasSearchFilter = searchQuery.trim().length > 0;

  return (
    <div className="md:sticky md:top-3 bg-white/95 dark:bg-[#111726]/95 backdrop-blur-md z-20 transition-colors select-none rounded-2xl border border-slate-200/80 dark:border-slate-800/90 overflow-hidden">
      {/* 1. ROOM SWITCHER (Mobile only, desktop uses LeftSidebar) */}
      <div className="md:hidden p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1322]">
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'cpns' as StudyTrack, label: 'CPNS' },
            { id: 'snbt' as StudyTrack, label: 'SNBT' },
            { id: 'kedinasan' as StudyTrack, label: 'Kedinasan' },
          ].map((track) => {
            const isActive = activeTrack === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveTrack(track.id)}
                className={`h-9 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-white dark:bg-[#162137] text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {track.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Feed Category Tabs */}
      <div className="grid grid-cols-4 p-1.5 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 px-2 text-sm font-semibold flex items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-500/15 text-[#2563EB] dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active Tag or Search Filter Chip */}
      {(hasActiveTagFilter || hasSearchFilter) && (
        <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/30 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveTagFilter && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/50 px-2.5 py-1 rounded-lg">
                {selectedCashtag}
                <button
                  type="button"
                  onClick={() => setSelectedCashtag('#Semua')}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Hapus filter tag"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {hasSearchFilter && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2.5 py-1 rounded-lg">
                <Search className="w-3.5 h-3.5" />
                <span>&ldquo;{searchQuery}&rdquo;</span>
                {onClearSearch && (
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="hover:text-slate-900 dark:hover:text-white"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCashtag('#Semua');
              onClearSearch?.();
            }}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
};
