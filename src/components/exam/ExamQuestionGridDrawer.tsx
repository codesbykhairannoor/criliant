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
  const renderGridButtons = (onItemClick: (idx: number) => void, itemHeight = 'h-9') => (
    <div className="grid grid-cols-5 gap-1.5 max-h-[58vh] overflow-y-auto pr-1 no-scrollbar">
      {questions.map((q, idx) => {
        const ans = userAnswers[q.id];
        const hasAnswer = ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined;
        const isDoubt = ans?.isDoubtful;
        const isCurrent = currentIndex === idx;

        return (
          <button
            key={q.id}
            onClick={() => onItemClick(idx)}
            className={`${itemHeight} rounded-xl text-xs font-extrabold transition-all flex items-center justify-center relative ${
              isCurrent
                ? 'ring-2 ring-[#0F1419] dark:ring-white ring-offset-1 dark:ring-offset-[#0B0F19] z-10'
                : ''
            } ${
              isDoubt
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
  );

  const legend = (
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
  );

  return (
    <>
      {/* Desktop Docked Sidebar */}
      <aside className="hidden xl:flex flex-col justify-between w-80 border-l border-[#EFF3F4] dark:border-[#1E293B] bg-white dark:bg-[#0B0F19] p-5 overflow-y-auto transition-colors">
        <div>
          <div className="pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B] mb-3">
            <h4 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Matriks Navigasi Soal</h4>
            <p className="text-[11px] text-[#536471] dark:text-slate-400">
              Pantau progres dan lompat ke nomor mana pun
            </p>
          </div>
          {legend}
          {renderGridButtons(onSelectIndex)}
        </div>

        <div className="pt-3 border-t border-[#EFF3F4] dark:border-[#1E293B] text-center">
          <span className="text-[11px] text-[#536471] dark:text-slate-400 font-medium block mb-2">
            {answeredCount} dari {questions.length} soal selesai
          </span>
          <button
            onClick={onRequestFinish}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
          >
            Kumpulkan Ujian
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex justify-end xl:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B0F19] h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 border-l dark:border-[#1E293B]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4] dark:border-[#1E293B] mb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0F1419] dark:text-white">Matriks Navigasi</h4>
                  <p className="text-[11px] text-[#536471] dark:text-slate-400">Lompat langsung ke soal</p>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center text-[#536471] dark:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {legend}
              {renderGridButtons((idx) => {
                onSelectIndex(idx);
                onCloseDrawer();
              }, 'h-10')}
            </div>

            <button
              onClick={() => {
                onCloseDrawer();
                onRequestFinish();
              }}
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Kumpulkan Ujian ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
};
