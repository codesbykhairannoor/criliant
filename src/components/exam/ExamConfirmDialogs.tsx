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
        <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B0F19] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-transparent dark:border-[#1E293B]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-[#0F1419] dark:text-white">Kumpulkan Ujian Sekarang?</h3>
              <p className="text-xs text-[#536471] dark:text-slate-400 mt-1 leading-relaxed">
                Kamu sudah menjawab{' '}
                <span className="font-extrabold text-[#2563EB] dark:text-[#38BDF8]">{answeredCount}</span> dari{' '}
                <span className="font-extrabold text-[#0F1419] dark:text-white">{totalQuestions}</span> soal.
                Nilai dan evaluasi akhir akan langsung dihitung.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={onCancelFinish}
                className="py-2.5 px-4 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
              >
                Lanjutkan Ujian
              </button>
              <button
                onClick={onConfirmFinish}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={onCancelExit}
                className="py-2.5 px-4 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#0F1419] dark:text-white font-bold text-xs rounded-xl border border-[#EFF3F4] dark:border-[#1E293B] transition-all"
              >
                Lanjut Ujian
              </button>
              <button
                onClick={onConfirmExit}
                className="py-2.5 px-4 bg-[#0F1419] dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#0F1419] font-extrabold text-xs rounded-xl shadow-sm transition-all"
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
