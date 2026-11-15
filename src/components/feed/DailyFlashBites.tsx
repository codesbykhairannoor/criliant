'use client';

import React from 'react';
import { StudyTrack } from '@/types';

interface DailyFlashBitesProps {
  activeTrack: StudyTrack;
  onStartExam: (modeId: string) => void;
}

export const DailyFlashBites: React.FC<DailyFlashBitesProps> = ({
  activeTrack,
  onStartExam,
}) => {
  const bitesByTrack: Record<StudyTrack, Array<{
    packageId: string;
    title: string;
    sub: string;
    icon: string;
    color: string;
    borderColor: string;
    bgBadge: string;
  }>> = {
    cpns: [
      {
        packageId: 'DAILY_TWK',
        title: 'TWK Integritas & UUD',
        sub: '5 Soal Kilat • 3m',
        icon: '⚖️',
        color: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800/80',
        bgBadge: 'bg-blue-50/80 dark:bg-blue-950/40',
      },
      {
        packageId: 'DAILY_TIU',
        title: 'TIU Hitung Cepat',
        sub: '5 Soal Numerik • 4m',
        icon: '⚡',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
      {
        packageId: 'DAILY_TKP',
        title: 'TKP Anti-Radikalisme',
        sub: '5 Soal Skala 1–5 • 3m',
        icon: '🛡️',
        color: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-800/80',
        bgBadge: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      },
    ],
    snbt: [
      {
        packageId: 'DAILY_SNBT_PU',
        title: 'TPS Penalaran Umum',
        sub: '5 Soal Logika • 3m',
        icon: '🧠',
        color: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-800/80',
        bgBadge: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      },
      {
        packageId: 'DAILY_SNBT_PM',
        title: 'Penalaran Matematika',
        sub: '5 Soal Aljabar • 5m',
        icon: '📐',
        color: 'text-indigo-700 dark:text-indigo-300',
        borderColor: 'border-indigo-200 dark:border-indigo-800/80',
        bgBadge: 'bg-indigo-50/80 dark:bg-indigo-950/40',
      },
      {
        packageId: 'DAILY_SNBT_LIT',
        title: 'Literasi Bahasa',
        sub: '5 Soal Teks • 4m',
        icon: '📖',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
    ],
    kedinasan: [
      {
        packageId: 'DAILY_KED_TBI',
        title: 'TBI Grammar SPMB',
        sub: '5 Soal Inversi • 3m',
        icon: '🌐',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
      {
        packageId: 'DAILY_KED_TPA',
        title: 'TPA Angka Hilang',
        sub: '5 Soal Matriks • 4m',
        icon: '🔢',
        color: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800/80',
        bgBadge: 'bg-blue-50/80 dark:bg-blue-950/40',
      },
      {
        packageId: 'DAILY_KED_MTK',
        title: 'MTK Diskrit STIS',
        sub: '5 Soal Diskrit • 5m',
        icon: '📐',
        color: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-800/80',
        bgBadge: 'bg-purple-50/80 dark:bg-purple-950/40',
      },
    ],
  };

  const bites = bitesByTrack[activeTrack] || bitesByTrack.cpns;

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-3 sm:p-3.5 mb-3.5 select-none">
      <div className="flex items-center justify-between mb-2.5 px-0.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
            Teka-Teki Kilat Hari Ini
          </span>
        </div>
        <button
          onClick={() => onStartExam('DAILY')}
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 flex-shrink-0"
        >
          <span>Tantangan Harian</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Horizontal scroll on mobile, 3-column grid on >= sm */}
      <div className="flex sm:grid sm:grid-cols-3 gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-0.5 px-0.5">
        {bites.map((bite) => (
          <button
            key={bite.packageId}
            onClick={() => onStartExam(bite.packageId)}
            className={`min-w-[195px] sm:min-w-0 flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.98] ${bite.bgBadge} ${bite.borderColor}`}
          >
            <span className="text-xl flex-shrink-0">{bite.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${bite.color}`}>
                {bite.title}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {bite.sub}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
