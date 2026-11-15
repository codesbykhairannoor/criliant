'use client';

import React, { useState, useEffect } from 'react';
import { MicroQuizData } from '@/types';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MicroQuizCardProps {
  postId: string;
  quiz: MicroQuizData;
  onAnswerQuiz?: (postId: string, selectedIndex: number, isCorrect: boolean) => void;
}

export const MicroQuizCard: React.FC<MicroQuizCardProps> = ({
  postId,
  quiz,
  onAnswerQuiz,
}) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(
    quiz.userSelectedIndex ?? null
  );
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  useEffect(() => {
    setSelectedQuizOption(quiz.userSelectedIndex ?? null);
  }, [quiz.userSelectedIndex]);

  const handleSelectQuiz = (index: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(index);

    const isCorrect = index === quiz.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    onAnswerQuiz?.(postId, index, isCorrect);
  };

  return (
    <div className="bg-slate-50/90 dark:bg-[#0D1322] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/90 mb-3.5 space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Kuis Mikro</span>
        </div>
        <span className="font-medium tabular-nums">
          {quiz.totalVotes} peserta
        </span>
      </div>

      <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
        {quiz.questionText}
      </p>

      {/* Options */}
      <div className="space-y-2 pt-0.5">
        {quiz.options.map((opt) => {
          const isSelected = selectedQuizOption === opt.index;
          const hasAnswered = selectedQuizOption !== null;
          const isCorrect = opt.index === quiz.correctIndex;

          return (
            <button
              key={opt.index}
              type="button"
              onClick={() => handleSelectQuiz(opt.index)}
              disabled={hasAnswered}
              className={`w-full min-h-[44px] relative overflow-hidden rounded-xl border py-2.5 px-3.5 text-left text-sm font-medium transition-colors flex items-center justify-between gap-3 ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                    : isSelected
                      ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] text-slate-400 dark:text-slate-500 opacity-75'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111726] text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:text-[#2563EB] dark:hover:text-blue-400'
              }`}
            >
              {hasAnswered && (
                <div
                  className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-700 ${
                    isCorrect ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${opt.votePercentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    hasAnswered && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : hasAnswered && isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + opt.index)}
                </span>
                <span className="break-words">{opt.text}</span>
              </div>

              {hasAnswered && (
                <span className="relative z-10 text-xs font-semibold tabular-nums flex-shrink-0">
                  {opt.votePercentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Accordion */}
      {selectedQuizOption !== null && (
        <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800/80 text-sm">
          <button
            type="button"
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className="flex items-center justify-between w-full h-9 font-semibold text-[#2563EB] dark:text-blue-400"
          >
            <span>{isExplanationOpen ? 'Tutup Pembahasan' : 'Lihat Kunci & Pembahasan'}</span>
            {isExplanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExplanationOpen && (
            <div className="mt-2 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 text-sm text-slate-700 dark:text-slate-200 border border-blue-200/50 dark:border-blue-900/50 leading-relaxed animate-in fade-in duration-200">
              <p>{quiz.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
