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
    { id: 'quiz', label: 'Kuis Mikro', icon: Flame },
    { id: 'flex', label: 'Rapor Flex', icon: Award },
  ];

  const hasActiveTagFilter = selectedCashtag !== '#Semua' && !selectedCashtag.includes('Trending');

  return (
    <div className="sticky top-0 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#EFF3F4] dark:border-[#1E293B] z-30 transition-colors select-none">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-[#EFF3F4] dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-xs">
            C
          </div>
          <span className="font-extrabold text-base text-[#0F1419] dark:text-white tracking-tight">CRILIANT</span>
        </div>
        <select
          value={activeTrack}
          onChange={(e) => setActiveTrack(e.target.value as StudyTrack)}
          className="text-xs font-bold bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#EFF3F4] dark:border-[#1E293B] text-[#0F1419] dark:text-white rounded-lg py-1 px-2 focus:outline-none"
        >
          <option value="cpns">🏛️ CPNS 2026</option>
          <option value="snbt">🎓 SNBT UTBK</option>
          <option value="kedinasan">🛡️ Kedinasan</option>
        </select>
      </div>

      {/* Main Feed Category Tabs (Ultra-Clean Twitter / X Style) */}
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 relative transition-colors ${isActive
                ? 'text-[#0F1419] dark:text-white'
                : 'text-[#536471] dark:text-slate-400 hover:text-[#0F1419] dark:hover:text-white hover:bg-[#F8FAFC]/50 dark:hover:bg-slate-800/30'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-[#536471] dark:text-slate-400'}`} />
              <span className="tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[#2563EB] dark:bg-[#38BDF8] rounded-full" />
              )}
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
