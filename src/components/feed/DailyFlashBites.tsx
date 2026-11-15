'use client';

import React from 'react';
import { StudyTrack } from '@/types';
import { Sparkles, Zap, Brain, Target, Shield, BookOpen } from 'lucide-react';

interface DailyFlashBitesProps {
  activeTrack: StudyTrack;
  onStartExam: (modeId: string) => void;
}

export const DailyFlashBites: React.FC<DailyFlashBitesProps> = ({
  activeTrack,
  onStartExam,
}) => {
  const bitesByTrack: Record<StudyTrack, Array<{
    title: string;
    sub: string;
    icon: string;
    color: string;
    borderColor: string;
    bgBadge: string;
  }>> = {
    cpns: [
      {
        title: 'TWK Integritas & UUD',
        sub: '5 Soal Kilat • 3m',
        icon: '⚖️',
        color: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800/80',
        bgBadge: 'bg-blue-50/80 dark:bg-blue-950/40',
      },
      {
        title: 'TIU Hitung Cepat',
        sub: 'Pola Bilangan • 4m',
        icon: '⚡',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
      {
        title: 'TKP Anti-Radikalisme',
        sub: 'Skor 1-5 • 3m',
        icon: '🛡️',
        color: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-800/80',
        bgBadge: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      },
    ],
    snbt: [
      {
        title: 'TPS Penalaran Umum',
        sub: 'Logika Silogisme • 3m',
        icon: '🧠',
        color: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-800/80',
        bgBadge: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      },
      {
        title: 'Penalaran Matematika',
        sub: 'Model Aljabar • 5m',
        icon: '📐',
        color: 'text-indigo-700 dark:text-indigo-300',
        borderColor: 'border-indigo-200 dark:border-indigo-800/80',
        bgBadge: 'bg-indigo-50/80 dark:bg-indigo-950/40',
      },
      {
        title: 'Literasi Bahasa',
        sub: 'Analisis Teks • 4m',
        icon: '📖',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
    ],
    kedinasan: [
      {
        title: 'TBI Grammar SPMB',
        sub: 'Inverted Structure • 3m',
        icon: '🌐',
        color: 'text-amber-700 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-800/80',
        bgBadge: 'bg-amber-50/80 dark:bg-amber-950/40',
      },
      {
        title: 'TPA Angka Hilang',
        sub: 'Psikotes Matriks • 4m',
        icon: '🔢',
        color: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800/80',
        bgBadge: 'bg-blue-50/80 dark:bg-blue-950/40',
      },
      {
        title: 'MTK Diskrit Kedinasan',
        sub: 'Kombinatorika • 5m',
        icon: '📐',
        color: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-800/80',
        bgBadge: 'bg-purple-50/80 dark:bg-purple-950/40',
      },
    ],
  };

  const bites = bitesByTrack[activeTrack] || bitesByTrack.cpns;

  return (
    <div className="bg-white dark:bg-[#111726] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-3.5 mb-4 select-none">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Teka-Teki Kilat Hari Ini
          </span>
        </div>
        <button
          onClick={() => onStartExam('DAILY')}
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Tantangan Harian</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Horizontal Scrollable Capsules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {bites.map((bite, i) => (
          <button
            key={i}
            onClick={() => onStartExam('DAILY')}
            className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-98 ${bite.bgBadge} ${bite.borderColor}`}
          >
            <span className="text-xl flex-shrink-0">{bite.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${bite.color}`}>
                {bite.title}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {bite.sub}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
