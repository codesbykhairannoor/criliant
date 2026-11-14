'use client';

import React from 'react';
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, X, BrainCircuit } from 'lucide-react';

interface ProofOfCompetenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectToQuiz: () => void;
}

export const ProofOfCompetenceModal: React.FC<ProofOfCompetenceModalProps> = ({
  isOpen,
  onClose,
  onDirectToQuiz,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B0F19] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-[#1E293B] space-y-5 animate-in zoom-in-95 duration-200 transition-colors">
        {/* Header with Close */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                Anti-Bot & Sybil Defense
              </span>
              <h3 className="font-black text-[#0F1419] dark:text-white text-lg mt-0.5 leading-snug">
                Verifikasi Proof of Competence
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Value Proposition & Logic */}
        <div className="space-y-3 text-xs text-[#536471] dark:text-slate-300 leading-relaxed">
          <p>
            Hak suara <span className="font-bold text-[#0F1419] dark:text-white">Upvote</span> dan{' '}
            <span className="font-bold text-[#0F1419] dark:text-white">Downvote</span> dikunci sementara untuk mencegah bot kompetitor, serangan spam karma, dan manipulasi feed.
          </p>

          <div className="bg-[#F8FAFC] dark:bg-[#090D16] p-3.5 rounded-2xl border border-[#EFF3F4] dark:border-[#1E293B] space-y-2.5">
            <div className="flex items-start gap-2.5">
              <BrainCircuit className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#0F1419] dark:text-white block">Tanpa CAPTCHA Menyebalkan</span>
                <span className="text-[11px] text-[#536471] dark:text-slate-400">
                  Gak perlu klik gambar lampu merah atau tebak huruf bengkok.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#0F1419] dark:text-white block">Cukup Jawab 1 Kuis Mikro</span>
                <span className="text-[11px] text-[#536471] dark:text-slate-400">
                  Jawab minimal 1 kuis di stream untuk membuktikan kamu pejuang sungguhan (bukan bot).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#0F1419] dark:text-white block">Reward +15 Reputasi Karma</span>
                <span className="text-[11px] text-[#536471] dark:text-slate-400">
                  Akunmu langsung berstatus <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Verified Human</strong> dan hak suara terbuka permanen.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onDirectToQuiz();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Kerjakan Kuis Mikro Sekarang (15 Detik)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#536471] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

