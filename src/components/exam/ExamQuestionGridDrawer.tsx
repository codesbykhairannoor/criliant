'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Question, UserAnswer } from '@/types';

interface ExamQuestionGridDrawerProps {
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  currentIndex: number;
  answeredCount: number;
  isDrawerOpen: boolean;
  onSelectIndex: (idx: number) => void;
  onCloseDrawer: () => void;
  onRequestFinish: () => void;
}

export const ExamQuestionGridDrawer: React.FC<ExamQuestionGridDrawerProps> = ({
  questions,
  userAnswers,
  currentIndex,
  answeredCount,
  isDrawerOpen,
  onSelectIndex,
  onCloseDrawer,
  onRequestFinish,
}) => {
  const renderGridButtons = (onItemClick: (idx: number) => void, itemHeight = 'h-10') => (
    <div className="grid grid-cols-5 gap-2 max-h-[58vh] overflow-y-auto pr-1 no-scrollbar">
      {questions.map((q, idx) => {
        const ans = userAnswers[q.id];
        const hasAnswer = ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined;
        const isDoubt = ans?.isDoubtful;
        const isCurrent = currentIndex === idx;

        return (
          <button
            key={q.id}
            onClick={() => onItemClick(idx)}
            className={`${itemHeight} rounded-xl text-xs font-semibold tabular-nums transition-all flex items-center justify-center gap-0.5 relative ${
              isCurrent
                ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-1 dark:ring-offset-[#0B0F19] z-10'
                : ''
            } ${
              isDoubt
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : hasAnswer
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#111726] text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <span>{idx + 1}</span>
            {hasAnswer && (
              <span className="text-xs font-mono opacity-85">
                {String.fromCharCode(65 + ans!.selectedOptionIndex!)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const legend = (
    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-[#111726] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dark:bg-[#38BDF8]" />
        <span>Terjawab</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span>Ragu</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span>Kosong</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Docked Sidebar */}
      <aside className="hidden xl:flex flex-col justify-between w-80 border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-5 overflow-y-auto transition-colors">
        <div>
          <div className="pb-3.5 border-b border-slate-200/80 dark:border-slate-800 mb-3.5">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Matriks Navigasi Soal</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pantau progres dan lompat ke nomor mana pun
            </p>
          </div>
          {legend}
          {renderGridButtons(onSelectIndex)}
        </div>

        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-2.5 tabular-nums">
            {answeredCount} dari {questions.length} soal selesai
          </span>
          <button
            onClick={onRequestFinish}
            className="w-full h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all"
          >
            Kumpulkan Ujian
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex justify-end xl:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B0F19] h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 border-l border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 mb-3.5">
                <div>
                  <h4 className="font-semibold text-base text-slate-900 dark:text-white">Matriks Navigasi</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lompat langsung ke soal</p>
                </div>
                <button
                  onClick={onCloseDrawer}
                  aria-label="Tutup matriks"
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </button>
              </div>
              {legend}
              {renderGridButtons((idx) => {
                onSelectIndex(idx);
                onCloseDrawer();
              }, 'h-11')}
            </div>

            <button
              onClick={() => {
                onCloseDrawer();
                onRequestFinish();
              }}
              className="w-full mt-4 h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all tabular-nums"
            >
              Kumpulkan Ujian ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
};
