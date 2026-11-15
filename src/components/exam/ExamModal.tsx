'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Question,
  UserAnswer,
  ExamMode,
  ExamResultSummary,
  QuestionReviewItem,
  StudyTrack,
} from '@/types';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Flag,
  Check,
} from 'lucide-react';
import {
  PASSING_GRADE_TWK,
  PASSING_GRADE_TIU,
  PASSING_GRADE_TKP,
} from '@/data/constants';
import { ExamHeader } from './ExamHeader';
import { ExamQuestionGridDrawer } from './ExamQuestionGridDrawer';
import { ExamConfirmDialogs } from './ExamConfirmDialogs';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  mode: ExamMode;
  track?: StudyTrack;
  examTitle?: string;
  isFullCpnsSkd?: boolean;
  contestId?: string;
  durationSeconds: number;
  onFinishExam: (summary: ExamResultSummary) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  questions,
  mode,
  track = 'cpns',
  examTitle,
  isFullCpnsSkd = false,
  contestId,
  durationSeconds,
  onFinishExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, Set<number>>>({});
  const [lifelinesRemaining, setLifelinesRemaining] = useState(3);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isConfirmFinishOpen, setIsConfirmFinishOpen] = useState(false);
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);

  const hasFinishedRef = useRef(false);

  // Initialize and reset state whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    hasFinishedRef.current = false;
    setRemainingSeconds(durationSeconds);
    setCurrentIndex(0);
    setUserAnswers({});
    setEliminatedOptions({});
    setLifelinesRemaining(3);
    setIsGridOpen(false);
    setIsConfirmFinishOpen(false);
    setIsConfirmExitOpen(false);

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, durationSeconds]);

  const currentQ = questions[currentIndex] || questions[0];
  const currentAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const currentEliminated = currentQ ? eliminatedOptions[currentQ.id] || new Set<number>() : new Set<number>();

  // Select Option (Toggle answer)
  const handleSelectOption = useCallback(
    (idx: number) => {
      if (!currentQ || currentEliminated.has(idx) || idx >= currentQ.options.length) return;

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
    },
    [currentQ, currentEliminated]
  );

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
      if (sorted[0]) toEliminate.add(sorted[0].i);
      if (sorted[1]) toEliminate.add(sorted[1].i);
    } else {
      const wrongIndices = currentQ.options
        .map((_, i) => i)
        .filter((i) => i !== currentQ.correctOptionIndex);
      const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
      if (shuffled[0] !== undefined) toEliminate.add(shuffled[0]);
      if (shuffled[1] !== undefined) toEliminate.add(shuffled[1]);
    }

    setEliminatedOptions((prev) => ({
      ...prev,
      [currentQ.id]: toEliminate,
    }));
    setLifelinesRemaining((prev) => Math.max(0, prev - 1));

    if (
      currentAnswer?.selectedOptionIndex !== null &&
      currentAnswer?.selectedOptionIndex !== undefined &&
      toEliminate.has(currentAnswer.selectedOptionIndex)
    ) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...currentAnswer,
          selectedOptionIndex: null,
        },
      }));
    }
  }, [currentQ, lifelinesRemaining, currentEliminated, currentAnswer]);

  // Finish and evaluate accurately across tracks and drill modes
  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

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
        if (selected !== null && q.tkpOptionPoints) {
          score = q.tkpOptionPoints[selected] ?? 0;
        } else {
          score = 0;
        }
        isCorrect = score === 5;
      } else {
        isCorrect = selected !== null && selected === q.correctOptionIndex;
        score = isCorrect ? 5 : 0;
      }

      if (isCorrect) correct++;

      if (q.category === 'TWK') twk += score;
      else if (q.category === 'TIU') tiu += score;
      else if (q.category === 'TKP') tkp += score;

      return {
        question: q,
        selectedOptionIndex: selected,
        earnedScore: score,
        isCorrect,
      };
    });

    const total = reviewItems.reduce((sum, item) => sum + item.earnedScore, 0);
    const maxPossibleScore = questions.length * 5;
    const isFullSkd =
      isFullCpnsSkd ||
      (track === 'cpns' &&
        questions.length >= 90 &&
        questions.some((q) => q.category === 'TWK') &&
        questions.some((q) => q.category === 'TIU') &&
        questions.some((q) => q.category === 'TKP'));

    const isTwkPassed = isFullSkd ? twk >= PASSING_GRADE_TWK : true;
    const isTiuPassed = isFullSkd ? tiu >= PASSING_GRADE_TIU : true;
    const isTkpPassed = isFullSkd ? tkp >= PASSING_GRADE_TKP : true;
    const isOverallPassed = isFullSkd
      ? isTwkPassed && isTiuPassed && isTkpPassed
      : maxPossibleScore > 0
        ? total / maxPossibleScore >= 0.65
        : false;

    const summary: ExamResultSummary = {
      mode,
      track,
      examTitle: examTitle || (track === 'cpns' ? 'Simulasi CAT BKN' : track === 'snbt' ? 'Simulasi SNBT UTBK' : 'Simulasi SPMB Kedinasan'),
      isFullCpnsSkd: isFullSkd,
      maxPossibleScore,
      contestId,
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
      timeSpentSeconds: Math.max(0, durationSeconds - remainingSeconds),
      reviewItems,
      createdAt: Date.now(),
    };

    onFinishExam(summary);
  }, [questions, userAnswers, isFullCpnsSkd, track, mode, examTitle, contestId, durationSeconds, remainingSeconds, onFinishExam]);

  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // Auto-submit cleanly when timer hits 0 (never inside setState updater!)
  useEffect(() => {
    if (isOpen && remainingSeconds === 0 && questions.length > 0 && !hasFinishedRef.current) {
      handleFinishRef.current();
    }
  }, [isOpen, remainingSeconds, questions.length]);

  // Keyboard Shortcuts
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
  }, [
    isOpen,
    isConfirmFinishOpen,
    isConfirmExitOpen,
    isGridOpen,
    questions.length,
    handleSelectOption,
    handleToggleDoubt,
    handleUseLifeline,
  ]);

  if (!isOpen || questions.length === 0) return null;

  const answeredCount = Object.values(userAnswers).filter((a) => a.selectedOptionIndex !== null).length;
  const displayTitle =
    examTitle ||
    (track === 'cpns' ? 'CAT BKN SIMULATOR' : track === 'snbt' ? 'UTBK SNBT SIMULATOR' : 'SPMB KEDINASAN');

  const categoryBadgeClass =
    currentQ.category === 'TWK'
      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-900/40'
      : currentQ.category === 'TIU' || currentQ.category.includes('KUANTITATIF') || currentQ.category.includes('MATEMATIKA')
        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-900/40'
        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40';

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-between overflow-hidden select-none transition-colors">
      {/* 1. TOP HEADER */}
      <ExamHeader
        title={displayTitle}
        track={track}
        mode={mode}
        remainingSeconds={remainingSeconds}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onRequestExit={() => setIsConfirmExitOpen(true)}
        onOpenGrid={() => setIsGridOpen(true)}
        onRequestFinish={() => setIsConfirmFinishOpen(true)}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-5 sm:space-y-6">
            {/* Top Breadcrumb & Question Number */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B]">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[11px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border flex-shrink-0 ${categoryBadgeClass}`}>
                  {currentQ.category.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-semibold text-[#536471] dark:text-slate-400 truncate">
                  Topik: <span className="text-[#0F1419] dark:text-white font-bold">{currentQ.subTopic}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs font-black text-[#536471] dark:text-slate-400">
                  No. {currentIndex + 1}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">/ {questions.length}</span>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="py-1 sm:py-2">
              <p className="text-[15px] sm:text-[17px] font-semibold text-[#0F1419] dark:text-white leading-relaxed whitespace-pre-line">
                {currentQ.text}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentAnswer?.selectedOptionIndex === idx;
                const isEliminated = currentEliminated.has(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isEliminated}
                    className={`w-full p-3 sm:p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 sm:gap-3.5 group relative ${
                      isEliminated
                        ? 'opacity-30 line-through bg-slate-100/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                        : isSelected
                          ? 'border-[#2563EB] dark:border-[#38BDF8] bg-blue-50/70 dark:bg-[#38BDF8]/10 text-[#0F1419] dark:text-white shadow-sm'
                          : 'border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#131D31] text-[#0F1419] dark:text-slate-100'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#2563EB] dark:bg-[#38BDF8] text-white dark:text-[#090D16] shadow-sm'
                          : 'bg-[#F8FAFC] dark:bg-[#090D16] text-[#536471] dark:text-slate-400 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-800 group-hover:text-[#0F1419] dark:group-hover:text-white'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <span className="pt-0.5 leading-relaxed flex-1">{opt}</span>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8] flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyboard Hint Strip */}
            <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-[#536471] dark:text-slate-400 pt-3">
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                  A-E
                </kbd>{' '}
                Pilih Opsi
              </span>
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                  R
                </kbd>{' '}
                Ragu-ragu
              </span>
              <span className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                  ← / →
                </kbd>{' '}
                Pindah Soal
              </span>
            </div>
          </div>
        </main>

        {/* Desktop Sidebar & Mobile Drawer Grid */}
        <ExamQuestionGridDrawer
          questions={questions}
          userAnswers={userAnswers}
          currentIndex={currentIndex}
          answeredCount={answeredCount}
          isDrawerOpen={isGridOpen}
          onSelectIndex={setCurrentIndex}
          onCloseDrawer={() => setIsGridOpen(false)}
          onRequestFinish={() => setIsConfirmFinishOpen(true)}
        />
      </div>

      {/* 3. BOTTOM NAVIGATION DOCK (Responsive for 360px mobile screens) */}
      <footer className="bg-white dark:bg-[#0B0F19] border-t border-[#EFF3F4] dark:border-[#1E293B] px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 shadow-sm z-20 transition-colors">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleUseLifeline}
            disabled={lifelinesRemaining <= 0 || currentEliminated.size > 0}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              lifelinesRemaining > 0 && currentEliminated.size === 0
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-950/70'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
            }`}
            title="Hapus 2 Opsi Salah (Max 3 kali)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">50:50</span>
            <span className="bg-purple-200/80 dark:bg-purple-800/80 text-purple-900 dark:text-purple-100 px-1.5 rounded-full text-[10px]">
              {lifelinesRemaining}
            </span>
          </button>

          <button
            onClick={handleToggleDoubt}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              currentAnswer?.isDoubtful
                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#536471] dark:text-slate-300 border-[#EFF3F4] dark:border-[#1E293B] hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${currentAnswer?.isDoubtful ? 'fill-slate-900' : ''}`} />
            <span className="sm:hidden">Ragu</span>
            <span className="hidden sm:inline">Ragu-ragu</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-40 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sebelumnya</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-1 px-3.5 sm:px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsConfirmFinishOpen(true)}
              className="flex items-center gap-1 px-3.5 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              <span>Kumpulkan</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>

      <ExamConfirmDialogs
        isConfirmFinishOpen={isConfirmFinishOpen}
        isConfirmExitOpen={isConfirmExitOpen}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onCancelFinish={() => setIsConfirmFinishOpen(false)}
        onConfirmFinish={() => {
          setIsConfirmFinishOpen(false);
          handleFinish();
        }}
        onCancelExit={() => setIsConfirmExitOpen(false)}
        onConfirmExit={() => {
          setIsConfirmExitOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
