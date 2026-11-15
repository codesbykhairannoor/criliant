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
    <div className="bg-slate-50/90 dark:bg-[#0D1322] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/90 mb-3 space-y-2.5">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Kuis Mikro</span>
        </div>
        <span className="text-[11px] font-medium">
          {quiz.totalVotes} peserta
        </span>
      </div>

      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
        {quiz.questionText}
      </p>

      {/* Options */}
      <div className="space-y-1.5 pt-1">
        {quiz.options.map((opt) => {
          const isSelected = selectedQuizOption === opt.index;
          const hasAnswered = selectedQuizOption !== null;
          const isCorrect = opt.index === quiz.correctIndex;

          return (
            <button
              key={opt.index}
              onClick={() => handleSelectQuiz(opt.index)}
              disabled={hasAnswered}
              className={`w-full relative overflow-hidden rounded-xl border p-2.5 text-left text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold'
                    : isSelected
                      ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162137] text-slate-400 dark:text-slate-500 opacity-70'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162137] text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
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

              <div className="relative z-10 flex items-center gap-2 min-w-0">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
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
                <span className="relative z-10 text-[11px] font-mono font-bold flex-shrink-0">
                  {opt.votePercentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Accordion */}
      {selectedQuizOption !== null && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <button
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className="flex items-center justify-between w-full font-bold text-blue-600 dark:text-blue-400"
          >
            <span>{isExplanationOpen ? 'Tutup Pembahasan' : '💡 Buka Kunci Jawaban & Pembahasan'}</span>
            {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExplanationOpen && (
            <div className="mt-2 p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 text-slate-700 dark:text-slate-200 border border-blue-200/50 dark:border-blue-900/50 leading-relaxed animate-in fade-in duration-200">
              <p>{quiz.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
