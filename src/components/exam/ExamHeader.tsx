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
    <header className="bg-white dark:bg-[#0B0F19] border-b border-[#EFF3F4] dark:border-[#1E293B] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-sm z-20 transition-colors">
      {/* Left: Exit + Exam Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onRequestExit}
          className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center text-[#536471] dark:text-slate-300 hover:text-[#0F1419] dark:hover:text-white transition-colors border border-[#EFF3F4] dark:border-[#1E293B] flex-shrink-0"
          title="Keluar / Batalkan Ujian"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="min-w-0 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F1419] dark:text-white truncate max-w-[200px] md:max-w-xs">
              {title}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-800/40 uppercase flex-shrink-0">
              {track} • {mode === 'DAILY' ? 'KILAT' : 'UJIAN'}
            </span>
          </div>
          <p className="text-[11px] text-[#536471] dark:text-slate-400 font-medium truncate">
            {subtitleByTrack[track]}
          </p>
        </div>
      </div>

      {/* Center: Live Prominent Countdown Timer */}
      <div
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl font-mono text-sm sm:text-lg font-black border transition-all flex-shrink-0 ${
          remainingSeconds < 120
            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 animate-pulse shadow-sm'
            : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F1419] dark:text-white border-[#EFF3F4] dark:border-[#1E293B]'
        }`}
      >
        <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB] dark:text-[#38BDF8]" />
        <span>{formatTime(remainingSeconds)}</span>
      </div>

      {/* Right: Theme Switcher, Question Counter & Submit Button */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#536471] dark:text-slate-300 border border-[#EFF3F4] dark:border-[#1E293B] flex items-center justify-center transition-all"
          title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Font Size Scaler (A- / A / A+) */}
        {onFontSizeChange && (
          <div className="flex items-center rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] p-0.5 border border-[#EFF3F4] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => onFontSizeChange('normal')}
              className={`px-1.5 sm:px-2 py-1 text-[10px] font-extrabold rounded-lg transition-all ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-[#536471] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
              title="Ukuran Huruf Standar"
              aria-label="Ukuran Huruf Standar"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('large')}
              className={`px-1.5 sm:px-2 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-[#536471] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
              title="Ukuran Huruf Besar (+15%)"
              aria-label="Ukuran Huruf Besar"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('xlarge')}
              className={`px-1.5 sm:px-2 py-1 text-[12px] font-black rounded-lg transition-all hidden md:block ${
                fontSize === 'xlarge'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#38BDF8] shadow-xs'
                  : 'text-[#536471] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
              title="Ukuran Huruf Ekstra Besar (+30%)"
              aria-label="Ukuran Huruf Ekstra Besar"
            >
              A++
            </button>
          </div>
        )}

        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-[#0F1419] dark:text-white">
            {answeredCount} / {totalQuestions}
          </span>
          <span className="block text-[10px] text-[#536471] dark:text-slate-400">Terjawab</span>
        </div>

        <button
          onClick={onOpenGrid}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white text-xs font-bold rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-colors xl:hidden"
          aria-label="Buka Matriks Soal"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="text-[11px] sm:hidden">
            {answeredCount}/{totalQuestions}
          </span>
          <span className="hidden sm:inline">Matriks</span>
        </button>

        <button
          onClick={onRequestFinish}
          className="px-3 sm:px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
        >
          Selesai
        </button>
      </div>
    </header>
  );
};
