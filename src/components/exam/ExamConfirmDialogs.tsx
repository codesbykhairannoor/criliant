'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ExamConfirmDialogsProps {
  isConfirmFinishOpen: boolean;
  isConfirmExitOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  onCancelFinish: () => void;
  onConfirmFinish: () => void;
  onCancelExit: () => void;
  onConfirmExit: () => void;
}

export const ExamConfirmDialogs: React.FC<ExamConfirmDialogsProps> = ({
  isConfirmFinishOpen,
  isConfirmExitOpen,
  answeredCount,
  totalQuestions,
  onCancelFinish,
  onConfirmFinish,
  onCancelExit,
  onConfirmExit,
}) => {
  return (
    <>
      {isConfirmFinishOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/40">
              <AlertTriangle className="w-5 h-5" strokeWidth={1.85} />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">Kumpulkan Ujian Sekarang?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed tabular-nums">
                Kamu sudah menjawab{' '}
                <span className="font-semibold text-[#2563EB] dark:text-[#38BDF8]">{answeredCount}</span> dari{' '}
                <span className="font-semibold text-slate-900 dark:text-white">{totalQuestions}</span> soal.
                Nilai dan evaluasi akhir akan langsung dihitung.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={onCancelFinish}
                className="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all"
              >
                Lanjutkan Ujian
              </button>
              <button
                onClick={onConfirmFinish}
                className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmExitOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111726] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/60 dark:border-rose-800/40">
              <X className="w-5 h-5" strokeWidth={1.85} />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">Batalkan Sesi Ujian?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Yakin ingin keluar dan kembali ke lobby? Progres jawaban sesi ini tidak akan disimpan ke rapor evaluasi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={onCancelExit}
                className="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all"
              >
                Lanjut Ujian
              </button>
              <button
                onClick={onConfirmExit}
                className="h-10 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm rounded-xl shadow-xs transition-all"
              >
                Keluar ke Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
