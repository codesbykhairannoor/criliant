'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, ExamMode, ExamResultSummary, QuestionReviewItem } from '@/types';
import {
  Timer,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Grid,
  X,
  AlertTriangle,
  Flag,
  Keyboard,
  ShieldCheck,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP
} from '@/data/constants';
import { useTheme } from '@/context/ThemeContext';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  mode: ExamMode;
  durationSeconds: number;
  onFinishExam: (summary: ExamResultSummary) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  questions,
  mode,
  durationSeconds,
  onFinishExam,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, Set<number>>>({});
  const [lifelinesRemaining, setLifelinesRemaining] = useState(3);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isConfirmFinishOpen, setIsConfirmFinishOpen] = useState(false);
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);

  // Initialize and Reset on Open
  useEffect(() => {
    if (!isOpen) return;
    setRemainingSeconds(durationSeconds);
    setCurrentIndex(0);
    setUserAnswers({});
    setEliminatedOptions({});
    setLifelinesRemaining(3);

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, durationSeconds]);

  const currentQ = questions[currentIndex] || questions[0];
  const currentAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const currentEliminated = currentQ ? (eliminatedOptions[currentQ.id] || new Set()) : new Set();

  // Format Timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Select Option (Toggle answer)
  const handleSelectOption = useCallback((idx: number) => {
    if (!currentQ || currentEliminated.has(idx)) return;

    setUserAnswers((prev) => {
      const existing = prev[currentQ.id];
      const newIdx = existing?.selectedOptionIndex === idx ? null : idx;
      return {
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          selectedOptionIndex: newIdx,
          isDoubtful: existing?.isDoubtful ?? false,
        },
      };
    });
  }, [currentQ, currentEliminated]);

  // Toggle Doubtful Flag
  const handleToggleDoubt = useCallback(() => {
    if (!currentQ) return;
    setUserAnswers((prev) => {
      const existing = prev[currentQ.id];
      return {
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          selectedOptionIndex: existing?.selectedOptionIndex ?? null,
          isDoubtful: !existing?.isDoubtful,
        },
      };
    });
  }, [currentQ]);

  // 50:50 Lifeline: Eliminate 2 wrong choices
  const handleUseLifeline = useCallback(() => {
    if (!currentQ || lifelinesRemaining <= 0 || currentEliminated.size > 0) return;

    const toEliminate = new Set<number>();
    if (currentQ.category === 'TKP' && currentQ.tkpOptionPoints) {
      const sorted = currentQ.tkpOptionPoints
        .map((pts, i) => ({ pts, i }))
        .sort((a, b) => a.pts - b.pts);
      toEliminate.add(sorted[0].i);
      toEliminate.add(sorted[1].i);
    } else {
      const wrongIndices = currentQ.options
        .map((_, i) => i)
        .filter((i) => i !== currentQ.correctOptionIndex);
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      toEliminate.add(shuffled[0]);
      toEliminate.add(shuffled[1]);
    }

    setEliminatedOptions((prev) => ({
      ...prev,
      [currentQ.id]: toEliminate,
    }));
    setLifelinesRemaining((prev) => Math.max(0, prev - 1));

    if (currentAnswer?.selectedOptionIndex !== null && currentAnswer?.selectedOptionIndex !== undefined && toEliminate.has(currentAnswer.selectedOptionIndex)) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...currentAnswer,
          selectedOptionIndex: null,
        },
      }));
    }
  }, [currentQ, lifelinesRemaining, currentEliminated, currentAnswer]);

  // Keyboard Shortcuts (Standard High-Stakes Pro Testing)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isConfirmFinishOpen || isConfirmExitOpen || isGridOpen) return;

      const key = e.key.toLowerCase();
      if (['a', '1'].includes(key)) handleSelectOption(0);
      else if (['b', '2'].includes(key)) handleSelectOption(1);
      else if (['c', '3'].includes(key)) handleSelectOption(2);
      else if (['d', '4'].includes(key)) handleSelectOption(3);
      else if (['e', '5'].includes(key)) handleSelectOption(4);
      else if (key === 'r') handleToggleDoubt();
      else if (key === 'l') handleUseLifeline();
      else if (key === 'arrowright' || key === 'enter') {
        setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
      } else if (key === 'arrowleft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmFinishOpen, isConfirmExitOpen, isGridOpen, questions.length, handleSelectOption, handleToggleDoubt, handleUseLifeline]);

  // Finish and Calculate Official BKN Passing Grade
  const handleFinish = () => {
    let twk = 0;
    let tiu = 0;
    let tkp = 0;
    let answered = 0;
    let correct = 0;

    const reviewItems: QuestionReviewItem[] = questions.map((q) => {
      const ans = userAnswers[q.id];
      const selected = ans?.selectedOptionIndex ?? null;
      if (selected !== null) answered++;

      let score = 0;
      let isCorrect = false;

      if (q.category === 'TKP') {
        score = q.tkpOptionPoints ? q.tkpOptionPoints[selected ?? 0] ?? 0 : 0;
        isCorrect = score === 5;
      } else {
        isCorrect = selected === q.correctOptionIndex;
        score = isCorrect ? 5 : 0;
      }

      if (isCorrect) correct++;

      if (q.category === 'TWK') twk += score;
      else if (q.category === 'TIU') tiu += score;
      else if (q.category === 'TKP') tkp += score;
      else tiu += score;

      return {
        question: q,
        selectedOptionIndex: selected,
        earnedScore: score,
        isCorrect,
      };
    });

    const total = twk + tiu + tkp;
    const isTwkPassed = twk >= PASSING_GRADE_TWK;
    const isTiuPassed = tiu >= PASSING_GRADE_TIU;
    const isTkpPassed = tkp >= PASSING_GRADE_TKP;
    const isOverallPassed = isTwkPassed && isTiuPassed && isTkpPassed;

    const summary: ExamResultSummary = {
      mode,
      totalScore: total,
      twkScore: twk,
      tiuScore: tiu,
      tkpScore: tkp,
      isTwkPassed,
      isTiuPassed,
      isTkpPassed,
      isOverallPassed,
      totalQuestions: questions.length,
      answeredCount: answered,
      correctCount: correct,
      timeSpentSeconds: durationSeconds - remainingSeconds,
      reviewItems,
      createdAt: Date.now(),
    };

    onFinishExam(summary);
  };

  if (!isOpen || questions.length === 0) return null;

  const answeredCount = Object.values(userAnswers).filter((a) => a.selectedOptionIndex !== null).length;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-between overflow-hidden select-none transition-colors">
      {/* 1. TOP HEADER: WORLD-CLASS CLEAN EXAM BAR (SAT Bluebook / Prometric Style) */}
      <header className="bg-white dark:bg-[#0B0F19] border-b border-[#EFF3F4] dark:border-[#1E293B] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm z-20 transition-colors">
        {/* Left: Exit + Exam Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConfirmExitOpen(true)}
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center text-[#536471] dark:text-slate-300 hover:text-[#0F1419] dark:hover:text-white transition-colors border border-[#EFF3F4] dark:border-[#1E293B]"
            title="Keluar / Batalkan Ujian"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F1419] dark:text-white">
                CAT BKN SIMULATOR
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-800/40">
                {mode}
              </span>
            </div>
            <p className="text-[11px] text-[#536471] dark:text-slate-400 font-medium hidden sm:block">
              Standar Resmi KepmenPAN-RB 2026
            </p>
          </div>
        </div>

        {/* Center: Live Prominent Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-mono text-base sm:text-lg font-black border transition-all ${remainingSeconds < 300
          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 animate-pulse shadow-sm'
          : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F1419] dark:text-white border-[#EFF3F4] dark:border-[#1E293B]'
          }`}>
          <Timer className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
          <span>{formatTime(remainingSeconds)}</span>
        </div>

        {/* Right: Theme Switcher, Question Counter & Submit Button */}
        <div className="flex items-center gap-2.5">
          {/* Quick Theme Toggle Button right inside the Exam Header */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#536471] dark:text-slate-300 border border-[#EFF3F4] dark:border-[#1E293B] flex items-center justify-center transition-all"
            title={isDark ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[#0F1419] dark:text-white">
              {answeredCount} / {questions.length}
            </span>
            <span className="block text-[10px] text-[#536471] dark:text-slate-400">Terjawab</span>
          </div>

          <button
            onClick={() => setIsGridOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white text-xs font-bold rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-colors xl:hidden"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matriks</span>
          </button>

          <button
            onClick={() => setIsConfirmFinishOpen(true)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
          >
            Selesai
          </button>
        </div>
      </header>

      {/* 2. MAIN SPLIT WORKSPACE: QUESTION ON LEFT, MATRIKS ON RIGHT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center Area: Question & Options Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-6">
            {/* Top Breadcrumb & Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${currentQ.category === 'TWK'
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-900/40'
                  : currentQ.category === 'TIU'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900/40'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40'
                  }`}>
                  {currentQ.category}
                </span>
                <span className="text-xs font-semibold text-[#536471] dark:text-slate-400">
                  Topik: <span className="text-[#0F1419] dark:text-white font-bold">{currentQ.subTopic}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#536471] dark:text-slate-400">
                  Soal No. {currentIndex + 1}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">dari {questions.length}</span>
              </div>
            </div>

            {/* Question Text (Large, High Contrast, Immersive) */}
            <div className="py-2">
              <p className="text-base sm:text-[17px] font-semibold text-[#0F1419] dark:text-white leading-relaxed whitespace-pre-line">
                {currentQ.text}
              </p>
            </div>

            {/* Options List (A, B, C, D, E) */}
            <div className="space-y-3 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentAnswer?.selectedOptionIndex === idx;
                const isEliminated = currentEliminated.has(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isEliminated}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3.5 group relative ${isEliminated
                      ? 'opacity-30 line-through bg-slate-100/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                      : isSelected
                        ? 'border-[#2563EB] dark:border-[#38BDF8] bg-blue-50/70 dark:bg-[#38BDF8]/10 text-[#0F1419] dark:text-white shadow-sm'
                        : 'border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#131D31] text-[#0F1419] dark:text-slate-100'
                      }`}
                  >
                    {/* Letter Indicator */}
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-colors ${isSelected
                      ? 'bg-[#2563EB] dark:bg-[#38BDF8] text-white dark:text-[#090D16] shadow-sm'
                      : 'bg-[#F8FAFC] dark:bg-[#090D16] text-[#536471] dark:text-slate-400 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-800 group-hover:text-[#0F1419] dark:group-hover:text-white'
                      }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>

                    {/* Option Text */}
                    <span className="pt-0.5 leading-relaxed flex-1">
                      {opt}
                    </span>

                    {/* Active Checkmark */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8] flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyboard Hint Strip */}
            <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-[#536471] dark:text-slate-400 pt-4">
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">A-E</kbd> Pilih Opsi
              </span>
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">R</kbd> Ragu-ragu
              </span>
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">← / →</kbd> Pindah Soal
              </span>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Docked Matriks Soal on Desktop (Just like SAT Bluebook / Prometric) */}
        <aside className="hidden xl:flex flex-col justify-between w-80 border-l border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] p-5 overflow-y-auto transition-colors">
          <div>
            <div className="pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B] mb-3">
              <h4 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Matriks Navigasi Soal</h4>
              <p className="text-[11px] text-[#536471] dark:text-slate-400">Pantau progres dan lompat ke nomor mana pun</p>
            </div>

            {/* Status Legend */}
            <div className="flex items-center justify-between text-[10px] font-bold text-[#536471] dark:text-slate-400 mb-3 bg-[#F8FAFC] dark:bg-[#090D16] p-2 rounded-xl border border-[#EFF3F4] dark:border-[#1E293B]">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dark:bg-[#38BDF8]" />
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Ragu</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <span>Kosong</span>
              </div>
            </div>

            {/* Grid 1 to N */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[55vh] overflow-y-auto pr-1 no-scrollbar">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const hasAnswer = ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined;
                const isDoubt = ans?.isDoubtful;
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center relative ${isCurrent
                      ? 'ring-2 ring-[#0F1419] dark:ring-white ring-offset-1 dark:ring-offset-[#0B0F19] z-10'
                      : ''
                      } ${isDoubt
                        ? 'bg-amber-400 text-slate-900 shadow-sm'
                        : hasAnswer
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'bg-[#F8FAFC] dark:bg-[#090D16] text-[#536471] dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span>{idx + 1}</span>
                    {hasAnswer && (
                      <span className="absolute bottom-0.5 text-[8px] font-mono opacity-80 leading-none">
                        {String.fromCharCode(65 + ans!.selectedOptionIndex!)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFF3F4] dark:border-[#1E293B] text-center">
            <span className="text-[11px] text-[#536471] dark:text-slate-400 font-medium block mb-2">
              {answeredCount} dari {questions.length} soal selesai
            </span>
            <button
              onClick={() => setIsConfirmFinishOpen(true)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </aside>
      </div>

      {/* 3. BOTTOM ACTIONS DOCK (Safe from Browser Extensions) */}
      <footer className="bg-white dark:bg-[#0B0F19] border-t border-[#EFF3F4] dark:border-[#1E293B] px-4 sm:px-8 py-3 flex items-center justify-between gap-3 shadow-sm z-20 transition-colors">
        {/* Left Controls: Lifeline & Ragu-ragu (with safe pl-6 to avoid extension icons) */}
        <div className="flex items-center gap-2 pl-2 sm:pl-4">
          <button
            onClick={handleUseLifeline}
            disabled={lifelinesRemaining <= 0 || currentEliminated.size > 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${lifelinesRemaining > 0 && currentEliminated.size === 0
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-950/70'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
              }`}
            title="Hapus 2 Opsi Salah (Max 3 kali)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">50:50</span>
            <span className="bg-purple-200/80 dark:bg-purple-800/80 text-purple-900 dark:text-purple-100 px-1.5 py-0.2 rounded-full text-[10px]">
              {lifelinesRemaining}
            </span>
          </button>

          <button
            onClick={handleToggleDoubt}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${currentAnswer?.isDoubtful
              ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
              : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#536471] dark:text-slate-300 border-[#EFF3F4] dark:border-[#1E293B] hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
          >
            <Flag className={`w-3.5 h-3.5 ${currentAnswer?.isDoubtful ? 'fill-slate-900' : ''}`} />
            <span>Ragu-ragu</span>
          </button>
        </div>

        {/* Right Controls: Prev & Next Question */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-40 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1 px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
          >
            <span>Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* MOBILE / TABLET MATRIKS DRAWER */}
      {isGridOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex justify-end xl:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B0F19] h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 border-l dark:border-[#1E293B]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B] mb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Matriks Navigasi</h4>
                  <p className="text-[11px] text-[#536471] dark:text-slate-400">Lompat langsung ke soal</p>
                </div>
                <button
                  onClick={() => setIsGridOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center text-[#536471] dark:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid 1 to N */}
              <div className="grid grid-cols-5 gap-1.5 max-h-[70vh] overflow-y-auto">
                {questions.map((q, idx) => {
                  const ans = userAnswers[q.id];
                  const hasAnswer = ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined;
                  const isDoubt = ans?.isDoubtful;
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsGridOpen(false);
                      }}
                      className={`h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center relative ${isCurrent ? 'ring-2 ring-[#0F1419] dark:ring-white' : ''
                        } ${isDoubt
                          ? 'bg-amber-400 text-slate-900'
                          : hasAnswer
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#F8FAFC] dark:bg-[#090D16] text-[#536471] dark:text-slate-400'
                        }`}
                    >
                      <span>{idx + 1}</span>
                      {hasAnswer && (
                        <span className="absolute bottom-0.5 text-[8px] font-mono opacity-80">
                          {String.fromCharCode(65 + ans!.selectedOptionIndex!)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setIsGridOpen(false);
                setIsConfirmFinishOpen(true);
              }}
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM FINISH DIALOG */}
      {isConfirmFinishOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B0F19] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-transparent dark:border-[#1E293B]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-[#0F1419] dark:text-white">Kumpulkan Ujian Sekarang?</h3>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-1 leading-relaxed">
                Kamu sudah menjawab <span className="font-extrabold text-[#2563EB] dark:text-[#38BDF8]">{answeredCount}</span> dari{' '}
                <span className="font-extrabold text-[#0F1419] dark:text-white">{questions.length}</span> soal.
                Nilai dan kelulusan Passing Grade akan langsung dihitung.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setIsConfirmFinishOpen(false)}
                className="py-2.5 px-4 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
              >
                Lanjutkan Ujian
              </button>
              <button
                onClick={() => {
                  setIsConfirmFinishOpen(false);
                  handleFinish();
                }}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM EXIT DIALOG */}
      {isConfirmExitOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B0F19] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-transparent dark:border-[#1E293B]">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800/40">
              <X className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-[#0F1419] dark:text-white">Batalkan Sesi Ujian?</h3>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-1 leading-relaxed">
                Yakin ingin keluar dan kembali ke lobby? Progres jawaban sesi ini tidak akan disimpan ke rapor evaluasi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setIsConfirmExitOpen(false)}
                className="py-2.5 px-4 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
              >
                Lanjut Ujian
              </button>
              <button
                onClick={() => {
                  setIsConfirmExitOpen(false);
                  onClose();
                }}
                className="py-2.5 px-4 bg-[#0F1419] dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#0F1419] font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Keluar ke Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
