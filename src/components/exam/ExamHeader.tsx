'use client';

import React from 'react';
import { Timer, Grid, X, Sun, Moon } from 'lucide-react';
import { ExamMode, StudyTrack } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface ExamHeaderProps {
  title: string;
  track: StudyTrack;
  mode: ExamMode;
  remainingSeconds: number;
  answeredCount: number;
  totalQuestions: number;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onFontSizeChange?: (size: 'normal' | 'large' | 'xlarge') => void;
  onRequestExit: () => void;
  onOpenGrid: () => void;
  onRequestFinish: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  track,
  mode,
  remainingSeconds,
  answeredCount,
  totalQuestions,
  fontSize = 'normal',
  onFontSizeChange,
  onRequestExit,
  onOpenGrid,
  onRequestFinish,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const subtitleByTrack: Record<StudyTrack, string> = {
    cpns: 'Standar Resmi KepmenPAN-RB 2026',
    snbt: 'Standar Resmi BPPP UTBK 2026',
    kedinasan: 'Standar SPMB STAN & STIS 2026',
  };

  return (
    <header className="bg-white dark:bg-[#0B0F19] border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs z-20 transition-colors">
      {/* Left: Exit + Exam Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onRequestExit}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200/80 dark:border-slate-800 flex-shrink-0"
          title="Keluar / Batalkan Ujian"
          aria-label="Keluar / Batalkan Ujian"
        >
          <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
        </button>
        <div className="min-w-0 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
              {title}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-800/40 uppercase flex-shrink-0">
              {track} · {mode === 'DAILY' ? 'KILAT' : 'UJIAN'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
            {subtitleByTrack[track]}
          </p>
        </div>
      </div>

      {/* Center: Live Prominent Countdown Timer */}
      <div
        className={`flex items-center gap-2 px-3.5 sm:px-4 h-9 sm:h-10 rounded-xl font-mono tabular-nums text-sm sm:text-base font-bold border transition-all flex-shrink-0 ${
          remainingSeconds < 120
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 animate-pulse shadow-xs'
            : 'bg-slate-50 dark:bg-[#111726] text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-800'
        }`}
      >
        <Timer className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" strokeWidth={1.85} />
        <span>{formatTime(remainingSeconds)}</span>
      </div>

      {/* Right: Theme Switcher, Question Counter & Submit Button */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center transition-all"
          title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-[18px] h-[18px] text-amber-400" strokeWidth={1.85} /> : <Moon className="w-[18px] h-[18px] text-slate-600" strokeWidth={1.85} />}
        </button>

        {/* Font Size Scaler (A / A+ / A++) */}
        {onFontSizeChange && (
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onFontSizeChange('normal')}
              className={`h-8 px-2.5 text-xs font-bold rounded-lg transition-all ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ukuran Huruf Standar"
              aria-label="Ukuran Huruf Standar"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('large')}
              className={`h-8 px-2.5 text-xs font-bold rounded-lg transition-all ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ukuran Huruf Besar (+15%)"
              aria-label="Ukuran Huruf Besar"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('xlarge')}
              className={`h-8 px-2.5 text-[13px] font-bold rounded-lg transition-all hidden md:block ${
                fontSize === 'xlarge'
                  ? 'bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ukuran Huruf Ekstra Besar (+30%)"
              aria-label="Ukuran Huruf Ekstra Besar"
            >
              A++
            </button>
          </div>
        )}

        <div className="text-right hidden sm:block tabular-nums">
          <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-tight">
            {answeredCount} / {totalQuestions}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Terjawab</span>
        </div>

        <button
          onClick={onOpenGrid}
          className="h-9 flex items-center gap-1.5 px-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-[13px] font-semibold rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors xl:hidden tabular-nums"
          aria-label="Buka Matriks Soal"
        >
          <Grid className="w-4 h-4" strokeWidth={1.85} />
          <span className="text-xs sm:hidden">
            {answeredCount}/{totalQuestions}
          </span>
          <span className="hidden sm:inline">Matriks</span>
        </button>

        <button
          onClick={onRequestFinish}
          className="h-9 px-3.5 sm:px-4 bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold rounded-xl shadow-xs transition-all"
        >
          Selesai
        </button>
      </div>
    </header>
  );
};
